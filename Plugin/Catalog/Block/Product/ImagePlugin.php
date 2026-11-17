<?php
/**
 * Rollpix ProductGallery - Plugin to swap img for video on product listing pages
 *
 * Replaces product image HTML with video elements on category listing pages.
 * Supports local MP4, YouTube, and Vimeo videos.
 * Also wraps images in shimmer containers when the shimmer effect is enabled.
 *
 * @category  Rollpix
 * @package   Rollpix_ProductGallery
 */

declare(strict_types=1);

namespace Rollpix\ProductGallery\Plugin\Catalog\Block\Product;

use Magento\Catalog\Block\Product\Image as ImageBlock;
use Magento\Store\Model\StoreManagerInterface;
use Magento\Framework\UrlInterface;
use Magento\Framework\App\ResourceConnection;
use Rollpix\ProductGallery\Model\Config;
use Rollpix\ProductGallery\Model\VideoUrlParser;

class ImagePlugin
{
    private Config $config;
    private VideoUrlParser $videoUrlParser;
    private StoreManagerInterface $storeManager;
    private ResourceConnection $resourceConnection;

    /**
     * Static cache for video data loaded from DB (avoids duplicate queries per request).
     * @var array<int, array|null>
     */
    private static array $videoDataCache = [];

    public function __construct(
        Config $config,
        VideoUrlParser $videoUrlParser,
        StoreManagerInterface $storeManager,
        ResourceConnection $resourceConnection
    ) {
        $this->config = $config;
        $this->videoUrlParser = $videoUrlParser;
        $this->storeManager = $storeManager;
        $this->resourceConnection = $resourceConnection;
    }

    /**
     * After toHtml: replace <img> with video when product has video data.
     * Also wraps all listing images in shimmer container when enabled.
     */
    public function afterToHtml(ImageBlock $subject, string $result): string
    {
        $html = $this->injectVideoHtml($subject, $result);

        // Shimmer wrapper for all listing images
        if ($this->config->isShimmerEnabled()
            && trim($html) !== ''
            && !str_contains($html, 'rp-listing-shimmer')
        ) {
            /*
             * Guards: un $html vacío generaba un wrapper sin media adentro,
             * que se quedaba animando para siempre (nunca hay un evento
             * `load` que lo destape). El chequeo de la clase evita anidar
             * wrappers si el bloque se re-renderiza sobre HTML ya procesado.
             */
            $html = '<div class="rp-listing-shimmer">' . $html . '</div>';
        }

        return $html;
    }

    /**
     * Inject video into the original image HTML.
     *
     * For "image" player size: replaces the <img> tag inside the Magento
     * container, preserving the container's sizing (product-image-container).
     * For "video" player size: replaces the entire HTML with a 16:9 wrapper.
     */
    private function injectVideoHtml(ImageBlock $subject, string $result): string
    {
        $videoHtml = $this->getVideoHtml($subject, $result);
        if ($videoHtml === null) {
            return $result;
        }

        $playerSize = $this->config->getListingPlayerSize();

        if ($playerSize === 'video') {
            // "Video proportion" mode: standalone 16:9 wrapper replaces everything
            return $videoHtml;
        }

        /*
         * "Image size" mode: replace <img> inside the Magento container.
         * Callback en vez de reemplazo directo: $videoHtml es HTML arbitrario
         * con URLs, y preg_replace interpreta `$1`, `\1`, `$0`... en el string
         * de reemplazo. Una URL de video con `$` en el querystring rompía el
         * markup de forma silenciosa.
         */
        $replaced = preg_replace_callback(
            '/<img\b[^>]*\/?>/i',
            static fn (): string => $videoHtml,
            $result,
            1
        );

        return $replaced ?: $videoHtml;
    }

    /**
     * Attempt to build video HTML. Returns null if no video applies.
     */
    private function getVideoHtml(ImageBlock $subject, string $result): ?string
    {
        if (!$this->config->isVideoEnabled() || !$this->config->isVideoListingEnabled()) {
            return null;
        }

        // 1. Check if the image URL itself is an MP4
        $imagePath = $subject->getData('image_url') ?: '';
        if ($this->isVideoUrl($imagePath)) {
            $cleanUrl = $this->sanitizeVideoUrl($imagePath);
            return $this->buildLocalVideoHtml($cleanUrl, $subject);
        }

        // Fallback: check if the rendered HTML contains a video file reference
        if (preg_match('/\.mp4["\'\s?#]/', $result)) {
            $cleanUrl = $this->sanitizeVideoUrl($imagePath);
            return $this->buildLocalVideoHtml($cleanUrl, $subject);
        }

        // 2. Try pre-loaded video data from observer (fast path)
        $videoData = null;
        $product = $subject->getData('rp_product');
        if ($product) {
            $videoData = $product->getData('rp_listing_video');

            /*
             * `false` lo setea AddVideoDataPlugin para decir "el batch corrió
             * y este producto no tiene video". Cortar acá evita la query por
             * producto del fallback de abajo, que es el caso mayoritario en
             * cualquier listado real.
             */
            if ($videoData === false) {
                return null;
            }
        }

        // 3. Fallback: load video data directly from DB using product_id.
        // Sólo para bloques Image fuera de un listing enriquecido (widgets
        // sueltos, related/upsell renderizados por otro camino).
        if (!$videoData || !is_array($videoData)) {
            $productId = (int)($subject->getData('product_id') ?: 0);
            if ($productId) {
                $videoData = $this->loadVideoDataDirect($productId);
            }
        }

        if (!$videoData || !is_array($videoData)) {
            return null;
        }

        $provider = $videoData['provider'] ?? '';
        $videoUrl = $videoData['video_url'] ?? '';
        $thumbnail = $videoData['thumbnail'] ?? '';

        if (empty($videoUrl) || empty($provider)) {
            return null;
        }

        if ($provider === 'local') {
            return $this->buildLocalVideoHtml($videoUrl, $subject);
        }

        // YouTube or Vimeo
        return $this->buildExternalVideoHtml($videoUrl, $provider, $thumbnail, $subject);
    }

    /**
     * Load video data for a single product directly from DB.
     * Self-contained query — does NOT depend on ProductVideoDataLoader or Observer.
     * Uses static cache to avoid duplicate queries within the same request.
     */
    private function loadVideoDataDirect(int $productId): ?array
    {
        if (array_key_exists($productId, self::$videoDataCache)) {
            return self::$videoDataCache[$productId];
        }

        try {
            $storeId = (int)$this->storeManager->getStore()->getId();
        } catch (\Exception $e) {
            $storeId = 0;
        }

        try {
            $connection = $this->resourceConnection->getConnection();

            $galleryTable = $this->resourceConnection->getTableName(
                'catalog_product_entity_media_gallery'
            );
            $valueTable = $this->resourceConnection->getTableName(
                'catalog_product_entity_media_gallery_value'
            );
            $entityTable = $this->resourceConnection->getTableName(
                'catalog_product_entity_media_gallery_value_to_entity'
            );
            $videoTable = $this->resourceConnection->getTableName(
                'catalog_product_entity_media_gallery_value_video'
            );

            $select = $connection->select()
                ->from(['mgvte' => $entityTable], ['entity_id'])
                ->join(
                    ['mg' => $galleryTable],
                    'mg.value_id = mgvte.value_id',
                    ['file' => 'value']
                )
                ->join(
                    ['mgv' => $valueTable],
                    $connection->quoteInto(
                        'mgv.value_id = mgvte.value_id AND (mgv.store_id = 0 OR mgv.store_id = ?)',
                        $storeId,
                        \Zend_Db::INT_TYPE
                    ),
                    ['position']
                )
                ->joinLeft(
                    ['mgvv' => $videoTable],
                    $connection->quoteInto(
                        'mgvv.value_id = mgvte.value_id AND (mgvv.store_id = 0 OR mgvv.store_id = ?)',
                        $storeId,
                        \Zend_Db::INT_TYPE
                    ),
                    ['video_url' => 'url', 'provider']
                )
                ->where('mgvte.entity_id = ?', $productId)
                ->where('mg.media_type = ?', 'external-video')
                ->where('COALESCE(mgv.disabled, 0) = 0')
                ->order('mgv.position ASC')
                ->limit(1);

            $row = $connection->fetchRow($select);

            if (!$row) {
                self::$videoDataCache[$productId] = null;
                return null;
            }

            $provider = $row['provider'] ?? '';
            $videoUrl = $row['video_url'] ?? '';
            $file = $row['file'] ?? '';

            // Detect provider from video URL when DB field is empty
            if (empty($provider) && !empty($videoUrl)) {
                $parsed = $this->videoUrlParser->parse($videoUrl);
                if ($parsed) {
                    $provider = $parsed['provider'];
                }
            }

            // Detect local MP4 by file extension if still no provider
            if (empty($provider) && !empty($file)) {
                $ext = strtolower(pathinfo($file, PATHINFO_EXTENSION));
                if ($ext === 'mp4') {
                    $provider = 'local';
                }
            }

            // For local MP4: build URL from gallery file path
            if ($provider === 'local' && !empty($file)) {
                $mediaUrl = $this->storeManager->getStore()
                    ->getBaseUrl(UrlInterface::URL_TYPE_MEDIA);
                $videoUrl = $mediaUrl . 'catalog/product' . $file;
            }

            if (empty($videoUrl) || empty($provider)) {
                self::$videoDataCache[$productId] = null;
                return null;
            }

            // Build thumbnail URL for external videos
            $thumbnailUrl = '';
            if ($provider !== 'local' && !empty($file)) {
                $mediaUrl = $this->storeManager->getStore()
                    ->getBaseUrl(UrlInterface::URL_TYPE_MEDIA);
                $thumbnailUrl = $mediaUrl . 'catalog/product' . $file;
            }

            $data = [
                'video_url' => $videoUrl,
                'provider' => $provider,
                'thumbnail' => $thumbnailUrl,
            ];

            self::$videoDataCache[$productId] = $data;
            return $data;
        } catch (\Exception $e) {
            self::$videoDataCache[$productId] = null;
            return null;
        }
    }

    /**
     * Build HTML5 <video> for local MP4 files.
     */
    private function buildLocalVideoHtml(string $videoUrl, ImageBlock $subject): string
    {
        $attrs = [];

        if ($this->config->isListingAutoplay()) {
            $attrs[] = 'autoplay';
        }
        if ($this->config->isVideoLoop()) {
            $attrs[] = 'loop';
        }
        if ($this->config->isVideoMuted()) {
            $attrs[] = 'muted';
        }

        $attrs[] = 'playsinline';
        $attrs[] = 'preload="metadata"';

        $videoFit = $this->config->getListingVideoFit();
        $attrsStr = implode(' ', $attrs);
        $wrapperStyle = $this->getListingWrapperStyle();
        $styleAttr = $wrapperStyle ? ' style="' . $wrapperStyle . '"' : '';

        $html = '<div class="rp-listing-video-wrapper" data-video-provider="local"'
            . $styleAttr . '>'
            . '<video ' . $attrsStr
            . ' class="rp-listing-video"'
            . ' style="width:100%;height:100%;object-fit:' . htmlspecialchars($videoFit) . ';background:#000;"'
            . '>'
            . '<source src="' . htmlspecialchars($videoUrl) . '" type="video/mp4"/>'
            . '</video>';

        if ($this->config->isListingControlsEnabled()) {
            $html .= $this->buildPlayStopButton();
        }

        $html .= '</div>';

        return $html;
    }

    /**
     * Build iframe facade HTML for YouTube/Vimeo videos.
     */
    private function buildExternalVideoHtml(
        string $videoUrl,
        string $provider,
        string $thumbnailUrl,
        ImageBlock $subject
    ): string {
        $parsed = $this->videoUrlParser->parse($videoUrl);
        if (!$parsed) {
            return '';
        }

        $params = $this->videoUrlParser->buildEmbedParams(
            $parsed['provider'],
            $this->config->isListingAutoplay(),
            $this->config->isVideoMuted(),
            $this->config->isVideoLoop(),
            // Never the provider's own player chrome in a product card: it flashed
            // over the thumbnail before the video started (WE-15768). The only
            // control in the listing is ours (.rp-listing-playstop, toggled by
            // rollpix_gallery/video/listing_controls), driven by postMessage.
            false,
            $parsed['id']
        );

        $embedUrl = $this->videoUrlParser->getEmbedUrl($parsed['provider'], $parsed['id'], $params);
        $wrapperStyle = $this->getListingWrapperStyle();
        $styleAttr = $wrapperStyle ? ' style="' . $wrapperStyle . '"' : '';

        $html = '<div class="rp-listing-video-wrapper rp-listing-video-external"'
            . ' data-video-provider="' . htmlspecialchars($provider) . '"'
            . ' data-embed-url="' . htmlspecialchars($embedUrl) . '"'
            . $styleAttr . '>';

        if (!empty($thumbnailUrl)) {
            $html .= '<div class="rp-listing-video-facade"'
                . ' style="background-image: url(\'' . htmlspecialchars($thumbnailUrl) . '\')">'
                . '<button class="rp-listing-play-btn" type="button" aria-label="Play video">'
                . '<svg width="48" height="48" viewBox="0 0 48 48">'
                . '<circle cx="24" cy="24" r="22" fill="rgba(0,0,0,0.65)"/>'
                . '<polygon points="19,14 19,34 37,24" fill="#fff"/>'
                . '</svg>'
                . '</button>'
                . '</div>';
        } else {
            $html .= '<iframe src="' . htmlspecialchars($embedUrl) . '"'
                . ' class="rp-listing-video-iframe"'
                . ' frameborder="0"'
                . ' allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"'
                . ' referrerpolicy="strict-origin-when-cross-origin"'
                . ' allowfullscreen'
                . ' loading="lazy">'
                . '</iframe>';
        }

        if ($this->config->isListingControlsEnabled()) {
            $html .= $this->buildPlayStopButton();
        }

        $html .= '</div>';

        return $html;
    }

    /**
     * Build simplified play/stop button overlay for listing.
     */
    private function buildPlayStopButton(): string
    {
        return '<button class="rp-listing-playstop" type="button" aria-label="Play/Pause">'
            . '<svg class="rp-playstop-play" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">'
            . '<polygon points="5,3 19,12 5,21"/>'
            . '</svg>'
            . '<svg class="rp-playstop-pause" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" style="display:none">'
            . '<rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/>'
            . '</svg>'
            . '</button>';
    }

    /**
     * Build inline style for the listing video wrapper.
     * "image" mode: no inline sizing (Magento container handles it via CSS).
     * "video" mode: 16:9 filling available width.
     */
    private function getListingWrapperStyle(): string
    {
        $playerSize = $this->config->getListingPlayerSize();

        if ($playerSize === 'video') {
            return 'aspect-ratio:16/9;width:100%;';
        }

        // "image" mode: CSS .product-image-container .rp-listing-video-wrapper
        // handles position:absolute + width/height:100%
        return '';
    }

    /**
     * Strip Magento image cache path from MP4 URLs.
     */
    private function sanitizeVideoUrl(string $url): string
    {
        $sanitized = preg_replace('#/cache/[a-f0-9]+/#i', '/', $url);
        $sanitized = preg_replace('/\?.*$/', '', $sanitized);

        if (empty($sanitized) || !$this->isVideoUrl($sanitized)) {
            return $url;
        }

        return $sanitized;
    }

    private function isVideoUrl(string $url): bool
    {
        $path = parse_url($url, PHP_URL_PATH) ?: $url;
        return strtolower(pathinfo($path, PATHINFO_EXTENSION)) === 'mp4';
    }
}

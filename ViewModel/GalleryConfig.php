<?php
/**
 * Rollpix ProductGallery ViewModel
 *
 * @category  Rollpix
 * @package   Rollpix_ProductGallery
 */

declare(strict_types=1);

namespace Rollpix\ProductGallery\ViewModel;

use Magento\Framework\View\Element\Block\ArgumentInterface;
use Magento\Framework\Json\EncoderInterface;
use Rollpix\ProductGallery\Model\Config;

class GalleryConfig implements ArgumentInterface
{
    private Config $config;
    private EncoderInterface $jsonEncoder;

    public function __construct(
        Config $config,
        EncoderInterface $jsonEncoder
    ) {
        $this->config = $config;
        $this->jsonEncoder = $jsonEncoder;
    }

    public function getZoomType(): string
    {
        return $this->config->getZoomType();
    }

    public function getZoomLevel(): int
    {
        return $this->config->getZoomLevel();
    }

    public function getZoomPosition(): string
    {
        return $this->config->getZoomPosition();
    }

    public function getLayoutType(): string
    {
        return $this->config->getLayoutType();
    }

    public function getGalleryPosition(): string
    {
        return $this->config->getGalleryPosition();
    }

    public function getColumnRatio(): string
    {
        return $this->config->getColumnRatio();
    }

    public function getGridRatio(): string
    {
        return $this->config->getGridRatio();
    }

    public function getGridImageColumns(): int
    {
        return $this->config->getGridImageColumns();
    }

    public function getImageGap(): int
    {
        return $this->config->getImageGap();
    }

    public function getMobileBehavior(): string
    {
        return $this->config->getMobileBehavior();
    }

    public function isStickyEnabled(): bool
    {
        return $this->config->isStickyEnabled();
    }

    public function getStickyMode(): string
    {
        return $this->config->getStickyMode();
    }

    public function getStickyOffset(): int
    {
        return $this->config->getStickyOffset();
    }

    public function isInlineTabsEnabled(): bool
    {
        return $this->config->isInlineTabsEnabled();
    }

    /**
     * Get JS configuration as JSON
     */
    public function getJsConfigJson(): string
    {
        return $this->jsonEncoder->encode($this->config->getJsConfig());
    }

    /**
     * Get column CSS values based on layout type, ratio and position
     */
    public function getColumnCss(): array
    {
        $layoutType = $this->getLayoutType();
        $position = $this->getGalleryPosition();

        if ($layoutType === 'grid' || $layoutType === 'fashion') {
            $gridRatio = $this->getGridRatio();
            $parts = explode('_', $gridRatio);
            $col1 = (int) ($parts[0] ?? 70);
            $col2 = (int) ($parts[1] ?? 30);
            $columns = [$col1 . 'fr', $col2 . 'fr'];

            if ($position === 'right') {
                $columns = array_reverse($columns);
            }

            $result = [
                'col1' => $columns[0],
                'col2' => $columns[1],
                'galleryOrder' => $position === 'left' ? 1 : 2,
                'infoOrder' => $position === 'left' ? 2 : 1
            ];

            if ($layoutType === 'grid') {
                $result['gridImageColumns'] = $this->getGridImageColumns();
            }

            return $result;
        }

        // Vertical layout
        $ratio = $this->getColumnRatio();
        $parts = explode('_', $ratio);
        $col1 = (int) ($parts[0] ?? 50);
        $col2 = (int) ($parts[1] ?? 50);
        $columns = [$col1 . 'fr', $col2 . 'fr'];

        if ($position === 'right') {
            $columns = array_reverse($columns);
        }

        return [
            'col1' => $columns[0],
            'col2' => $columns[1],
            'galleryOrder' => $position === 'left' ? 1 : 2,
            'infoOrder' => $position === 'left' ? 2 : 1
        ];
    }
}

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

    public function getGalleryPosition(): string
    {
        return $this->config->getGalleryPosition();
    }

    public function getColumnRatio(): string
    {
        return $this->config->getColumnRatio();
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

    public function getStickyOffset(): int
    {
        return $this->config->getStickyOffset();
    }

    /**
     * Get JS configuration as JSON
     */
    public function getJsConfigJson(): string
    {
        return $this->jsonEncoder->encode($this->config->getJsConfig());
    }

    /**
     * Get column CSS values based on ratio and position
     */
    public function getColumnCss(): array
    {
        $ratio = $this->getColumnRatio();
        $position = $this->getGalleryPosition();

        $ratioMap = [
            '40_60' => ['40fr', '60fr'],
            '50_50' => ['1fr', '1fr'],
            '60_40' => ['60fr', '40fr']
        ];

        $columns = $ratioMap[$ratio] ?? ['1fr', '1fr'];

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

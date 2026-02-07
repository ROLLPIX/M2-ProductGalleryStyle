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

        if ($layoutType === 'grid') {
            $gridRatio = $this->getGridRatio();
            $gridRatioMap = [
                '70_30' => ['7fr', '3fr'],
                '75_25' => ['3fr', '1fr'],
                '80_20' => ['4fr', '1fr']
            ];
            $columns = $gridRatioMap[$gridRatio] ?? ['7fr', '3fr'];

            if ($position === 'right') {
                $columns = array_reverse($columns);
            }

            return [
                'col1' => $columns[0],
                'col2' => $columns[1],
                'galleryOrder' => $position === 'left' ? 1 : 2,
                'infoOrder' => $position === 'left' ? 2 : 1,
                'gridImageColumns' => $this->getGridImageColumns()
            ];
        }

        // Vertical layout
        $ratio = $this->getColumnRatio();
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

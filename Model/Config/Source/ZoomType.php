<?php
/**
 * Rollpix ProductGallery Zoom Type Source Model
 *
 * @category  Rollpix
 * @package   Rollpix_ProductGallery
 */

declare(strict_types=1);

namespace Rollpix\ProductGallery\Model\Config\Source;

use Magento\Framework\Data\OptionSourceInterface;

class ZoomType implements OptionSourceInterface
{
    public const ZOOM_HOVER = 'hover';
    public const ZOOM_LIGHTBOX = 'lightbox';
    public const ZOOM_CLICK = 'click';
    public const ZOOM_DISABLED = 'disabled';

    /**
     * @inheritdoc
     */
    public function toOptionArray(): array
    {
        return [
            ['value' => self::ZOOM_HOVER, 'label' => __('Hover Magnifier')],
            ['value' => self::ZOOM_LIGHTBOX, 'label' => __('Lightbox (GLightbox)')],
            ['value' => self::ZOOM_CLICK, 'label' => __('Click to Zoom (inside image)')],
            ['value' => self::ZOOM_DISABLED, 'label' => __('Disabled')]
        ];
    }
}

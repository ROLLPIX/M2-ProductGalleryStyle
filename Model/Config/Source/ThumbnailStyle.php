<?php
/**
 * Rollpix ProductGallery Thumbnail Style Source Model
 *
 * @category  Rollpix
 * @package   Rollpix_ProductGallery
 */

declare(strict_types=1);

namespace Rollpix\ProductGallery\Model\Config\Source;

use Magento\Framework\Data\OptionSourceInterface;

class ThumbnailStyle implements OptionSourceInterface
{
    public const STYLE_OUTSIDE = 'outside';
    public const STYLE_OVERLAY = 'overlay';

    /**
     * @inheritdoc
     */
    public function toOptionArray(): array
    {
        return [
            ['value' => self::STYLE_OUTSIDE, 'label' => __('Outside image')],
            ['value' => self::STYLE_OVERLAY, 'label' => __('Inside image (overlay)')]
        ];
    }
}

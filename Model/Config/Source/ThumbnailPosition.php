<?php
/**
 * Rollpix ProductGallery Thumbnail Position Source Model
 *
 * @category  Rollpix
 * @package   Rollpix_ProductGallery
 */

declare(strict_types=1);

namespace Rollpix\ProductGallery\Model\Config\Source;

use Magento\Framework\Data\OptionSourceInterface;

class ThumbnailPosition implements OptionSourceInterface
{
    public const POSITION_DISABLED = 'disabled';
    public const POSITION_LEFT = 'left';
    public const POSITION_RIGHT = 'right';
    public const POSITION_BOTTOM = 'bottom';

    /**
     * @inheritdoc
     */
    public function toOptionArray(): array
    {
        return [
            ['value' => self::POSITION_DISABLED, 'label' => __('Disabled')],
            ['value' => self::POSITION_LEFT, 'label' => __('Left side')],
            ['value' => self::POSITION_RIGHT, 'label' => __('Right side')],
            ['value' => self::POSITION_BOTTOM, 'label' => __('Below images')]
        ];
    }
}

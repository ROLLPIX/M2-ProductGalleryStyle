<?php
/**
 * Rollpix ProductGallery Slider Direction Source Model
 *
 * @category  Rollpix
 * @package   Rollpix_ProductGallery
 */

declare(strict_types=1);

namespace Rollpix\ProductGallery\Model\Config\Source;

use Magento\Framework\Data\OptionSourceInterface;

class SliderDirection implements OptionSourceInterface
{
    public const DIRECTION_HORIZONTAL = 'horizontal';
    public const DIRECTION_VERTICAL = 'vertical';

    /**
     * @inheritdoc
     */
    public function toOptionArray(): array
    {
        return [
            ['value' => self::DIRECTION_HORIZONTAL, 'label' => __('Horizontal (left / right)')],
            ['value' => self::DIRECTION_VERTICAL, 'label' => __('Vertical (up / down)')]
        ];
    }
}

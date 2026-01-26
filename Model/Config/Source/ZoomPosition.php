<?php
/**
 * Rollpix ProductGallery Zoom Position Source Model
 *
 * @category  Rollpix
 * @package   Rollpix_ProductGallery
 */

declare(strict_types=1);

namespace Rollpix\ProductGallery\Model\Config\Source;

use Magento\Framework\Data\OptionSourceInterface;

class ZoomPosition implements OptionSourceInterface
{
    public const POSITION_RIGHT = 'right';
    public const POSITION_INSIDE = 'inside';

    /**
     * @inheritdoc
     */
    public function toOptionArray(): array
    {
        return [
            ['value' => self::POSITION_RIGHT, 'label' => __('Right Side')],
            ['value' => self::POSITION_INSIDE, 'label' => __('Inside Image')]
        ];
    }
}

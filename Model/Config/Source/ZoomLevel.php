<?php
/**
 * Rollpix ProductGallery Zoom Level Source Model
 *
 * @category  Rollpix
 * @package   Rollpix_ProductGallery
 */

declare(strict_types=1);

namespace Rollpix\ProductGallery\Model\Config\Source;

use Magento\Framework\Data\OptionSourceInterface;

class ZoomLevel implements OptionSourceInterface
{
    /**
     * @inheritdoc
     */
    public function toOptionArray(): array
    {
        return [
            ['value' => '2', 'label' => __('2x')],
            ['value' => '3', 'label' => __('3x')],
            ['value' => '4', 'label' => __('4x')],
            ['value' => '5', 'label' => __('5x')]
        ];
    }
}

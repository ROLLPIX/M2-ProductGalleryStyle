<?php
/**
 * Rollpix ProductGallery Grid Ratio Source Model
 *
 * @category  Rollpix
 * @package   Rollpix_ProductGallery
 */

declare(strict_types=1);

namespace Rollpix\ProductGallery\Model\Config\Source;

use Magento\Framework\Data\OptionSourceInterface;

class GridRatio implements OptionSourceInterface
{
    /**
     * @inheritdoc
     */
    public function toOptionArray(): array
    {
        return [
            ['value' => '70_30', 'label' => __('70% images / 30% info')],
            ['value' => '75_25', 'label' => __('75% images / 25% info')],
            ['value' => '80_20', 'label' => __('80% images / 20% info')]
        ];
    }
}

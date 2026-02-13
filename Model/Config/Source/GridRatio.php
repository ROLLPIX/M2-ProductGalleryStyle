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
            ['value' => '20_80', 'label' => __('20% images / 80% info')],
            ['value' => '25_75', 'label' => __('25% images / 75% info')],
            ['value' => '30_70', 'label' => __('30% images / 70% info')],
            ['value' => '35_65', 'label' => __('35% images / 65% info')],
            ['value' => '40_60', 'label' => __('40% images / 60% info')],
            ['value' => '45_55', 'label' => __('45% images / 55% info')],
            ['value' => '50_50', 'label' => __('50% images / 50% info')],
            ['value' => '55_45', 'label' => __('55% images / 45% info')],
            ['value' => '60_40', 'label' => __('60% images / 40% info')],
            ['value' => '65_35', 'label' => __('65% images / 35% info')],
            ['value' => '70_30', 'label' => __('70% images / 30% info')],
            ['value' => '75_25', 'label' => __('75% images / 25% info')],
            ['value' => '80_20', 'label' => __('80% images / 20% info')]
        ];
    }
}

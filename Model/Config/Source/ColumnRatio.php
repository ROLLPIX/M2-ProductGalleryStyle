<?php
/**
 * Rollpix ProductGallery Column Ratio Source Model
 *
 * @category  Rollpix
 * @package   Rollpix_ProductGallery
 */

declare(strict_types=1);

namespace Rollpix\ProductGallery\Model\Config\Source;

use Magento\Framework\Data\OptionSourceInterface;

class ColumnRatio implements OptionSourceInterface
{
    public const RATIO_40_60 = '40_60';
    public const RATIO_50_50 = '50_50';
    public const RATIO_60_40 = '60_40';

    /**
     * @inheritdoc
     */
    public function toOptionArray(): array
    {
        return [
            ['value' => self::RATIO_40_60, 'label' => __('40% / 60%')],
            ['value' => self::RATIO_50_50, 'label' => __('50% / 50%')],
            ['value' => self::RATIO_60_40, 'label' => __('60% / 40%')]
        ];
    }
}

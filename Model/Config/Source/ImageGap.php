<?php
/**
 * Rollpix ProductGallery Image Gap Source Model
 *
 * @category  Rollpix
 * @package   Rollpix_ProductGallery
 */

declare(strict_types=1);

namespace Rollpix\ProductGallery\Model\Config\Source;

use Magento\Framework\Data\OptionSourceInterface;

class ImageGap implements OptionSourceInterface
{
    /**
     * @inheritdoc
     */
    public function toOptionArray(): array
    {
        return [
            ['value' => '0', 'label' => __('0px (No gap)')],
            ['value' => '5', 'label' => __('5px')],
            ['value' => '10', 'label' => __('10px')],
            ['value' => '15', 'label' => __('15px')],
            ['value' => '20', 'label' => __('20px')],
            ['value' => '30', 'label' => __('30px')],
            ['value' => '40', 'label' => __('40px')]
        ];
    }
}

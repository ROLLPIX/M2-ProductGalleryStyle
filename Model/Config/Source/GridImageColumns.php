<?php
/**
 * Rollpix ProductGallery Grid Image Columns Source Model
 *
 * @category  Rollpix
 * @package   Rollpix_ProductGallery
 */

declare(strict_types=1);

namespace Rollpix\ProductGallery\Model\Config\Source;

use Magento\Framework\Data\OptionSourceInterface;

class GridImageColumns implements OptionSourceInterface
{
    /**
     * @inheritdoc
     */
    public function toOptionArray(): array
    {
        return [
            ['value' => '2', 'label' => __('2 columns')],
            ['value' => '3', 'label' => __('3 columns')]
        ];
    }
}

<?php
/**
 * Rollpix ProductGallery Layout Type Source Model
 *
 * @category  Rollpix
 * @package   Rollpix_ProductGallery
 */

declare(strict_types=1);

namespace Rollpix\ProductGallery\Model\Config\Source;

use Magento\Framework\Data\OptionSourceInterface;

class LayoutType implements OptionSourceInterface
{
    public const LAYOUT_VERTICAL = 'vertical';
    public const LAYOUT_GRID = 'grid';
    public const LAYOUT_FASHION = 'fashion';
    public const LAYOUT_MASONRY = 'masonry';

    /**
     * @inheritdoc
     */
    public function toOptionArray(): array
    {
        return [
            ['value' => self::LAYOUT_VERTICAL, 'label' => __('Vertical (single column of images)')],
            ['value' => self::LAYOUT_GRID, 'label' => __('Grid (multi-column images + info sidebar)')],
            ['value' => self::LAYOUT_FASHION, 'label' => __('Fashion (alternating 1-2 pattern)')],
            ['value' => self::LAYOUT_MASONRY, 'label' => __('Masonry (Pinterest-style columns)')]
        ];
    }
}

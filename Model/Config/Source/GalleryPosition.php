<?php
/**
 * Rollpix ProductGallery Gallery Position Source Model
 *
 * @category  Rollpix
 * @package   Rollpix_ProductGallery
 */

declare(strict_types=1);

namespace Rollpix\ProductGallery\Model\Config\Source;

use Magento\Framework\Data\OptionSourceInterface;

class GalleryPosition implements OptionSourceInterface
{
    public const POSITION_LEFT = 'left';
    public const POSITION_RIGHT = 'right';

    /**
     * @inheritdoc
     */
    public function toOptionArray(): array
    {
        return [
            ['value' => self::POSITION_LEFT, 'label' => __('Left')],
            ['value' => self::POSITION_RIGHT, 'label' => __('Right')]
        ];
    }
}

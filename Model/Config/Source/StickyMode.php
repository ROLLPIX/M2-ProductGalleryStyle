<?php
/**
 * Rollpix ProductGallery Sticky Mode Source Model
 *
 * @category  Rollpix
 * @package   Rollpix_ProductGallery
 */

declare(strict_types=1);

namespace Rollpix\ProductGallery\Model\Config\Source;

use Magento\Framework\Data\OptionSourceInterface;

class StickyMode implements OptionSourceInterface
{
    public const MODE_FRAME = 'frame';
    public const MODE_SCROLL = 'scroll';

    /**
     * @inheritdoc
     */
    public function toOptionArray(): array
    {
        return [
            ['value' => self::MODE_FRAME, 'label' => __('Frame (scrollable panel with fixed height)')],
            ['value' => self::MODE_SCROLL, 'label' => __('Natural scroll (info scrolls with page, sticks at bottom)')]
        ];
    }
}

<?php
/**
 * Rollpix ProductGallery Mobile Behavior Source Model
 *
 * @category  Rollpix
 * @package   Rollpix_ProductGallery
 */

declare(strict_types=1);

namespace Rollpix\ProductGallery\Model\Config\Source;

use Magento\Framework\Data\OptionSourceInterface;

class MobileBehavior implements OptionSourceInterface
{
    public const BEHAVIOR_STACK = 'stack';
    public const BEHAVIOR_CAROUSEL = 'carousel';

    /**
     * @inheritdoc
     */
    public function toOptionArray(): array
    {
        return [
            ['value' => self::BEHAVIOR_STACK, 'label' => __('Vertical Stack')],
            ['value' => self::BEHAVIOR_CAROUSEL, 'label' => __('Swipeable Carousel')]
        ];
    }
}

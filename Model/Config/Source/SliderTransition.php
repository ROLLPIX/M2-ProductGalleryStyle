<?php
/**
 * Rollpix ProductGallery Slider Transition Source Model
 *
 * @category  Rollpix
 * @package   Rollpix_ProductGallery
 */

declare(strict_types=1);

namespace Rollpix\ProductGallery\Model\Config\Source;

use Magento\Framework\Data\OptionSourceInterface;

class SliderTransition implements OptionSourceInterface
{
    public const TRANSITION_FADE = 'fade';
    public const TRANSITION_SLIDE = 'slide';
    public const TRANSITION_ZOOM_FADE = 'zoom-fade';

    /**
     * @inheritdoc
     */
    public function toOptionArray(): array
    {
        return [
            ['value' => self::TRANSITION_FADE, 'label' => __('Fade (cross-fade)')],
            ['value' => self::TRANSITION_SLIDE, 'label' => __('Slide (directional)')],
            ['value' => self::TRANSITION_ZOOM_FADE, 'label' => __('Zoom fade (zoom out + fade)')]
        ];
    }
}

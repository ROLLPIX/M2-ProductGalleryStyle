<?php
/**
 * Rollpix ProductGallery Module Registration
 *
 * @category  Rollpix
 * @package   Rollpix_ProductGallery
 */

declare(strict_types=1);

use Magento\Framework\Component\ComponentRegistrar;

ComponentRegistrar::register(
    ComponentRegistrar::MODULE,
    'Rollpix_ProductGallery',
    __DIR__
);

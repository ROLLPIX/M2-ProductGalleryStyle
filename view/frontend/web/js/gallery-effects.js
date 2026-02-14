/**
 * Rollpix ProductGallery - Effects Component
 *
 * Handles: shimmer loading, fade-in on scroll, image counter
 *
 * @category  Rollpix
 * @package   Rollpix_ProductGallery
 */
define([
    'jquery',
    'domReady!'
], function ($) {
    'use strict';

    return function (config, element) {
        var $gallery = $(element);
        var effects = config.effects || {};
        var layoutType = config.layout ? config.layout.type : 'vertical';

        // Safety: shimmer and fade-in conflict. If both enabled, disable shimmer.
        if (effects.shimmerEnabled && effects.fadeInEnabled) {
            effects.shimmerEnabled = false;
        }

        // =========================================
        // SHIMMER LOADING
        // =========================================
        if (effects.shimmerEnabled) {
            initShimmer();
        }

        function initShimmer() {
            var $items = $gallery.find('.rp-gallery-item');

            $items.each(function () {
                var $item = $(this);
                var $img = $item.find('img');

                if (!$img.length) {
                    $item.addClass('rp-loaded');
                    return;
                }

                var img = $img[0];

                if (img.complete && img.naturalHeight > 0) {
                    $item.addClass('rp-loaded');
                } else {
                    $img.on('load.rpshimmer', function () {
                        $item.addClass('rp-loaded');
                    });
                    $img.on('error.rpshimmer', function () {
                        $item.addClass('rp-loaded');
                    });
                }
            });
        }

        // =========================================
        // FADE-IN ON SCROLL
        // =========================================
        if (effects.fadeInEnabled) {
            initFadeIn();
        }

        function initFadeIn() {
            var $items = $gallery.find('.rp-gallery-item');

            if (!('IntersectionObserver' in window)) {
                $items.addClass('rp-visible');
                return;
            }

            var observer = new IntersectionObserver(function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('rp-visible');
                        observer.unobserve(entry.target);
                    }
                });
            }, {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            });

            $items.each(function () {
                observer.observe(this);
            });
        }

        // =========================================
        // IMAGE COUNTER (slider layout only)
        // =========================================
        if (effects.counterEnabled && layoutType === 'slider') {
            initCounter();
        }

        function initCounter() {
            var $items = $gallery.find('.rp-gallery-item');
            var totalImages = $items.length;

            if (totalImages <= 1 || window.innerWidth <= 767) {
                return;
            }

            var $counter = $('<div class="rp-counter-display"></div>');
            $('body').append($counter);

            var hideTimeout;

            // Show initial state briefly so user knows counter exists
            $counter.text('1 / ' + totalImages);
            $counter.addClass('rp-counter-visible');
            hideTimeout = setTimeout(function () {
                $counter.removeClass('rp-counter-visible');
            }, 3000);

            // Listen for slider change events
            $gallery.on('rpslider:change', function (e, currentIndex, total) {
                $counter.text((currentIndex + 1) + ' / ' + total);
                $counter.addClass('rp-counter-visible');

                clearTimeout(hideTimeout);
                hideTimeout = setTimeout(function () {
                    $counter.removeClass('rp-counter-visible');
                }, 2000);
            });
        }
    };
});

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
        // IMAGE COUNTER
        // =========================================
        if (effects.counterEnabled) {
            initCounter();
        }

        function initCounter() {
            var $items = $gallery.find('.rp-gallery-item');
            var totalImages = $items.length;

            if (totalImages <= 1 || window.innerWidth <= 767) {
                return;
            }

            if (!('IntersectionObserver' in window)) {
                return;
            }

            var $counter = $('<div class="rp-counter-display"></div>');
            $('body').append($counter);

            var visibleItems = {};
            var hideTimeout;

            var observer = new IntersectionObserver(function (entries) {
                entries.forEach(function (entry) {
                    var index = $items.index(entry.target);
                    if (entry.isIntersecting) {
                        visibleItems[index] = true;
                    } else {
                        delete visibleItems[index];
                    }
                });

                var indices = Object.keys(visibleItems).map(Number);
                if (indices.length > 0) {
                    var currentVisible = Math.min.apply(null, indices) + 1;
                    $counter.text(currentVisible + ' / ' + totalImages);
                    $counter.addClass('rp-counter-visible');

                    clearTimeout(hideTimeout);
                    hideTimeout = setTimeout(function () {
                        $counter.removeClass('rp-counter-visible');
                    }, 2000);
                }
            }, {
                threshold: 0.5
            });

            $items.each(function () {
                observer.observe(this);
            });

            $(window).on('scroll.rpcounter', function () {
                if (window.innerWidth <= 767) {
                    return;
                }
                $counter.addClass('rp-counter-visible');
                clearTimeout(hideTimeout);
                hideTimeout = setTimeout(function () {
                    $counter.removeClass('rp-counter-visible');
                }, 2000);
            });
        }
    };
});

/**
 * Rollpix ProductGallery - Thumbnail Navigation Strip
 *
 * IntersectionObserver-based active state tracking + click-to-scroll.
 * For slider layout, tracking and clicks are handled by gallery-slider.js.
 * Desktop only (hidden on mobile via CSS).
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
        var thumbnailPosition = config.layout ? config.layout.thumbnailPosition : 'disabled';
        var layoutType = config.layout ? config.layout.type : 'vertical';

        if (thumbnailPosition === 'disabled') {
            return;
        }

        if (window.innerWidth <= 767) {
            return;
        }

        var $items = $gallery.find('.rp-gallery-item');
        var $thumbnails = $gallery.find('.rp-thumbnail-item');
        var $strip = $gallery.find('.rp-thumbnail-strip');

        if (!$items.length || !$thumbnails.length) {
            return;
        }

        initThumbnailTracking();
        initThumbnailClicks();

        function initThumbnailTracking() {
            // Slider JS manages active thumbnail state
            if (layoutType === 'slider') {
                return;
            }

            if (!('IntersectionObserver' in window)) {
                return;
            }

            var observer = new IntersectionObserver(function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
                        var index = $items.index(entry.target);
                        var $thumb = $thumbnails.eq(index);

                        $thumbnails.removeClass('rp-thumbnail-active');
                        $thumb.addClass('rp-thumbnail-active');
                        scrollThumbIntoView($thumb);
                    }
                });
            }, {
                threshold: 0.5
            });

            $items.each(function () {
                observer.observe(this);
            });
        }

        function initThumbnailClicks() {
            // Slider JS handles thumbnail clicks directly
            if (layoutType === 'slider') {
                return;
            }

            $thumbnails.on('click', function () {
                var index = $(this).data('thumb-index');
                var $targetItem = $items.eq(index);

                if ($targetItem.length) {
                    var stickyOffset = config.sticky ? config.sticky.offset : 20;
                    var targetTop = $targetItem.offset().top - stickyOffset - 10;

                    $('html, body').animate({
                        scrollTop: targetTop
                    }, 400);
                }
            });
        }

        function scrollThumbIntoView($thumb) {
            if (!$thumb.length || !$strip.length) {
                return;
            }

            var stripEl = $strip[0];
            var thumbEl = $thumb[0];

            if (thumbnailPosition === 'left' || thumbnailPosition === 'right') {
                var thumbTop = thumbEl.offsetTop;
                var thumbHeight = thumbEl.offsetHeight;
                var stripHeight = stripEl.clientHeight;
                var scrollTop = stripEl.scrollTop;

                if (thumbTop < scrollTop || thumbTop + thumbHeight > scrollTop + stripHeight) {
                    stripEl.scrollTo({
                        top: thumbTop - (stripHeight / 2) + (thumbHeight / 2),
                        behavior: 'smooth'
                    });
                }
            } else {
                var thumbLeft = thumbEl.offsetLeft;
                var thumbWidth = thumbEl.offsetWidth;
                var stripWidth = stripEl.clientWidth;
                var scrollLeft = stripEl.scrollLeft;

                if (thumbLeft < scrollLeft || thumbLeft + thumbWidth > scrollLeft + stripWidth) {
                    stripEl.scrollTo({
                        left: thumbLeft - (stripWidth / 2) + (thumbWidth / 2),
                        behavior: 'smooth'
                    });
                }
            }
        }
    };
});

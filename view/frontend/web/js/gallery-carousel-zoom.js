/**
 * Rollpix ProductGallery - Carousel Zoom Component
 *
 * Opens a modal overlay showing one image at a time with prev/next navigation.
 * Dark backdrop, close button, arrow keys support.
 *
 * Re-initializes its media list and click triggers when the swatch -> gallery
 * bridge replaces the gallery DOM on a configurable variant change
 * (the `rollpix:gallery:dom_replaced` event). Without this the rebuilt
 * `.rp-gallery-item` anchors carry no click handler, so a click falls through
 * to the native href and the raw image file opens in the browser (IS-6367).
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
        var zoomType = config.zoom ? config.zoom.type : 'hover';

        if (zoomType !== 'carousel' && zoomType !== 'lightbox') {
            return;
        }

        // Closure state, rebuilt by collectAndBind() on init and on every
        // swatch-driven DOM replacement.
        var media = [];
        var $items = $();
        var $overlay = null;
        var $stage = null;
        var $counter = null;
        var currentIndex = 0;

        function buildModal() {
            $overlay = $(
                '<div class="rp-carousel-zoom-overlay">' +
                    '<button class="rp-carousel-zoom-close" type="button" aria-label="Close">&times;</button>' +
                    '<div class="rp-carousel-zoom-stage"></div>' +
                    '<div class="rp-carousel-zoom-counter"></div>' +
                    (media.length > 1 ?
                        '<button class="rp-carousel-zoom-prev" type="button" aria-label="Previous">' +
                            '<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>' +
                        '</button>' +
                        '<button class="rp-carousel-zoom-next" type="button" aria-label="Next">' +
                            '<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 6 15 12 9 18"></polyline></svg>' +
                        '</button>'
                    : '') +
                '</div>'
            );

            $stage = $overlay.find('.rp-carousel-zoom-stage');
            $counter = $overlay.find('.rp-carousel-zoom-counter');

            // Close handlers
            $overlay.find('.rp-carousel-zoom-close').on('click', closeModal);

            $overlay.on('click', function (e) {
                if ($(e.target).is('.rp-carousel-zoom-overlay') || $(e.target).is('.rp-carousel-zoom-stage')) {
                    closeModal();
                }
            });

            // Navigation
            $overlay.find('.rp-carousel-zoom-prev').on('click', function () {
                navigate(-1);
            });
            $overlay.find('.rp-carousel-zoom-next').on('click', function () {
                navigate(1);
            });

            $('body').append($overlay);
        }

        function showItem(index) {
            currentIndex = index;
            $stage.empty();

            var item = media[index];
            if (item.type === 'video' && item.embedUrl) {
                // YouTube / Vimeo: the gallery item is a facade or an iframe,
                // never a <video><source>, so it is rendered with its embed
                // URL. Built with jQuery so the URL is set as an attribute,
                // not concatenated into markup (WE-15768).
                $stage.append(
                    $('<div/>', {'class': 'rp-carousel-zoom-media rp-carousel-zoom-iframe-wrap'}).append(
                        $('<iframe/>', {
                            src: item.embedUrl,
                            'class': 'rp-carousel-zoom-iframe',
                            frameborder: '0',
                            allow: 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share',
                            referrerpolicy: 'strict-origin-when-cross-origin',
                            allowfullscreen: true
                        })
                    )
                );
            } else if (item.type === 'video') {
                $stage.append(
                    '<video autoplay loop muted playsinline class="rp-carousel-zoom-media">' +
                    '<source src="' + item.url + '" type="video/mp4"/>' +
                    '</video>'
                );
            } else {
                $stage.append(
                    '<img src="' + item.url + '" alt="' + item.alt + '" class="rp-carousel-zoom-media" />'
                );
            }

            $counter.text((index + 1) + ' / ' + media.length);
        }

        function navigate(direction) {
            var newIndex = currentIndex + direction;
            if (newIndex < 0) {
                newIndex = media.length - 1;
            } else if (newIndex >= media.length) {
                newIndex = 0;
            }
            showItem(newIndex);
        }

        function openModal(index) {
            if (!$overlay) {
                buildModal();
            }

            showItem(index);
            $('body').css('overflow', 'hidden');
            $overlay.css('display', 'flex');

            // Force reflow then animate
            $overlay[0].offsetHeight;
            $overlay.addClass('rp-carousel-active');

            // Keyboard navigation
            $(document).on('keydown.rpcarouselzoom', function (e) {
                if (e.key === 'Escape') {
                    closeModal();
                } else if (e.key === 'ArrowLeft') {
                    navigate(-1);
                } else if (e.key === 'ArrowRight') {
                    navigate(1);
                }
            });
        }

        function closeModal() {
            if (!$overlay) {
                return;
            }

            $overlay.removeClass('rp-carousel-active');
            $(document).off('keydown.rpcarouselzoom');

            setTimeout(function () {
                if (!$overlay) {
                    return;
                }
                $overlay.css('display', 'none');
                $('body').css('overflow', '');
                $stage.empty();
            }, 300);
        }

        // Touch swipe support
        function initSwipe() {
            var startX = 0;
            var startY = 0;
            var threshold = 50;

            $overlay.on('touchstart.rpcarouselzoom', function (e) {
                var touch = e.originalEvent.touches[0];
                startX = touch.clientX;
                startY = touch.clientY;
            });

            $overlay.on('touchend.rpcarouselzoom', function (e) {
                var touch = e.originalEvent.changedTouches[0];
                var diffX = touch.clientX - startX;
                var diffY = touch.clientY - startY;

                // Only handle horizontal swipes (not vertical scrolls)
                if (Math.abs(diffX) > threshold && Math.abs(diffX) > Math.abs(diffY)) {
                    if (diffX < 0) {
                        navigate(1); // swipe left = next
                    } else {
                        navigate(-1); // swipe right = prev
                    }
                }
            });
        }

        // ----------------------------------------------------------
        // (Re)collect the gallery items, rebuild the media list and
        // (re)bind the click triggers. Safe to call repeatedly:
        // handlers are namespaced and cleared first, and any cached
        // overlay is torn down so buildModal() re-renders the prev/next
        // controls for the current variant's image count.
        // ----------------------------------------------------------
        function collectAndBind() {
            $items = $gallery.find('.rp-gallery-item');
            if ($items.length === 0) {
                return;
            }

            // Rebuild media from the live DOM.
            media = [];
            $items.each(function () {
                var $item = $(this);
                var mediaType = $item.data('media-type') || 'image';

                if (mediaType === 'video') {
                    var provider = $item.data('video-provider') || 'local';
                    var $source = $item.find('video source');
                    media.push({
                        type: 'video',
                        url: $source.attr('src') || '',
                        // External providers carry their embed URL on the item
                        // (gallery-vertical.phtml); local MP4s do not.
                        embedUrl: provider !== 'local' ? ($item.data('video-embed-url') || '') : '',
                        alt: ''
                    });
                } else {
                    media.push({
                        type: 'image',
                        url: $item.attr('href'),
                        alt: $item.find('img').attr('alt') || ''
                    });
                }
            });

            // Tear down any cached overlay so the prev/next controls are
            // rebuilt for the (possibly different) variant image count.
            if ($overlay) {
                $(document).off('keydown.rpcarouselzoom');
                $('body').css('overflow', '');
                $overlay.remove();
                $overlay = null;
                $stage = null;
                $counter = null;
            }
            currentIndex = 0;

            // Bind click on each gallery item (namespaced, idempotent).
            $items
                .off('click.rpcarouselzoom')
                .on('click.rpcarouselzoom', function (e) {
                    e.preventDefault();
                    openModal($items.index(this));

                    // Init swipe once overlay exists
                    if ($overlay && !$overlay.data('swipe-init')) {
                        initSwipe();
                        $overlay.data('swipe-init', true);
                    }
                });
        }

        collectAndBind();

        // The swatch -> gallery bridge replaces .rp-gallery-item anchors on a
        // variant change and fires this event on [data-role="rp-gallery"]
        // (same node as `element`). Re-collect + re-bind so the popup keeps
        // working and shows the selected variant's images.
        $gallery.on('rollpix:gallery:dom_replaced', collectAndBind);
    };
});

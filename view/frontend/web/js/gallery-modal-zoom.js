/**
 * Rollpix ProductGallery - Modal Zoom Component
 *
 * Opens a near full-screen modal with ALL product images stacked vertically.
 * Clicking image N scrolls the modal to that image. Includes a scroll indicator.
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

        if (zoomType !== 'modal') {
            return;
        }

        var $items = $gallery.find('.rp-gallery-item');
        if ($items.length === 0) {
            return;
        }

        // Collect large image URLs
        var images = [];
        $items.each(function () {
            images.push({
                url: $(this).attr('href'),
                alt: $(this).find('img').attr('alt') || ''
            });
        });

        // Prevent default link behavior
        $items.on('click', function (e) {
            e.preventDefault();
        });

        var $overlay = null;
        var $content = null;
        var $indicator = null;
        var indicatorTimer = null;

        function buildModal() {
            $overlay = $(
                '<div class="rp-modal-zoom-overlay">' +
                    '<button class="rp-modal-zoom-close" type="button" aria-label="Close">&times;</button>' +
                    '<div class="rp-modal-zoom-content"></div>' +
                    '<div class="rp-modal-zoom-indicator">' +
                        '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>' +
                        '<span>Scroll para ver m\u00e1s</span>' +
                    '</div>' +
                '</div>'
            );

            $content = $overlay.find('.rp-modal-zoom-content');
            $indicator = $overlay.find('.rp-modal-zoom-indicator');

            for (var i = 0; i < images.length; i++) {
                $content.append(
                    '<img src="' + images[i].url + '" alt="' + images[i].alt + '" data-modal-index="' + i + '" />'
                );
            }

            // Close handlers
            $overlay.find('.rp-modal-zoom-close').on('click', closeModal);

            $overlay.on('click', function (e) {
                if ($(e.target).is('.rp-modal-zoom-overlay') || $(e.target).is('.rp-modal-zoom-content')) {
                    closeModal();
                }
            });

            // Hide indicator on scroll
            $content.on('scroll', function () {
                hideIndicator();
            });

            $('body').append($overlay);
        }

        function openModal(index) {
            if (!$overlay) {
                buildModal();
            }

            $('body').css('overflow', 'hidden');
            $overlay.css('display', 'flex');

            // Force reflow then animate
            $overlay[0].offsetHeight;
            $overlay.addClass('rp-modal-active');

            // Scroll to the clicked image
            var $targetImg = $content.find('img[data-modal-index="' + index + '"]');
            if ($targetImg.length) {
                // Wait for images to have layout
                setTimeout(function () {
                    $content.scrollTop($targetImg.position().top + $content.scrollTop());
                }, 50);
            }

            // Show indicator if there are images below
            if (images.length > 1) {
                showIndicator();
            }

            // Escape key handler
            $(document).on('keydown.rpmodalzoom', function (e) {
                if (e.key === 'Escape') {
                    closeModal();
                }
            });
        }

        function closeModal() {
            if (!$overlay) {
                return;
            }

            $overlay.removeClass('rp-modal-active');
            $(document).off('keydown.rpmodalzoom');

            setTimeout(function () {
                $overlay.css('display', 'none');
                $('body').css('overflow', '');
                $content.scrollTop(0);
            }, 300);

            hideIndicator();
        }

        function showIndicator() {
            $indicator.removeClass('rp-indicator-hidden');

            clearTimeout(indicatorTimer);
            indicatorTimer = setTimeout(function () {
                hideIndicator();
            }, 3000);
        }

        function hideIndicator() {
            clearTimeout(indicatorTimer);
            $indicator.addClass('rp-indicator-hidden');
        }

        // Bind click on each gallery item
        $items.each(function (index) {
            $(this).on('click.rpmodalzoom', function (e) {
                e.preventDefault();
                openModal(index);
            });
        });
    };
});

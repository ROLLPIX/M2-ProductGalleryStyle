/**
 * Rollpix ProductGallery - Zoom Component
 *
 * Supports: hover (magnifier), lightbox (GLightbox), click (in-place), disabled
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
        var zoomLevel = config.zoom ? config.zoom.level : 3;
        var zoomPosition = config.zoom ? config.zoom.position : 'right';

        if (zoomType === 'disabled') {
            return;
        }

        if (zoomType === 'lightbox') {
            initLightbox();
            return;
        }

        if (zoomType === 'click') {
            initClickZoom();
            return;
        }

        // Default: hover zoom
        initHoverZoom();

        /* ===========================================================
           HOVER ZOOM - Magnifier lens + result panel on the right
           =========================================================== */
        function initHoverZoom() {
            var $items = $gallery.find('.rp-gallery-item');

            $items.each(function () {
                var $item = $(this);
                var $img = $item.find('img');
                var largeImageUrl = $item.attr('href');

                $item.on('click', function (e) {
                    e.preventDefault();
                });

                // Wrapper for positioning
                var $zoomWrapper = $('<div class="rp-zoom-wrapper"></div>');
                $item.wrap($zoomWrapper);
                $zoomWrapper = $item.parent();

                var $zoomLens = $('<div class="rp-zoom-lens"></div>');
                var $zoomResult = $('<div class="rp-zoom-result"></div>');

                $item.append($zoomLens);

                if (zoomPosition === 'right') {
                    $zoomWrapper.append($zoomResult);
                    $zoomResult.addClass('rp-zoom-result-right');
                } else {
                    $item.append($zoomResult);
                    $zoomResult.addClass('rp-zoom-result-inside');
                }

                var largeImage = new Image();

                largeImage.onload = function () {
                    $zoomResult.css('background-image', 'url("' + largeImageUrl + '")');

                    $item.on('mouseenter.rpzoom', function () {
                        var imgWidth = $img.width();
                        var imgHeight = $img.height();

                        var lensWidth = imgWidth / zoomLevel;
                        var lensHeight = imgHeight / zoomLevel;

                        $zoomLens.css({
                            width: lensWidth + 'px',
                            height: lensHeight + 'px'
                        });

                        if (zoomPosition === 'right') {
                            // Compact result: 60% of image size
                            var resultW = Math.round(imgWidth * 0.6);
                            var resultH = Math.round(imgHeight * 0.6);

                            $zoomResult.css({
                                width: resultW + 'px',
                                height: resultH + 'px',
                                backgroundSize: largeImage.width + 'px ' + largeImage.height + 'px'
                            });
                        } else {
                            $zoomResult.css({
                                width: '100%',
                                height: '100%',
                                backgroundSize: (imgWidth * zoomLevel) + 'px ' + (imgHeight * zoomLevel) + 'px'
                            });
                        }

                        $zoomLens.addClass('active');
                        $zoomResult.addClass('active');
                    });

                    $item.on('mouseleave.rpzoom', function () {
                        $zoomLens.removeClass('active');
                        $zoomResult.removeClass('active');
                    });

                    $item.on('mousemove.rpzoom', function (e) {
                        var offset = $img.offset();
                        var imgWidth = $img.width();
                        var imgHeight = $img.height();
                        var lensWidth = $zoomLens.outerWidth();
                        var lensHeight = $zoomLens.outerHeight();

                        var x = e.pageX - offset.left;
                        var y = e.pageY - offset.top;

                        var lensX = Math.max(0, Math.min(x - lensWidth / 2, imgWidth - lensWidth));
                        var lensY = Math.max(0, Math.min(y - lensHeight / 2, imgHeight - lensHeight));

                        $zoomLens.css({ left: lensX + 'px', top: lensY + 'px' });

                        var ratioX = largeImage.width / imgWidth;
                        var ratioY = largeImage.height / imgHeight;

                        $zoomResult.css('background-position',
                            -(lensX * ratioX) + 'px ' + -(lensY * ratioY) + 'px'
                        );
                    });
                };

                largeImage.src = largeImageUrl;
            });
        }

        /* ===========================================================
           CLICK ZOOM - Click to toggle zoom inside the image
           =========================================================== */
        function initClickZoom() {
            var $items = $gallery.find('.rp-gallery-item');

            $items.each(function () {
                var $item = $(this);
                var $img = $item.find('img');
                var largeImageUrl = $item.attr('href');
                var isZoomed = false;

                // Create overlay for zoomed view
                var $zoomOverlay = $('<div class="rp-click-zoom-overlay"></div>');
                $item.append($zoomOverlay);
                $item.addClass('rp-click-zoom-item');

                var largeImage = new Image();

                largeImage.onload = function () {
                    $zoomOverlay.css('background-image', 'url("' + largeImageUrl + '")');

                    // Click to toggle zoom
                    $item.on('click.rpzoom', function (e) {
                        e.preventDefault();

                        if (!isZoomed) {
                            // Activate zoom
                            isZoomed = true;
                            $item.addClass('rp-click-zoomed');

                            var imgWidth = $img.width();
                            var imgHeight = $img.height();

                            $zoomOverlay.css({
                                backgroundSize: (imgWidth * zoomLevel) + 'px ' + (imgHeight * zoomLevel) + 'px'
                            });

                            // Position zoom at click point
                            positionZoom(e);
                            $zoomOverlay.addClass('active');
                        } else {
                            // Deactivate zoom
                            isZoomed = false;
                            $item.removeClass('rp-click-zoomed');
                            $zoomOverlay.removeClass('active');
                        }
                    });

                    // Move zoom while active
                    $item.on('mousemove.rpzoom', function (e) {
                        if (!isZoomed) return;
                        positionZoom(e);
                    });

                    // Exit zoom when leaving the image
                    $item.on('mouseleave.rpzoom', function () {
                        if (isZoomed) {
                            isZoomed = false;
                            $item.removeClass('rp-click-zoomed');
                            $zoomOverlay.removeClass('active');
                        }
                    });

                    function positionZoom(e) {
                        var offset = $img.offset();
                        var imgWidth = $img.width();
                        var imgHeight = $img.height();

                        // Mouse position as percentage
                        var pctX = (e.pageX - offset.left) / imgWidth;
                        var pctY = (e.pageY - offset.top) / imgHeight;

                        // Clamp to 0-1
                        pctX = Math.max(0, Math.min(1, pctX));
                        pctY = Math.max(0, Math.min(1, pctY));

                        // Background position
                        var bgWidth = imgWidth * zoomLevel;
                        var bgHeight = imgHeight * zoomLevel;

                        var bgX = -(pctX * (bgWidth - imgWidth));
                        var bgY = -(pctY * (bgHeight - imgHeight));

                        $zoomOverlay.css('background-position', bgX + 'px ' + bgY + 'px');
                    }
                };

                largeImage.src = largeImageUrl;
            });
        }

        /* ===========================================================
           LIGHTBOX - Full-screen gallery with close / navigation
           =========================================================== */
        function initLightbox() {
            // Load GLightbox CSS
            if (!$('link[href*="glightbox"]').length) {
                $('head').append(
                    '<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/glightbox@3.3.0/dist/css/glightbox.min.css">'
                );
            }

            // Load GLightbox JS
            if (typeof GLightbox === 'undefined') {
                $.getScript(
                    'https://cdn.jsdelivr.net/npm/glightbox@3.3.0/dist/js/glightbox.min.js',
                    function () { createLightbox(); }
                );
            } else {
                createLightbox();
            }
        }

        function createLightbox() {
            if (typeof GLightbox === 'undefined') return;

            var lightbox = GLightbox({
                selector: '.rp-gallery-item.glightbox',
                touchNavigation: true,
                loop: true,
                closeButton: true,
                closeOnOutsideClick: true,
                zoomable: true,
                draggable: true,
                openEffect: 'fade',
                closeEffect: 'fade',
                cssEf498: 'fade'
            });

            // Extra close-on-Escape safety
            $(document).on('keydown.rplightbox', function (e) {
                if (e.key === 'Escape' && lightbox) {
                    lightbox.close();
                }
            });
        }
    };
});

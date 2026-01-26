/**
 * Rollpix ProductGallery - Hover Zoom Component
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

        console.log('Rollpix Gallery Zoom initialized', {type: zoomType, level: zoomLevel, position: zoomPosition});

        if (zoomType === 'disabled') {
            console.log('Zoom is disabled');
            return;
        }

        if (zoomType === 'lightbox') {
            initLightbox();
            return;
        }

        // Hover zoom
        initHoverZoom();

        /**
         * Initialize hover zoom functionality
         */
        function initHoverZoom() {
            var $items = $gallery.find('.rp-gallery-item');
            console.log('Found gallery items:', $items.length);

            $items.each(function (index) {
                var $item = $(this);
                var $img = $item.find('img');
                var largeImageUrl = $item.attr('href');

                console.log('Processing item', index, largeImageUrl);

                // Prevent default link behavior
                $item.on('click', function (e) {
                    e.preventDefault();
                });

                // Create wrapper for zoom positioning
                var $zoomWrapper = $('<div class="rp-zoom-wrapper"></div>');
                $item.wrap($zoomWrapper);
                $zoomWrapper = $item.parent();

                // Create zoom elements
                var $zoomLens = $('<div class="rp-zoom-lens"></div>');
                var $zoomResult = $('<div class="rp-zoom-result"></div>');

                // Add lens inside the item
                $item.append($zoomLens);

                // Add result based on position
                if (zoomPosition === 'right') {
                    $zoomWrapper.append($zoomResult);
                    $zoomResult.addClass('rp-zoom-result-right');
                } else {
                    $item.append($zoomResult);
                    $zoomResult.addClass('rp-zoom-result-inside');
                }

                // Preload large image
                var largeImage = new Image();

                largeImage.onload = function () {
                    console.log('Large image loaded', largeImage.width, 'x', largeImage.height);

                    $zoomResult.css('background-image', 'url("' + largeImageUrl + '")');

                    // Store data for later use
                    $item.data('rp-zoom', {
                        largeImage: largeImage,
                        $lens: $zoomLens,
                        $result: $zoomResult,
                        zoomLevel: zoomLevel
                    });

                    // Mouse events
                    $item.on('mouseenter.rpzoom', function () {
                        var imgWidth = $img.width();
                        var imgHeight = $img.height();

                        // Calculate lens size
                        var lensWidth = imgWidth / zoomLevel;
                        var lensHeight = imgHeight / zoomLevel;

                        $zoomLens.css({
                            width: lensWidth + 'px',
                            height: lensHeight + 'px'
                        });

                        // Set result size
                        if (zoomPosition === 'right') {
                            $zoomResult.css({
                                width: imgWidth + 'px',
                                height: imgHeight + 'px',
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

                        // Calculate cursor position relative to image
                        var x = e.pageX - offset.left;
                        var y = e.pageY - offset.top;

                        // Calculate lens position (centered on cursor)
                        var lensX = x - (lensWidth / 2);
                        var lensY = y - (lensHeight / 2);

                        // Constrain lens to image boundaries
                        lensX = Math.max(0, Math.min(lensX, imgWidth - lensWidth));
                        lensY = Math.max(0, Math.min(lensY, imgHeight - lensHeight));

                        // Position lens
                        $zoomLens.css({
                            left: lensX + 'px',
                            top: lensY + 'px'
                        });

                        // Calculate background position for zoom result
                        var ratioX = largeImage.width / imgWidth;
                        var ratioY = largeImage.height / imgHeight;

                        var bgX = -(lensX * ratioX);
                        var bgY = -(lensY * ratioY);

                        $zoomResult.css('background-position', bgX + 'px ' + bgY + 'px');
                    });
                };

                largeImage.onerror = function() {
                    console.error('Failed to load large image:', largeImageUrl);
                };

                largeImage.src = largeImageUrl;
            });
        }

        /**
         * Initialize lightbox functionality
         */
        function initLightbox() {
            // Load GLightbox CSS
            if (!$('link[href*="glightbox"]').length) {
                $('head').append(
                    '<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/glightbox/dist/css/glightbox.min.css">'
                );
            }

            // Load GLightbox JS and initialize
            if (typeof GLightbox === 'undefined') {
                $.getScript('https://cdn.jsdelivr.net/npm/glightbox/dist/js/glightbox.min.js', function () {
                    createLightbox();
                });
            } else {
                createLightbox();
            }
        }

        /**
         * Create GLightbox instance
         */
        function createLightbox() {
            if (typeof GLightbox !== 'undefined') {
                GLightbox({
                    selector: '.rp-gallery-item.glightbox',
                    touchNavigation: true,
                    loop: true,
                    closeButton: true,
                    zoomable: true,
                    draggable: true
                });
            }
        }
    };
});

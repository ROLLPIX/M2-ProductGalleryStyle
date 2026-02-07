/**
 * Rollpix ProductGallery - Mobile Carousel Component
 *
 * @category  Rollpix
 * @package   Rollpix_ProductGallery
 */
define([
    'jquery'
], function ($) {
    'use strict';

    return function (config, element) {
        var $gallery = $(element);
        var mobileBehavior = config.mobile.behavior || 'stack';
        var mobileBreakpoint = 767;
        var isCarouselInitialized = false;
        var $wrapper, $track, $items, $indicators;
        var currentIndex = 0;
        var startX, startY, currentX, isDragging = false;
        var threshold = 50;

        // Only initialize carousel if configured
        if (mobileBehavior !== 'carousel') {
            return;
        }

        init();

        function init() {
            checkViewport();
            $(window).on('resize', debounce(checkViewport, 250));
        }

        function checkViewport() {
            var isMobile = window.innerWidth <= mobileBreakpoint;

            if (isMobile && !isCarouselInitialized) {
                initCarousel();
            } else if (!isMobile && isCarouselInitialized) {
                destroyCarousel();
            }
        }

        function initCarousel() {
            $items = $gallery.find('.rp-gallery-item');

            if ($items.length <= 1) {
                return;
            }

            // Wrap items in carousel structure
            $gallery.find('.rp-gallery-images').addClass('rp-carousel-wrapper');
            $wrapper = $gallery.find('.rp-carousel-wrapper');

            // Create track
            $track = $('<div class="rp-carousel-track"></div>');
            $items.appendTo($track);
            $wrapper.append($track);

            // Create indicators
            createIndicators();

            // Set initial state
            $items.addClass('rp-carousel-slide');
            updateCarousel();

            // Touch events
            $track[0].addEventListener('touchstart', onTouchStart, { passive: true });
            $track[0].addEventListener('touchmove', onTouchMove, { passive: false });
            $track[0].addEventListener('touchend', onTouchEnd, { passive: true });

            // Mouse events for desktop testing
            $track.on('mousedown', onMouseDown);
            $(document).on('mousemove.rpCarousel', onMouseMove);
            $(document).on('mouseup.rpCarousel', onMouseUp);

            isCarouselInitialized = true;
            $gallery.addClass('rp-carousel-active');
        }

        function destroyCarousel() {
            if (!isCarouselInitialized) {
                return;
            }

            // Remove carousel structure
            $items.removeClass('rp-carousel-slide');
            $items.appendTo($wrapper);
            $track.remove();

            // Remove indicators
            $gallery.find('.rp-carousel-indicators').remove();

            // Remove classes and reset height
            $wrapper.removeClass('rp-carousel-wrapper').css('height', '');
            $gallery.removeClass('rp-carousel-active');

            // Remove events
            $(document).off('.rpCarousel');

            isCarouselInitialized = false;
            currentIndex = 0;
        }

        function createIndicators() {
            var $indicatorContainer = $('<div class="rp-carousel-indicators"></div>');

            $items.each(function (index) {
                var $dot = $('<button class="rp-carousel-dot" data-index="' + index + '"></button>');
                $dot.on('click', function () {
                    goToSlide(index);
                });
                $indicatorContainer.append($dot);
            });

            $gallery.append($indicatorContainer);
            $indicators = $gallery.find('.rp-carousel-dot');
        }

        function updateCarousel() {
            var slideWidth = $wrapper.width();
            var translateX = -(currentIndex * slideWidth);

            $track.css('transform', 'translateX(' + translateX + 'px)');

            // Adjust wrapper height to match current slide (prevents blank space)
            var $currentSlide = $items.eq(currentIndex);
            var img = $currentSlide.find('img')[0];

            if (img) {
                var setHeight = function () {
                    var h = img.offsetHeight;
                    if (h > 0) {
                        $wrapper.css('height', h + 'px');
                    }
                };

                if (img.complete && img.naturalHeight > 0) {
                    setHeight();
                } else {
                    $(img).one('load', setHeight);
                }
            }

            // Update indicators
            $indicators.removeClass('active');
            $indicators.eq(currentIndex).addClass('active');
        }

        function goToSlide(index) {
            var maxIndex = $items.length - 1;
            currentIndex = Math.max(0, Math.min(index, maxIndex));
            updateCarousel();
        }

        function nextSlide() {
            goToSlide(currentIndex + 1);
        }

        function prevSlide() {
            goToSlide(currentIndex - 1);
        }

        // Touch handlers
        function onTouchStart(e) {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
            isDragging = true;
            $track.css('transition', 'none');
        }

        function onTouchMove(e) {
            if (!isDragging) return;

            currentX = e.touches[0].clientX;
            var currentY = e.touches[0].clientY;
            var diffX = currentX - startX;
            var diffY = currentY - startY;

            // If scrolling more vertically, don't interfere
            if (Math.abs(diffY) > Math.abs(diffX)) {
                return;
            }

            e.preventDefault();

            var slideWidth = $wrapper.width();
            var baseTranslate = -(currentIndex * slideWidth);
            $track.css('transform', 'translateX(' + (baseTranslate + diffX) + 'px)');
        }

        function onTouchEnd(e) {
            if (!isDragging) return;
            isDragging = false;

            $track.css('transition', 'transform 0.3s ease');

            var diffX = currentX - startX;

            if (Math.abs(diffX) > threshold) {
                if (diffX > 0) {
                    prevSlide();
                } else {
                    nextSlide();
                }
            } else {
                updateCarousel();
            }
        }

        // Mouse handlers (for desktop testing)
        function onMouseDown(e) {
            startX = e.clientX;
            isDragging = true;
            $track.css('transition', 'none');
            e.preventDefault();
        }

        function onMouseMove(e) {
            if (!isDragging) return;

            currentX = e.clientX;
            var diffX = currentX - startX;
            var slideWidth = $wrapper.width();
            var baseTranslate = -(currentIndex * slideWidth);
            $track.css('transform', 'translateX(' + (baseTranslate + diffX) + 'px)');
        }

        function onMouseUp(e) {
            if (!isDragging) return;
            isDragging = false;

            $track.css('transition', 'transform 0.3s ease');

            var diffX = currentX - startX;

            if (Math.abs(diffX) > threshold) {
                if (diffX > 0) {
                    prevSlide();
                } else {
                    nextSlide();
                }
            } else {
                updateCarousel();
            }
        }

        // Utility
        function debounce(func, wait) {
            var timeout;
            return function () {
                var context = this, args = arguments;
                clearTimeout(timeout);
                timeout = setTimeout(function () {
                    func.apply(context, args);
                }, wait);
            };
        }

        // Handle window resize for slide width recalculation
        $(window).on('resize', debounce(function () {
            if (isCarouselInitialized) {
                updateCarousel();
            }
        }, 250));
    };
});

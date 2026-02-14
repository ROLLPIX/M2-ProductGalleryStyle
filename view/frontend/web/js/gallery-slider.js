/**
 * Rollpix ProductGallery - Desktop Slider Component
 *
 * Shows one image at a time with configurable transitions,
 * navigation arrows, dots, mouse wheel, and keyboard support.
 * Desktop only - on mobile, the carousel component takes over.
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
        var layoutType = config.layout ? config.layout.type : 'vertical';

        if (layoutType !== 'slider') {
            return;
        }

        if (window.innerWidth <= 767) {
            return;
        }

        var sliderConfig = config.slider || {};
        var direction = sliderConfig.direction || 'horizontal';
        var transition = sliderConfig.transition || 'fade';
        var showArrows = sliderConfig.arrows !== false;
        var showDots = sliderConfig.dots !== false;
        var enableMouseWheel = sliderConfig.mousewheel !== false;

        var $imagesContainer = $gallery.find('.rp-gallery-images');
        var $items = $imagesContainer.find('.rp-gallery-item');
        var $prevBtn = $gallery.find('.rp-slider-prev');
        var $nextBtn = $gallery.find('.rp-slider-next');
        var $dotsContainer = $gallery.find('.rp-slider-dots');
        var $thumbnails = $gallery.find('.rp-thumbnail-item');
        var currentIndex = 0;
        var totalImages = $items.length;
        var isAnimating = false;

        var allTransitionClasses = 'rp-slide-enter rp-slide-active rp-slide-exit ' +
            'rp-slide-enter-left rp-slide-enter-right rp-slide-enter-up rp-slide-enter-down ' +
            'rp-zoom-enter rp-zoom-enter-active rp-zoom-exit';

        if (totalImages <= 0) {
            return;
        }

        init();

        function init() {
            // Force-load all images: display:none prevents lazy loading
            $items.find('img[loading="lazy"]').removeAttr('loading');

            // Set initial state: only first image visible
            $items.each(function (index) {
                var $item = $(this);
                $item.removeClass(allTransitionClasses);
                $item.attr('style', '');
                if (index === 0) {
                    $item.css({ 'display': 'block', 'opacity': '1' });
                } else {
                    $item.css('display', 'none');
                }
            });

            // Handle arrows visibility
            if (!showArrows || totalImages <= 1) {
                $prevBtn.hide();
                $nextBtn.hide();
            } else {
                $prevBtn.on('click.rpslider', function (e) {
                    e.preventDefault();
                    e.stopPropagation();
                    goToSlide(currentIndex - 1);
                });
                $nextBtn.on('click.rpslider', function (e) {
                    e.preventDefault();
                    e.stopPropagation();
                    goToSlide(currentIndex + 1);
                });
            }

            // Handle dots
            if (showDots && totalImages > 1) {
                buildDots();
            } else {
                $dotsContainer.hide();
            }

            // Keyboard navigation
            if (totalImages > 1) {
                $gallery.attr('tabindex', '0');
                $gallery.on('keydown.rpslider', function (e) {
                    if (direction === 'vertical') {
                        if (e.key === 'ArrowUp') {
                            e.preventDefault();
                            goToSlide(currentIndex - 1);
                        } else if (e.key === 'ArrowDown') {
                            e.preventDefault();
                            goToSlide(currentIndex + 1);
                        }
                    } else {
                        if (e.key === 'ArrowLeft') {
                            goToSlide(currentIndex - 1);
                        } else if (e.key === 'ArrowRight') {
                            goToSlide(currentIndex + 1);
                        }
                    }
                });

                // Mouse wheel navigation on main image (configurable)
                if (enableMouseWheel) {
                    var throttledWheel = throttle(function (e) {
                        if (e.originalEvent.deltaY > 0) {
                            goToSlide(currentIndex + 1);
                        } else if (e.originalEvent.deltaY < 0) {
                            goToSlide(currentIndex - 1);
                        }
                    }, 400);

                    $imagesContainer.on('wheel.rpslider', function (e) {
                        e.preventDefault();
                        throttledWheel(e);
                    });
                }

                // Thumbnail clicks - use DOM index like dots
                $thumbnails.on('click.rpslider', function (e) {
                    e.preventDefault();
                    e.stopPropagation();
                    goToSlide($(this).index());
                });
            }

            updateArrowState();
        }

        function buildDots() {
            for (var i = 0; i < totalImages; i++) {
                var $dot = $('<button class="rp-slider-dot" type="button"></button>');
                $dot.attr('aria-label', 'Go to image ' + (i + 1));

                if (i === 0) {
                    $dot.addClass('rp-dot-active');
                }

                $dotsContainer.append($dot);
            }

            // Single delegated click handler - use DOM index
            $dotsContainer.on('click.rpslider', '.rp-slider-dot', function (e) {
                e.preventDefault();
                e.stopPropagation();
                goToSlide($(this).index());
            });
        }

        function goToSlide(index) {
            if (isAnimating) {
                return;
            }

            index = Math.max(0, Math.min(index, totalImages - 1));

            if (index === currentIndex) {
                return;
            }

            isAnimating = true;

            var $current = $items.eq(currentIndex);
            var $next = $items.eq(index);
            var goingForward = index > currentIndex;

            currentIndex = index;
            updateArrowState();
            updateDots();
            updateThumbnailActive();

            // Trigger event for counter
            $gallery.trigger('rpslider:change', [currentIndex, totalImages]);

            if (transition === 'slide') {
                animateSlide($current, $next, goingForward);
            } else if (transition === 'zoom-fade') {
                animateZoomFade($current, $next);
            } else {
                animateFade($current, $next);
            }
        }

        /**
         * Reset ALL items to a clean state.
         * Called after every transition to prevent stale inline styles.
         */
        function resetAllItems() {
            $items.each(function (i) {
                var $item = $(this);
                $item.removeClass(allTransitionClasses);
                $item.attr('style', '');
                if (i === currentIndex) {
                    $item.css({ 'display': 'block', 'opacity': '1' });
                } else {
                    $item.css('display', 'none');
                }
            });
            $imagesContainer.css('min-height', '');
        }

        // =========================================
        // FADE TRANSITION
        // =========================================
        function animateFade($current, $next) {
            var containerHeight = $imagesContainer.height();
            $imagesContainer.css('min-height', containerHeight + 'px');

            $next.css({
                'display': 'block',
                'opacity': '0',
                'position': 'absolute',
                'top': '0',
                'left': '0',
                'width': '100%',
                'transition': 'opacity 0.3s ease'
            });

            $current.css('transition', 'opacity 0.3s ease');

            // Force reflow
            $next[0].offsetHeight;

            $current.css('opacity', '0');
            $next.css('opacity', '1');

            setTimeout(function () {
                resetAllItems();
                isAnimating = false;
            }, 350);
        }

        // =========================================
        // SLIDE TRANSITION
        // =========================================
        function animateSlide($current, $next, goingForward) {
            var containerHeight = $imagesContainer.height();
            $imagesContainer.css('min-height', containerHeight + 'px');

            var enterClass, exitTransform;

            if (direction === 'vertical') {
                enterClass = goingForward ? 'rp-slide-enter-down' : 'rp-slide-enter-up';
                exitTransform = goingForward ? 'translateY(-100%)' : 'translateY(100%)';
            } else {
                enterClass = goingForward ? 'rp-slide-enter-left' : 'rp-slide-enter-right';
                exitTransform = goingForward ? 'translateX(-100%)' : 'translateX(100%)';
            }

            $next.css('display', 'block')
                 .addClass('rp-slide-enter ' + enterClass);

            // Force reflow
            $next[0].offsetHeight;

            $next.addClass('rp-slide-active').removeClass(enterClass);
            $current.addClass('rp-slide-exit').css('transform', exitTransform);

            setTimeout(function () {
                resetAllItems();
                isAnimating = false;
            }, 350);
        }

        // =========================================
        // ZOOM-FADE TRANSITION
        // =========================================
        function animateZoomFade($current, $next) {
            var containerHeight = $imagesContainer.height();
            $imagesContainer.css('min-height', containerHeight + 'px');

            $next.css('display', 'block')
                 .addClass('rp-zoom-enter');

            // Force reflow
            $next[0].offsetHeight;

            $current.addClass('rp-zoom-exit');
            $next.addClass('rp-zoom-enter-active');

            setTimeout(function () {
                resetAllItems();
                isAnimating = false;
            }, 400);
        }

        function updateArrowState() {
            if (!showArrows) {
                return;
            }
            $prevBtn.prop('disabled', currentIndex === 0);
            $nextBtn.prop('disabled', currentIndex === totalImages - 1);
        }

        function updateDots() {
            if (!showDots) {
                return;
            }
            $dotsContainer.find('.rp-slider-dot')
                .removeClass('rp-dot-active')
                .eq(currentIndex)
                .addClass('rp-dot-active');
        }

        function updateThumbnailActive() {
            if ($thumbnails.length) {
                $thumbnails.removeClass('rp-thumbnail-active');
                $thumbnails.eq(currentIndex).addClass('rp-thumbnail-active');
            }
        }

        function throttle(func, limit) {
            var lastCall = 0;
            return function () {
                var now = Date.now();
                if (now - lastCall >= limit) {
                    lastCall = now;
                    func.apply(this, arguments);
                }
            };
        }

        // Handle resize: if resizing to mobile, reset all items
        $(window).on('resize.rpslider', debounce(function () {
            if (window.innerWidth <= 767) {
                $items.attr('style', '');
                $items.removeClass(allTransitionClasses);
                $imagesContainer.css('min-height', '');
            }
        }, 250));

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
    };
});

/**
 * Rollpix ProductGallery - Sticky Scroll Component
 *
 * Scroll-direction-aware sticky: the info panel starts fixed at the top
 * (showing the title). As the user scrolls down, the panel gradually
 * reveals lower content. When scrolling up, it returns to the top.
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
        var $wrapper = $(element);
        var $infoPanel = $wrapper.find('.product-info-main');
        var stickyOffset = config.sticky ? config.sticky.offset : 20;

        if (!$infoPanel.length) {
            return;
        }

        var lastScrollTop = window.pageYOffset;
        var currentTop = stickyOffset;
        var ticking = false;

        function handleScroll() {
            var scrollTop = window.pageYOffset;
            var panelHeight = $infoPanel.outerHeight();
            var viewportHeight = window.innerHeight;

            // Panel fits in viewport - simple sticky at top
            if (panelHeight <= viewportHeight - stickyOffset) {
                $infoPanel.css('top', stickyOffset + 'px');
                lastScrollTop = scrollTop;
                return;
            }

            // Check if panel is in sticky zone (wrapper top is above offset)
            var wrapperRect = $wrapper[0].getBoundingClientRect();
            if (wrapperRect.top >= stickyOffset) {
                // Not sticky yet - keep at top
                currentTop = stickyOffset;
                $infoPanel.css('top', currentTop + 'px');
                lastScrollTop = scrollTop;
                return;
            }

            // Adjust top based on scroll direction and delta
            var scrollDelta = scrollTop - lastScrollTop;
            var minTop = -(panelHeight - viewportHeight);
            var maxTop = stickyOffset;

            currentTop = currentTop - scrollDelta;
            currentTop = Math.max(minTop, Math.min(maxTop, currentTop));

            $infoPanel.css('top', Math.round(currentTop) + 'px');
            lastScrollTop = scrollTop;
        }

        // Scroll event with requestAnimationFrame for performance
        window.addEventListener('scroll', function () {
            if (!ticking) {
                requestAnimationFrame(function () {
                    handleScroll();
                    ticking = false;
                });
                ticking = true;
            }
        }, { passive: true });

        // Initial calculation
        handleScroll();

        // Recalculate on resize
        $(window).on('resize.rpsticky', function () {
            currentTop = stickyOffset;
            handleScroll();
        });

        // Recalculate when content might change (tabs, swatches, etc.)
        var observer = new MutationObserver(function () {
            handleScroll();
        });

        observer.observe($infoPanel[0], {
            childList: true,
            subtree: true,
            attributes: true
        });
    };
});

/**
 * Rollpix ProductGallery - Inline Accordion Tabs
 *
 * Moves Magento product detail tabs into the product info column
 * and converts them to collapsible accordion sections.
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
        var inlineEnabled = config.tabs && config.tabs.inlineEnabled;
        if (!inlineEnabled) {
            return;
        }

        var descMaxHeight = (config.tabs && config.tabs.descriptionMaxHeight) || 0;

        var $infoPanel = $('.rp-product-wrapper .product-info-main');
        if (!$infoPanel.length) {
            return;
        }

        // Wait for Magento to render tab content (may be async via data-mage-init)
        var attempts = 0;
        var maxAttempts = 50; // 5 seconds
        var pollInterval = setInterval(function () {
            attempts++;
            var $detailed = $('.product.info.detailed');

            if ($detailed.find('.data.item.content').length > 0) {
                clearInterval(pollInterval);
                processTabs($detailed, $infoPanel);
            } else if (attempts >= maxAttempts) {
                clearInterval(pollInterval);
            }
        }, 100);

        function processTabs($detailed, $infoPanel) {
            var tabs = extractTabs($detailed);
            if (tabs.length === 0) {
                return;
            }

            var $accordion = buildAccordion(tabs);
            $infoPanel.append($accordion);
            $detailed.hide();
            initAccordionBehavior($accordion);

            // Apply description truncation after DOM insertion
            if (descMaxHeight > 0) {
                applyDescriptionTruncation($accordion);
            }

            // Re-initialize Magento widgets inside accordion content
            $('body').trigger('contentUpdated');
        }

        function extractTabs($container) {
            var tabData = [];
            var $tabWidget = $container.find('.product.data.items');

            $tabWidget.find('.data.item.title').each(function () {
                var $title = $(this);
                var $link = $title.find('a.data.switch');
                var targetId = ($link.attr('href') || '').replace('#', '');
                var $content = null;

                if (targetId) {
                    $content = $tabWidget.find('.data.item.content[id="' + targetId + '"]');
                }

                // Fallback: next sibling content div
                if (!$content || !$content.length) {
                    $content = $title.next('.data.item.content');
                }

                if ($content && $content.length && $.trim($content.html())) {
                    tabData.push({
                        title: $.trim($link.text() || $title.text()),
                        content: $content.html(),
                        id: targetId || ('rp-tab-' + tabData.length)
                    });
                }
            });

            return tabData;
        }

        function buildAccordion(tabsData) {
            var $accordion = $('<div class="rp-accordion"></div>');

            $.each(tabsData, function (index, tab) {
                var isFirst = (index === 0);
                var sectionId = 'rp-accordion-' + tab.id;
                var headerId = 'rp-accordion-header-' + tab.id;

                var $section = $('<div class="rp-accordion-section"></div>');

                var $header = $(
                    '<button class="rp-accordion-header' +
                    (isFirst ? ' rp-accordion-active' : '') + '"' +
                    ' id="' + headerId + '"' +
                    ' type="button"' +
                    ' aria-expanded="' + (isFirst ? 'true' : 'false') + '"' +
                    ' aria-controls="' + sectionId + '">' +
                    '<span class="rp-accordion-title">' + tab.title + '</span>' +
                    '<span class="rp-accordion-icon" aria-hidden="true"></span>' +
                    '</button>'
                );

                var $panel = $(
                    '<div class="rp-accordion-panel' +
                    (isFirst ? ' rp-accordion-open' : '') + '"' +
                    ' id="' + sectionId + '"' +
                    ' role="region"' +
                    ' aria-labelledby="' + headerId + '">' +
                    '<div class="rp-accordion-content">' +
                    tab.content +
                    '</div>' +
                    '</div>'
                );

                $section.append($header).append($panel);
                $accordion.append($section);
            });

            return $accordion;
        }

        function applyDescriptionTruncation($accordion) {
            // Apply to the first section (description)
            var $firstContent = $accordion.find('.rp-accordion-section:first-child .rp-accordion-content');
            if (!$firstContent.length) {
                return;
            }

            // Wait a frame for content to render and measure
            requestAnimationFrame(function () {
                var contentHeight = $firstContent[0].scrollHeight;

                if (contentHeight <= descMaxHeight) {
                    return;
                }

                $firstContent.addClass('rp-accordion-truncated');
                $firstContent.css('max-height', descMaxHeight + 'px');

                var $readMore = $(
                    '<button class="rp-accordion-readmore" type="button">' +
                    'Ver m\u00e1s...' +
                    '</button>'
                );

                $firstContent.after($readMore);

                $readMore.on('click', function () {
                    $firstContent.removeClass('rp-accordion-truncated');
                    $firstContent.css('max-height', '');
                    $readMore.remove();
                });
            });
        }

        function initAccordionBehavior($accordion) {
            $accordion.on('click', '.rp-accordion-header', function () {
                var $header = $(this);
                var $panel = $header.next('.rp-accordion-panel');
                var isOpen = $header.hasClass('rp-accordion-active');

                if (isOpen) {
                    $header.removeClass('rp-accordion-active')
                        .attr('aria-expanded', 'false');
                    $panel.removeClass('rp-accordion-open');
                } else {
                    $header.addClass('rp-accordion-active')
                        .attr('aria-expanded', 'true');
                    $panel.addClass('rp-accordion-open');
                }
            });
        }
    };
});

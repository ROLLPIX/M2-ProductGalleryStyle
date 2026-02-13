# Rollpix Product Gallery for Magento 2

A modern, editorial-style product gallery module for Magento 2 that replaces the default Fotorama gallery with vertical and grid scrolling layouts. Features sticky product info panel with multiple modes, hover/click/lightbox zoom, and mobile carousel with sticky behavior.

![Magento 2](https://img.shields.io/badge/Magento-2.4.7--2.4.8-orange.svg)
![PHP](https://img.shields.io/badge/PHP-8.1--8.4-blue.svg)
![License](https://img.shields.io/badge/License-MIT-green.svg)

## Features

### Layout
- **Vertical Layout**: Images stacked vertically in one column, product info on the other
- **Grid Layout**: Images in a multi-column grid (2 or 3 columns) with product info sidebar
- **Configurable Position**: Gallery on left or right side
- **Flexible Column Ratios**: Vertical mode: 40/60, 50/50, or 60/40. Grid mode: 70/30, 75/25, or 80/20
- **Adjustable Image Gap**: Configure spacing between images (0-40px)

### Zoom Options
- **Hover Magnifier**: Zoom on mouse hover with lens indicator and magnified view (right side or inside image)
- **Click Zoom**: Click to zoom into the image in-place, click again to reset
- **Lightbox Mode**: Full-screen image viewing with GLightbox navigation
- **Configurable Zoom Level**: 2x to 10x magnification
- **Disabled Option**: Turn off zoom entirely

### Sticky Panel
- **Two Sticky Modes**:
  - **Frame Mode**: Info panel scrolls inside a fixed-height container
  - **Natural Scroll Mode**: Info panel stays fixed at the top while images scroll (like Quiksilver.com)
- **Configurable Offset**: Adjust top offset for sites with fixed headers
- **Toggle On/Off**: Enable or disable sticky behavior

### Mobile Experience
- **Swipeable Carousel**: Touch-friendly image carousel with overlay dot indicators
- **Sticky Carousel**: Image stays fixed at top while product info scrolls over it
- **Dynamic Slide Height**: Wrapper adapts to each slide's image height (no blank space)
- **Vertical Stack Option**: Alternative stack layout for mobile

### Performance
- **Lazy Loading**: Native lazy loading for images
- **Lightweight**: No heavy dependencies, GLightbox is only ~2KB gzipped
- **CSS Variables**: Dynamic styling without page reload
- **requestAnimationFrame**: Smooth scroll-based interactions

## Requirements

| Requirement | Version |
|-------------|---------|
| Magento | 2.4.7 - 2.4.8 |
| PHP | 8.1 - 8.4 |
| Theme | Luma or Luma-based themes |

## Installation

### Via Composer (Recommended)

```bash
composer require rollpix/module-product-gallery
bin/magento module:enable Rollpix_ProductGallery
bin/magento setup:upgrade
bin/magento setup:di:compile
bin/magento setup:static-content:deploy -f
bin/magento cache:flush
```

### Manual Installation

1. Create the directory structure:
```bash
mkdir -p app/code/Rollpix/ProductGallery
```

2. Download and extract the module files to `app/code/Rollpix/ProductGallery/`

3. Enable the module:
```bash
bin/magento module:enable Rollpix_ProductGallery
bin/magento setup:upgrade
bin/magento setup:di:compile
bin/magento setup:static-content:deploy -f
bin/magento cache:flush
```

## Configuration

Navigate to **Stores > Configuration > Rollpix > Product Gallery**

### Layout Settings

| Option | Description | Default |
|--------|-------------|---------|
| Layout Type | Vertical (single column) or Grid (multi-column) | Vertical |
| Gallery Position | Left or Right | Left |
| Column Ratio | 40/60, 50/50, or 60/40 (vertical mode) | 50/50 |
| Grid Ratio | 70/30, 75/25, or 80/20 (grid mode) | 70/30 |
| Image Columns in Grid | 2 or 3 columns (grid mode) | 2 |
| Gap Between Images | Spacing in pixels (0-40) | 20px |

### Zoom Settings

| Option | Description | Default |
|--------|-------------|---------|
| Zoom Type | Hover Magnifier, Click Zoom, Lightbox, or Disabled | Hover |
| Zoom Level | Magnification level (2x-10x) | 3x |
| Zoom Window Position | Right Side or Inside Image (hover mode) | Right |

### Sticky Panel Settings

| Option | Description | Default |
|--------|-------------|---------|
| Enable Sticky | Keep product info fixed while scrolling | Yes |
| Sticky Mode | Frame (scrollable panel) or Natural Scroll (fixed at top) | Natural Scroll |
| Top Offset | Distance from top in pixels | 20px |

### Mobile Settings

| Option | Description | Default |
|--------|-------------|---------|
| Mobile Behavior | Vertical Stack or Swipeable Carousel | Carousel |

## Screenshots

### Desktop - Vertical Layout (50/50)
```
┌─────────────────────────────────────────────┐
│  ┌─────────────┐    ┌─────────────────────┐ │
│  │             │    │ Product Title       │ │
│  │   Image 1   │    │ $99.00              │ │
│  │             │    │                     │ │
│  └─────────────┘    │ [Add to Cart]       │ │
│                     │                     │ │
│  ┌─────────────┐    │ Description...      │ │
│  │             │    │                     │ │
│  │   Image 2   │    │  (Sticky Panel)     │ │
│  │             │    │                     │ │
│  └─────────────┘    └─────────────────────┘ │
│                                             │
│  ┌─────────────┐                            │
│  │   Image 3   │                            │
│  └─────────────┘                            │
└─────────────────────────────────────────────┘
```

### Desktop - Grid Layout (70/30, 2 columns)
```
┌──────────────────────────────────┬──────────────┐
│  ┌──────────┐  ┌──────────┐     │              │
│  │  Img 1   │  │  Img 2   │     │  Product     │
│  └──────────┘  └──────────┘     │  $99.00      │
│  ┌──────────┐  ┌──────────┐     │              │
│  │  Img 3   │  │  Img 4   │     │  [Add to     │
│  └──────────┘  └──────────┘     │   Cart]      │
│  ┌──────────┐                   │              │
│  │  Img 5   │                   │  (Sticky)    │
│  └──────────┘                   │              │
│         70%                     │     30%      │
└──────────────────────────────────┴──────────────┘
```

### Mobile Carousel (Sticky)
```
┌───────────────┐
│               │  ← Image stays fixed
│   Image 1     │    at top while
│               │    scrolling down
│   ● ○ ○ ○ ○   │  ← Overlay indicators
├───────────────┤
│ Product Title │  ← Scrolls over
│ $99.00        │    the image
│ [Add to Cart] │
└───────────────┘
```

## File Structure

```
app/code/Rollpix/ProductGallery/
├── registration.php
├── composer.json
├── README.md
├── LICENSE
├── etc/
│   ├── module.xml
│   ├── config.xml
│   ├── acl.xml
│   ├── di.xml
│   └── adminhtml/
│       └── system.xml
├── Model/
│   ├── Config.php
│   └── Config/Source/
│       ├── LayoutType.php
│       ├── ColumnRatio.php
│       ├── GridRatio.php
│       ├── GridImageColumns.php
│       ├── GalleryPosition.php
│       ├── ImageGap.php
│       ├── ZoomType.php
│       ├── ZoomLevel.php
│       ├── ZoomPosition.php
│       ├── StickyMode.php
│       └── MobileBehavior.php
├── ViewModel/
│   └── GalleryConfig.php
└── view/
    └── frontend/
        ├── layout/
        │   └── catalog_product_view.xml
        ├── templates/
        │   └── product/view/
        │       └── gallery-vertical.phtml
        ├── requirejs-config.js
        └── web/
            ├── css/
            │   └── gallery-vertical.css
            └── js/
                ├── gallery-zoom.js
                ├── gallery-carousel.js
                └── gallery-sticky.js
```

## Customization

### CSS Variables

The module uses CSS custom properties that can be overridden:

```css
.rp-product-wrapper {
    --rp-col-1: 1fr;           /* First column width */
    --rp-col-2: 1fr;           /* Second column width */
    --rp-gallery-order: 1;     /* Gallery order (1 or 2) */
    --rp-info-order: 2;        /* Info panel order (1 or 2) */
    --rp-sticky-offset: 20px;  /* Sticky top offset */
    --rp-image-gap: 20px;      /* Gap between images */
    --rp-grid-cols: 2;         /* Grid layout: image columns */
}
```

### Theme Compatibility

If your theme uses different selectors, you may need to adjust the CSS. The module targets:

- `.catalog-product-view` - Product page body class
- `.column.main` - Main content area
- `.product-info-main` - Product info container

### Extending the Module

To add custom functionality, you can:

1. **Override the template**: Copy `gallery-vertical.phtml` to your theme
2. **Add custom CSS**: Create a `_extend.less` file in your theme
3. **Modify JS behavior**: Create a mixin for the JS components

## Troubleshooting

### Zoom not working

1. Open browser DevTools (F12) and check Console for errors
2. Verify the module is outputting: "Rollpix Gallery Zoom initialized"
3. Clear all caches:
```bash
rm -rf pub/static/frontend/*
rm -rf var/view_preprocessed/*
bin/magento setup:static-content:deploy -f
bin/magento cache:flush
```

### Layout issues with custom theme

1. Verify your theme extends Luma
2. Check if your theme overrides `catalog_product_view.xml`
3. Ensure `.product-info-main` container exists

### Sticky not working

1. Verify the parent container has sufficient height
2. Check if another CSS rule overrides `position: sticky`
3. Ensure no `overflow: hidden` on parent elements

### Images not loading

1. Check if product has images assigned
2. Verify image URLs are accessible
3. Check browser console for 404 errors

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile Safari (iOS 12+)
- Chrome for Android

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Coding Standards

- Follow [Magento 2 Coding Standards](https://developer.adobe.com/commerce/php/coding-standards/)
- Use PSR-12 for PHP code
- Document all public methods

## Roadmap

- [ ] Admin configuration for enable/disable per category
- [ ] Video support in gallery
- [ ] Thumbnail strip option
- [ ] Image counter overlay
- [ ] Custom animations/transitions
- [ ] Integration with PageBuilder

## Changelog

### 1.3.0 (2026-02-13)
- Inline accordion tabs: move product detail tabs (Description, Additional Info, Reviews) inside the product info column as collapsible accordion sections (configurable)
- Description truncation with gradient fade and "Read more" link (configurable max height)
- Fashion layout: new alternating 1-2 image pattern (1 full-width, 2 half-width, repeat) with orphan image handling

### 1.2.4 (2026-02-07)
- Fix Hyva: force inner product-info `<section>` to single column layout (Hyva wraps product info in a Tailwind grid section)

### 1.2.3 (2026-02-07)
- Force 1column page layout on product page for Hyva compatibility
- Force grid display and full-width on all direct children of wrapper
- Hyva/Tailwind width overrides with !important on wrapper children

### 1.2.2 (2026-02-07)
- Fix Hyva theme compatibility: product info column now fills full grid width
- Reset Tailwind/Hyva width restrictions on product-info-main and gallery columns

### 1.2.1 (2026-02-06)
- Add PHP 8.4 support

### 1.2.0 (2026-02-06)
- Mobile carousel: sticky image at top while scrolling (info scrolls over)
- Mobile carousel: overlay dot indicators on image
- Mobile carousel: dynamic wrapper height per slide (eliminates blank space)
- Mobile: overflow fixes for all Magento wrapper ancestors to support sticky
- Mobile: `-webkit-sticky` prefix for iOS Safari support

### 1.1.0 (2026-02-05)
- Grid layout: multi-column image grid with info sidebar
- Grid configurable ratios: 70/30, 75/25, 80/20
- Grid configurable image columns: 2 or 3
- Click zoom mode: click to zoom in-place, click again to reset
- Sticky panel modes: Frame (scrollable) and Natural Scroll (fixed at top)
- Zoom level extended to 10x
- Zoom result uses fixed viewport positioning (follows cursor)
- Admin config groups reordered: Layout, Zoom, Sticky, Mobile

### 1.0.0 (2025-01-26)
- Initial release
- Vertical gallery layout
- Hover zoom functionality
- Lightbox support (GLightbox)
- Mobile carousel
- Sticky product info panel
- Full admin configuration

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Credits

- [GLightbox](https://biati-digital.github.io/glightbox/) - Lightweight lightbox library
- Inspired by editorial product pages from leading fashion e-commerce sites

## Support

- **Issues**: [GitHub Issues](https://github.com/rollpix/magento2-product-gallery/issues)
- **Documentation**: [Wiki](https://github.com/rollpix/magento2-product-gallery/wiki)

---

Made with ❤️ by [Rollpix](https://rollpix.com)

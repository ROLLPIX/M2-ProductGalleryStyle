# Rollpix Product Gallery for Magento 2

A modern, editorial-style product gallery module for Magento 2 that replaces the default Fotorama gallery with a vertical scrolling layout. Features a sticky product info panel, hover zoom, lightbox support, and mobile carousel.

![Magento 2](https://img.shields.io/badge/Magento-2.4.7--2.4.8-orange.svg)
![PHP](https://img.shields.io/badge/PHP-8.1--8.3-blue.svg)
![License](https://img.shields.io/badge/License-MIT-green.svg)

## Features

### Layout
- **Vertical Gallery Layout**: Images stacked vertically on one side, product info on the other
- **Configurable Position**: Gallery on left or right side
- **Flexible Column Ratios**: Choose between 40/60, 50/50, or 60/40 splits
- **Adjustable Image Gap**: Configure spacing between images (0-40px)

### Zoom Options
- **Hover Magnifier**: Native-style zoom on mouse hover with lens indicator
- **Lightbox Mode**: Full-screen image viewing with GLightbox
- **Configurable Zoom Level**: 2x to 5x magnification
- **Zoom Position**: Display zoomed image on the right side or inside the image

### Sticky Panel
- **Sticky Product Info**: Product details remain visible while scrolling through images
- **Configurable Offset**: Adjust top offset for sites with fixed headers
- **Toggle On/Off**: Enable or disable sticky behavior

### Mobile Experience
- **Responsive Design**: Optimized for all screen sizes
- **Swipeable Carousel**: Touch-friendly image carousel on mobile
- **Vertical Stack Option**: Alternative stack layout for mobile

### Performance
- **Lazy Loading**: Native lazy loading for images
- **Lightweight**: No heavy dependencies, GLightbox is only ~2KB gzipped
- **CSS Variables**: Dynamic styling without page reload

## Requirements

| Requirement | Version |
|-------------|---------|
| Magento | 2.4.7 - 2.4.8 |
| PHP | 8.1 - 8.3 |
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

### Zoom Settings

| Option | Description | Default |
|--------|-------------|---------|
| Zoom Type | Hover Magnifier, Lightbox, or Disabled | Hover |
| Zoom Level | Magnification level (2x-5x) | 3x |
| Zoom Window Position | Right Side or Inside Image | Right |

### Layout Settings

| Option | Description | Default |
|--------|-------------|---------|
| Gallery Position | Left or Right | Left |
| Column Ratio | 40/60, 50/50, or 60/40 | 50/50 |
| Gap Between Images | Spacing in pixels (0-40) | 20px |

### Mobile Settings

| Option | Description | Default |
|--------|-------------|---------|
| Mobile Behavior | Vertical Stack or Swipeable Carousel | Carousel |

### Sticky Panel Settings

| Option | Description | Default |
|--------|-------------|---------|
| Enable Sticky | Keep product info fixed while scrolling | Yes |
| Top Offset | Distance from top in pixels | 20px |

## Screenshots

### Desktop - Gallery Left (50/50)
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

### Hover Zoom (Right Position)
```
┌─────────────────┐  ┌─────────────────┐
│    ┌─────┐      │  │                 │
│    │Lens │      │  │   Zoomed Area   │
│    └─────┘      │  │                 │
│                 │  │                 │
│   Main Image    │  │                 │
└─────────────────┘  └─────────────────┘
```

### Mobile Carousel
```
┌───────────────┐
│ ◄  Image 1  ► │
│               │
│   ● ○ ○ ○ ○   │
├───────────────┤
│ Product Title │
│ $99.00        │
│ [Add to Cart] │
└───────────────┘
```

## File Structure

```
app/code/Rollpix/ProductGallery/
├── registration.php
├── composer.json
├── README.md
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
│       ├── ZoomType.php
│       ├── ZoomLevel.php
│       ├── ZoomPosition.php
│       ├── GalleryPosition.php
│       ├── ColumnRatio.php
│       ├── ImageGap.php
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
                └── gallery-carousel.js
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
- [ ] Zoom on hover without click
- [ ] Custom animations/transitions
- [ ] Integration with PageBuilder

## Changelog

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

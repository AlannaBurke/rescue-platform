# Theme Customization Guide

This guide explains how to customize the visual appearance of your Rescue Platform website.

## Colors

The color palette is defined in `nextjs-frontend/tailwind.config.js`. You can modify the existing colors or add new ones to match your organization's branding.

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: '#your-primary-color',
        secondary: '#your-secondary-color',
        accent: '#your-accent-color',
      },
    },
  },
};
```

## Fonts

Fonts are configured in `nextjs-frontend/src/app/layout.tsx`. The default theme uses Google Fonts, but you can use any font provider or self-hosted fonts.

## Illustrations

The watercolor-style illustrations used throughout the site are located in `nextjs-frontend/public/illustrations`. You can replace these with your own images to give your site a unique look.

## Navigation

The header navigation is controlled by the "Site Settings" content type in Drupal. See the [Drupal Admin Guide](admin-guide.md) for more information.

## Layout

The overall page layout is defined in `nextjs-frontend/src/app/layout.tsx`. You can modify this file to change the structure of your pages, such as adding a sidebar or a different header/footer configurations.

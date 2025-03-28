# Kalei Styleguide Migration Guide

This guide aims to help users migrate from the original Kalei Styleguide to the modernized version. It covers the major architectural changes and provides guidance for transitioning your existing style guides.

## Architecture Changes

### Old Architecture
- Backbone.js for MVC
- RequireJS for module loading
- jQuery for DOM manipulation
- LESS for CSS preprocessing
- Global script inclusion
- No build process

### New Architecture
- React for UI components
- ES Modules for importing
- React Hooks for state management
- Sass for CSS preprocessing
- Vite for building and bundling
- NPM for package management

## Migration Steps

### 1. Configuration

#### Old Configuration (js/config.js)
```javascript
define({
  css_path: 'path/to/styles.css',
  css_processor: 'jscssp',
  external_stylesheets: []
});
```

#### New Configuration (src/config.js)
```javascript
const config = {
  css_path: '/css/styles.css',
  css_processor: 'jscssp',
  marked_options: {
    tables: true,
    gfm: true
  },
  external_stylesheets: [],
  theme: {
    primary_color: '#0066ff',
    accent_color: '#75eb33'
  }
};

export default config;
```

### 2. Stylesheet Documentation

Your CSS documentation format remains the same, so existing stylesheets should continue to work without changes. The modernized Kalei still supports Markdown in CSS comments:

```css
/*
# Component Name
Component description

## Variant
Description of variant

```html
<div class="example">Example HTML</div>
```
*/

.example {
  /* CSS rules */
}
```

### 3. Custom Themes

If you had customized the original Kalei theme, you'll need to update your custom CSS to work with the new structure:

- Old theme files: `css/theme.css`
- New theme files: `src/styles/_variables.scss`, `src/styles/index.scss`

You can customize the theme by modifying the variables in `_variables.scss` or by creating a custom theme file and importing it in `index.scss`.

### 4. Dependencies

The modernized version has different dependencies:

```bash
npm install --save react react-dom react-router-dom marked highlight.js sass
npm install --save-dev vite @vitejs/plugin-react eslint prettier jest
```

### 5. Development Workflow

The new development workflow uses npm scripts:

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Troubleshooting Common Issues

### CSS Not Loading

If your CSS is not loading, check:

1. The `css_path` setting in `src/config.js`
2. Make sure your CSS files are copied to the `public/css` directory (use `copy-assets.sh`)
3. Check browser console for any loading errors

### Markdown Not Rendering

If your Markdown isn't rendering correctly:

1. Ensure your CSS comments use the correct syntax with `/*` and `*/`
2. Make sure code examples use triple backticks (```) for fence blocks
3. Check for any syntax errors in your Markdown

### Styles Not Applying

If your styles aren't applying to the examples:

1. Make sure your CSS path is correct and the file is accessible
2. Check that the CSS is being properly parsed
3. Verify that the code examples are correctly formatted with HTML language specified

## Additional Resources

- [React Documentation](https://reactjs.org/docs/getting-started.html)
- [Sass Documentation](https://sass-lang.com/documentation)
- [Vite Documentation](https://vitejs.dev/guide/)
- [Marked Documentation](https://marked.js.org/)
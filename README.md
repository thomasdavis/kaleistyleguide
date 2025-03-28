# Kalei Styleguide - Modern Edition

A living style guide generator that uses your actual CSS to create beautiful documentation.

## What's New in the Modern Edition

This is a completely modernized version of the original Kalei Styleguide, featuring:

- Modern React-based architecture
- Responsive design that works on all devices
- Enhanced code highlighting and examples
- Sass support for advanced styling
- Improved documentation navigation
- Vite-powered development environment with hot module replacement

## Getting Started

### Installation

```bash
# Clone the repository
git clone https://github.com/kaleistyleguide/kaleistyleguide.git
cd kaleistyleguide

# Install dependencies
npm install
```

### Development

```bash
# Copy CSS assets to public directory
./copy-assets.sh

# Start development server
npm run dev
```

### Building for Production

```bash
# Build the application
npm run build

# Preview the production build
npm run preview
```

## Configuration

You can configure Kalei by editing the `src/config.js` file:

```javascript
const config = {
  // CSS path is used as the primary stylesheet to parse
  css_path: '/css/styles.css',
  
  // Choose the CSS processor to use
  css_processor: 'jscssp', // Options: 'jscssp', 'sass'
  
  // Options for the markdown parser
  marked_options: {
    tables: true,
    gfm: true
  },
  
  // External stylesheets to include
  external_stylesheets: []
};
```

## Writing Documentation

Kalei parses CSS comments written in Markdown and transforms them into a living style guide:

```css
/*
# Button Styles 
Our button system uses a semantic HTML approach with consistent styling.

## Primary Button
Primary buttons are used for main actions.

```html
<button class="btn btn-primary">Primary Button</button>
```
*/

.btn {
  display: inline-block;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
}

.btn-primary {
  background-color: #0066ff;
  color: white;
  border: none;
}
```

## Technologies Used

- React
- Vite
- Sass
- ESLint & Prettier
- Jest
- marked
- highlight.js

## License

Public domain: http://unlicense.org/

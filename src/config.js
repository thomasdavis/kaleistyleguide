/**
 * Kalei Styleguide Configuration
 * This file configures the Kalei Styleguide application
 */

const config = {
  // CSS path is used as the primary stylesheet to parse
  css_path: '/css/global.css',
  
  // You can manually list specific CSS files to process
  // css_paths: ['/css/styles.css', '/css/buttons.css'],
  
  // Choose the CSS processor to use
  css_processor: 'jscssp', // Options: 'jscssp', 'sass'
  
  // Options for the markdown parser
  marked_options: {
    tables: true,
    gfm: true,
    breaks: false,
    pedantic: false,
    sanitize: false,
    smartLists: true,
    smartypants: false
  },
  
  // External stylesheets to include in the documentation
  external_stylesheets: [],
  
  // Theme options
  theme: {
    primary_color: '#0066ff',
    accent_color: '#75eb33',
    sidebar_width: '300px',
    code_theme: 'github' // Options: 'github', 'monokai', 'dracula', etc.
  }
};

export default config;
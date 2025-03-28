import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Button from '../components/Button';

export default function Styleguide() {
  const [stylesheets, setStylesheets] = useState([]);
  const [activeSheet, setActiveSheet] = useState(null);
  const [blocks, setBlocks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real implementation, this would use Kalei to parse the CSS files
    // For this example, we'll simulate the parsed stylesheets
    const stylesheetData = [
      { 
        id: 'global',
        name: 'Global Styles',
        path: '/styles/global.css',
        description: 'Base styles for the entire application'
      },
      { 
        id: 'button',
        name: 'Button Component',
        path: '/styles/Button.css',
        description: 'Styles for the button component'
      },
      { 
        id: 'card',
        name: 'Card Component',
        path: '/styles/Card.css',
        description: 'Styles for the card component'
      }
    ];

    setStylesheets(stylesheetData);
    // Set the first stylesheet as active by default
    if (stylesheetData.length > 0) {
      loadStylesheetContent(stylesheetData[0]);
    }
  }, []);

  const loadStylesheetContent = async (stylesheet) => {
    setLoading(true);
    setActiveSheet(stylesheet);

    // In a real implementation, this would use Kalei to parse the CSS file
    // For this example, we'll simulate the parsed style blocks
    let simulatedBlocks = [];

    if (stylesheet.id === 'global') {
      simulatedBlocks = [
        {
          title: 'Kalei Next.js Example - Global Styles',
          content: `
# Kalei Next.js Example - Global Styles
This is the global stylesheet for the Kalei Next.js example application.
It demonstrates how to document your CSS with markdown comments for Kalei.

## Colors
We use a specific color palette throughout the application:

- Primary: #0066ff
- Secondary: #75eb33
- Dark: #333333
- Light: #f8f9fa

## Typography
We use a system font stack to ensure optimal performance.
`,
          examples: [
            {
              language: 'html',
              code: '<p class="text-base">Base text style</p>\n<p class="text-lg">Large text style</p>\n<p class="text-xl">Extra large text style</p>'
            }
          ]
        },
        {
          title: 'Buttons',
          content: `
## Buttons
Button styling for actions.
`,
          examples: [
            {
              language: 'html',
              code: '<button class="btn">Default Button</button>\n<button class="btn btn-primary">Primary Button</button>\n<button class="btn btn-secondary">Secondary Button</button>\n<button class="btn btn-large">Large Button</button>'
            }
          ]
        },
        {
          title: 'Cards',
          content: `
## Cards
Card components for displaying content.
`,
          examples: [
            {
              language: 'html',
              code: '<div class="card">\n  <div class="card-header">Card Title</div>\n  <div class="card-body">\n    <p>Card content goes here.</p>\n  </div>\n  <div class="card-footer">\n    <button class="btn btn-primary">Action</button>\n  </div>\n</div>'
            }
          ]
        }
      ];
    } else if (stylesheet.id === 'button') {
      simulatedBlocks = [
        {
          title: 'Button Component',
          content: `
# Button Component
A customizable button component with various styles and sizes.

## Usage
The Button component can be used in various contexts throughout the application.
It supports different variants and sizes to accommodate different design needs.
`,
          examples: [
            {
              language: 'html',
              code: '<button class="button button-primary">Primary Button</button>\n<button class="button button-secondary">Secondary Button</button>\n<button class="button button-outline">Outline Button</button>'
            }
          ]
        },
        {
          title: 'Button Variants',
          content: `
## Button Variants
Different button styles for various contexts.

### Primary
Primary action buttons.
`,
          examples: [
            {
              language: 'html',
              code: '<button class="button button-primary">Primary Button</button>\n<button class="button button-primary button-sm">Small Primary</button>\n<button class="button button-primary button-lg">Large Primary</button>'
            }
          ]
        }
      ];
    } else if (stylesheet.id === 'card') {
      simulatedBlocks = [
        {
          title: 'Card Component',
          content: `
# Card Component
A versatile card component for displaying content in a contained format.

## Usage
Cards are used throughout the application to display content in a consistent and visually appealing way.
`,
          examples: [
            {
              language: 'html',
              code: '<div class="card">\n  <div class="card-header">Card Title</div>\n  <div class="card-body">Card content goes here</div>\n  <div class="card-footer">Card footer</div>\n</div>'
            }
          ]
        },
        {
          title: 'Card Variants',
          content: `
## Card Variants
Different styles of cards for various purposes.

### Featured Card
A card style that stands out more than standard cards.
`,
          examples: [
            {
              language: 'html',
              code: '<div class="card card-featured">\n  <div class="card-header">Featured Card</div>\n  <div class="card-body">This card stands out from the rest.</div>\n  <div class="card-footer">\n    <button class="button button-primary">Action</button>\n  </div>\n</div>'
            }
          ]
        }
      ];
    }

    setBlocks(simulatedBlocks);
    setLoading(false);
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar */}
      <div style={{ 
        width: '250px', 
        backgroundColor: '#f5f5f5', 
        padding: '1rem',
        overflowY: 'auto',
        borderRight: '1px solid #eee'
      }}>
        <div style={{ marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Kalei Styleguide</h2>
          <Link href="/" passHref>
            <Button variant="outline" size="sm" style={{ width: '100%' }}>
              Back to Home
            </Button>
          </Link>
        </div>
        
        <h3 style={{ fontSize: '1rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Stylesheets</h3>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {stylesheets.map(sheet => (
            <li key={sheet.id} style={{ marginBottom: '0.5rem' }}>
              <a 
                href="#" 
                style={{ 
                  display: 'block',
                  padding: '0.5rem',
                  borderRadius: '4px',
                  backgroundColor: activeSheet?.id === sheet.id ? 'var(--color-primary)' : 'transparent',
                  color: activeSheet?.id === sheet.id ? 'white' : 'inherit',
                  textDecoration: 'none'
                }}
                onClick={(e) => {
                  e.preventDefault();
                  loadStylesheetContent(sheet);
                }}
              >
                {sheet.name}
              </a>
            </li>
          ))}
        </ul>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, padding: '2rem', overflowY: 'auto' }}>
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
            <p>Loading styleguide...</p>
          </div>
        ) : activeSheet ? (
          <>
            <div style={{ marginBottom: '2rem' }}>
              <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{activeSheet.name}</h1>
              <p style={{ color: '#666' }}>{activeSheet.description}</p>
              <code style={{ 
                display: 'inline-block',
                padding: '0.25rem 0.5rem',
                backgroundColor: '#f0f0f0',
                borderRadius: '4px',
                marginTop: '0.5rem',
                fontSize: '0.85rem'
              }}>
                {activeSheet.path}
              </code>
            </div>

            {blocks.map((block, index) => (
              <StyleBlock key={index} block={block} />
            ))}
          </>
        ) : (
          <div>
            <p>Select a stylesheet from the sidebar to view its documentation.</p>
          </div>
        )}
      </div>
    </div>
  );
}

// StyleBlock component to render a section of the styleguide
function StyleBlock({ block }) {
  const [showExample, setShowExample] = useState(false);

  return (
    <div style={{ 
      marginBottom: '3rem',
      padding: '1.5rem',
      backgroundColor: 'white',
      borderRadius: '8px',
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
    }}>
      {/* Render the styled content */}
      <div 
        style={{ marginBottom: '1.5rem' }}
        dangerouslySetInnerHTML={{ 
          __html: `<div class="style-guide-content">${block.content}</div>` 
        }} 
      />

      {/* Example section */}
      {block.examples && block.examples.length > 0 && (
        <div>
          <div style={{ marginBottom: '1rem' }}>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setShowExample(!showExample)}
            >
              {showExample ? 'Hide Example' : 'Show Example'}
            </Button>
          </div>

          {showExample && block.examples.map((example, idx) => (
            <div key={idx} style={{ marginBottom: '1rem' }}>
              {/* Code example */}
              <div style={{ 
                padding: '1rem',
                backgroundColor: '#f5f5f5',
                borderRadius: '4px',
                fontFamily: 'monospace',
                overflow: 'auto',
                whiteSpace: 'pre',
                marginBottom: '1rem'
              }}>
                <code>{example.code}</code>
              </div>

              {/* Rendered example */}
              <div style={{ 
                padding: '1.5rem',
                border: '1px dashed #ddd',
                borderRadius: '4px',
                backgroundColor: 'white'
              }}>
                <div dangerouslySetInnerHTML={{ __html: example.code }} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
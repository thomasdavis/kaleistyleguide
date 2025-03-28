import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import StyleBlock from '../../components/StyleBlock';

describe('StyleBlock Component', () => {
  const mockBlock = {
    html: '<h2>Test Heading</h2><p>Test paragraph content</p>',
    codeExamples: [
      {
        language: 'html',
        code: '<button class="btn">Test Button</button>'
      },
      {
        language: 'css',
        code: '.btn { color: blue; }'
      }
    ]
  };

  test('renders block content correctly', () => {
    render(<StyleBlock block={mockBlock} />);
    
    // Check if heading and paragraph are rendered
    expect(screen.getByText('Test Heading')).toBeInTheDocument();
    expect(screen.getByText('Test paragraph content')).toBeInTheDocument();
  });

  test('renders code examples correctly', () => {
    render(<StyleBlock block={mockBlock} />);
    
    // Check if code examples are rendered
    expect(screen.getByText('.btn { color: blue; }')).toBeInTheDocument();
    expect(screen.getByText('<button class="btn">Test Button</button>')).toBeInTheDocument();
  });

  test('toggles example display when Show Example button is clicked', () => {
    render(<StyleBlock block={mockBlock} />);
    
    // Initially, the example should be hidden
    const toggleButton = screen.getByText('Show Example');
    expect(toggleButton).toBeInTheDocument();
    
    // After clicking, the example should be shown and button text changed
    fireEvent.click(toggleButton);
    expect(screen.getByText('Hide Example')).toBeInTheDocument();
    
    // Check that the example display has the expanded class
    const exampleDisplay = document.querySelector('.code-example-display');
    expect(exampleDisplay).toHaveClass('expanded');
  });
});
import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import { useStylesheets } from '../../hooks/useStylesheets';

// Mock the useStylesheets hook
jest.mock('../../hooks/useStylesheets', () => ({
  useStylesheets: jest.fn()
}));

describe('Sidebar Component', () => {
  beforeEach(() => {
    // Default mock implementation
    useStylesheets.mockReturnValue({
      stylesheets: [
        { id: 'styles', name: 'styles', path: '/css/styles.css' }
      ],
      categories: [
        { 
          name: 'Components', 
          sheets: [
            { id: 'buttons', name: 'buttons' },
            { id: 'forms', name: 'forms' }
          ] 
        }
      ],
      isLoading: false
    });
  });

  test('renders loading state correctly', () => {
    useStylesheets.mockReturnValueOnce({
      stylesheets: [],
      categories: [],
      isLoading: true
    });

    render(
      <BrowserRouter>
        <Sidebar />
      </BrowserRouter>
    );
    
    expect(screen.getByText('Loading stylesheets...')).toBeInTheDocument();
  });

  test('renders sidebar with stylesheets and categories', () => {
    render(
      <BrowserRouter>
        <Sidebar />
      </BrowserRouter>
    );
    
    // Check if main stylesheet is rendered
    expect(screen.getByText('styles')).toBeInTheDocument();
    
    // Check if category is rendered
    expect(screen.getByText('Components')).toBeInTheDocument();
    
    // Check if category stylesheets are rendered
    expect(screen.getByText('buttons')).toBeInTheDocument();
    expect(screen.getByText('forms')).toBeInTheDocument();
  });
});
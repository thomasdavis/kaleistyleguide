import { useState, useEffect } from 'react';
import { parseCSS } from '../utils/cssParser';
import config from '../config';

export const useStylesheets = () => {
  const [stylesheets, setStylesheets] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadStylesheets = async () => {
      try {
        setIsLoading(true);
        
        // Get CSS path from our config file
        const cssPath = config.css_path || '/css/styles.css';
        
        // Load main stylesheet
        const response = await fetch(cssPath);
        if (!response.ok) {
          throw new Error(`Failed to load stylesheet: ${response.statusText}`);
        }
        
        const cssText = await response.text();
        
        // Parse the CSS
        const { sheets, categories } = parseCSS(cssText, cssPath);
        
        setStylesheets(sheets);
        setCategories(categories);
        setError(null);
      } catch (err) {
        console.error('Error loading stylesheets:', err);
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };

    loadStylesheets();
  }, []);

  return { stylesheets, categories, isLoading, error };
};
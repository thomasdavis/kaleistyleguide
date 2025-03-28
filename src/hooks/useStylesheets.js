import { useState, useEffect } from 'react';
import { parseCSS } from '../utils/cssParser';

export const useStylesheets = () => {
  const [stylesheets, setStylesheets] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadStylesheets = async () => {
      try {
        setIsLoading(true);
        
        // Get configuration
        const configResponse = await fetch('/js/config.js');
        const configText = await configResponse.text();
        
        // Extract CSS path from config
        const cssPathMatch = configText.match(/css_path:\s*['"](.+?)['"]/);
        const cssPath = cssPathMatch ? cssPathMatch[1] : '/css/styles.css';
        
        // Load main stylesheet
        const response = await fetch(cssPath);
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
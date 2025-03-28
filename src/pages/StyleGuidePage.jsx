import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { marked } from 'marked';
import hljs from 'highlight.js';
import { useStylesheets } from '../hooks/useStylesheets';
import StyleBlock from '../components/StyleBlock';
import '../styles/pages/StyleGuidePage.scss';

const StyleGuidePage = () => {
  const { styleId } = useParams();
  const navigate = useNavigate();
  const { stylesheets, isLoading, error } = useStylesheets();
  const [stylesheet, setStylesheet] = useState(null);
  const [blocks, setBlocks] = useState([]);

  useEffect(() => {
    // Configure marked with highlight.js
    marked.setOptions({
      highlight: (code, lang) => {
        if (lang && hljs.getLanguage(lang)) {
          return hljs.highlight(code, { language: lang }).value;
        }
        return hljs.highlightAuto(code).value;
      },
      gfm: true,
      breaks: true,
    });
  }, []);

  useEffect(() => {
    if (!isLoading && stylesheets.length > 0) {
      const selectedSheet = stylesheets.find(sheet => sheet.id === styleId);
      
      if (!selectedSheet) {
        // Redirect to the first available stylesheet if the requested one doesn't exist
        if (stylesheets[0]) {
          navigate(`/style/${stylesheets[0].id}`);
        } else {
          navigate('/');
        }
        return;
      }
      
      setStylesheet(selectedSheet);
      
      // If this stylesheet has blocks, use them
      if (selectedSheet.blocks && selectedSheet.blocks.length > 0) {
        setBlocks(selectedSheet.blocks);
      } else {
        // Otherwise, load the stylesheet and parse it
        fetch(selectedSheet.path)
          .then(response => {
            if (!response.ok) {
              throw new Error(`Failed to load stylesheet: ${response.statusText}`);
            }
            return response.text();
          })
          .then(cssText => {
            // Extract and parse comment blocks
            const commentRegex = /\/\*([^*]|[\r\n]|(\*+([^*/]|[\r\n])))*\*+\//g;
            const comments = cssText.match(commentRegex) || [];
            
            const parsedBlocks = comments.map(comment => {
              const cleanComment = comment.replace(/^\/\*+/, '').replace(/\*+\/$/, '').trim();
              return {
                content: cleanComment,
                html: marked.parse(cleanComment),
                codeExamples: extractCodeExamples(cleanComment)
              };
            });
            
            setBlocks(parsedBlocks);
          })
          .catch(err => {
            console.error('Error loading stylesheet:', err);
          });
      }
    }
  }, [styleId, stylesheets, isLoading, navigate]);

  // Helper function to extract code examples
  const extractCodeExamples = (markdown) => {
    const codeRegex = /```(\w*)([\s\S]*?)```/g;
    const examples = [];
    let match;
    
    while ((match = codeRegex.exec(markdown)) !== null) {
      examples.push({
        language: match[1] || 'html',
        code: match[2].trim()
      });
    }
    
    return examples;
  };

  if (isLoading) {
    return <div className="loading">Loading stylesheet...</div>;
  }

  if (error) {
    return <div className="error">Error: {error.message}</div>;
  }

  if (!stylesheet) {
    return <div className="not-found">Stylesheet not found</div>;
  }

  return (
    <div className="style-guide-page">
      <div className="style-guide-header">
        <h1>{stylesheet.title || stylesheet.name}</h1>
        {stylesheet.path && (
          <div className="style-guide-path">
            <span>Source: </span>
            <code>{stylesheet.path}</code>
          </div>
        )}
      </div>

      <div className="style-blocks">
        {blocks.length > 0 ? (
          blocks.map((block, index) => (
            <StyleBlock key={index} block={block} />
          ))
        ) : (
          <div className="no-blocks">
            <p>No documentation blocks found in this stylesheet.</p>
            <p>
              Add documentation by writing Markdown in CSS comments like this:
            </p>
            <pre>
              <code>{`/*
# Component Title
Description of the component

## Variant
\`\`\`html
<div class="example">Example HTML</div>
\`\`\`
*/`}</code>
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default StyleGuidePage;
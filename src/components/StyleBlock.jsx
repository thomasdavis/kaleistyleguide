import { useState, useEffect } from 'react';
import hljs from 'highlight.js';
import 'highlight.js/styles/github.css';
import '../styles/components/StyleBlock.scss';

const StyleBlock = ({ block }) => {
  const [expandedExample, setExpandedExample] = useState(null);
  
  useEffect(() => {
    // Apply syntax highlighting to all code blocks
    document.querySelectorAll('pre code').forEach((el) => {
      hljs.highlightElement(el);
    });
  }, [block]);

  const renderCodeExample = (example, index) => {
    const isExpanded = expandedExample === index;
    
    // Function to safely render HTML examples
    const renderExample = () => {
      if (example.language === 'html' || !example.language) {
        return (
          <div 
            className="code-demo"
            dangerouslySetInnerHTML={{ __html: example.code }}
          />
        );
      }
      return null;
    };

    return (
      <div key={index} className="code-example">
        {example.language === 'html' && (
          <>
            <div className="code-example-toolbar">
              <button 
                className={`code-example-toggle ${isExpanded ? 'active' : ''}`}
                onClick={() => setExpandedExample(isExpanded ? null : index)}
                aria-label={isExpanded ? "Collapse example" : "Expand example"}
              >
                {isExpanded ? 'Hide Example' : 'Show Example'}
              </button>
              <span className="code-example-language">{example.language}</span>
            </div>
            <div className={`code-example-display ${isExpanded ? 'expanded' : ''}`}>
              {renderExample()}
            </div>
          </>
        )}
        <pre>
          <code className={example.language ? `language-${example.language}` : ''}>
            {example.code}
          </code>
        </pre>
      </div>
    );
  };

  return (
    <div className="style-block">
      <div 
        className="style-block-content"
        dangerouslySetInnerHTML={{ __html: block.html }} 
      />
      
      {block.codeExamples && block.codeExamples.length > 0 && (
        <div className="style-block-examples">
          {block.codeExamples.map(renderCodeExample)}
        </div>
      )}
    </div>
  );
};

export default StyleBlock;
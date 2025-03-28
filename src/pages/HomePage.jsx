import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/pages/HomePage.scss';

const HomePage = () => {
  useEffect(() => {
    document.title = 'Kalei - Modern CSS Style Guide';
  }, []);

  return (
    <div className="home-page">
      <div className="home-hero">
        <h1>Kalei Style Guide</h1>
        <p className="home-tagline">
          A modern, living CSS style guide generator that uses your actual CSS to create beautiful
          and maintainable documentation.
        </p>
        <div className="home-buttons">
          <Link to="/style/styles" className="btn btn-primary">
            View Style Guide
          </Link>
          <a 
            href="https://github.com/kaleistyleguide/kaleistyleguide" 
            className="btn btn-secondary"
            target="_blank" 
            rel="noopener noreferrer"
          >
            GitHub
          </a>
        </div>
      </div>

      <div className="home-features">
        <div className="feature-grid">
          <div className="feature-card">
            <div className="feature-icon">📝</div>
            <h3>Document As You Code</h3>
            <p>Write CSS comments in Markdown and Kalei transforms them into beautiful documentation.</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">🔄</div>
            <h3>Always In Sync</h3>
            <p>Your documentation is always in sync with your actual styles because it uses your live CSS.</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">🎨</div>
            <h3>Live Examples</h3>
            <p>Code blocks automatically generate visual examples, allowing you to see your components in action.</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">📱</div>
            <h3>Responsive Design</h3>
            <p>The style guide looks great on all devices, from mobile phones to large desktop screens.</p>
          </div>
        </div>
      </div>

      <div className="home-getting-started">
        <h2>Getting Started</h2>
        <ol>
          <li>Clone the repository or install via npm</li>
          <li>Configure your CSS path in <code>src/config.js</code></li>
          <li>Run the development server</li>
          <li>Write CSS with Markdown documentation</li>
        </ol>
        <div className="code-example">
          <pre>
            <code>{`/* 
# Button Styles 
Our button system uses a semantic HTML approach with consistent styling.

## Primary Button
Primary buttons are used for main actions.

\`\`\`html
<button class="btn btn-primary">Primary Button</button>
\`\`\`
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
`}</code>
          </pre>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
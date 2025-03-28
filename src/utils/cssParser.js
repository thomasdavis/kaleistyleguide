import { marked } from 'marked';

/**
 * Parse CSS file and extract style blocks and metadata
 * @param {string} cssText - The CSS content to parse
 * @param {string} cssPath - The path to the CSS file
 * @returns {Object} - Object containing parsed sheets and categories
 */
export const parseCSS = (cssText, cssPath) => {
  const sheets = [];
  const categoriesMap = new Map();
  
  // Add the main stylesheet
  const mainStyleName = getFilenameFromPath(cssPath);
  sheets.push({
    id: mainStyleName,
    name: mainStyleName,
    path: cssPath,
    category: 'Main',
    blocks: []
  });
  
  // Extract comment blocks
  const commentBlocks = extractCommentBlocks(cssText);
  
  // Parse the comment blocks
  let currentCategory = 'Main';
  const mainSheet = sheets[0];
  
  commentBlocks.forEach(block => {
    // Parse markdown content
    const tokens = marked.lexer(block);
    
    // Look for headings to extract metadata
    const headings = tokens.filter(token => token.type === 'heading');
    
    // If we have a heading, use it as the block title
    if (headings.length > 0) {
      const headingToken = headings[0];
      
      // Level 1 headings are the main sheet title
      if (headingToken.depth === 1) {
        mainSheet.title = headingToken.text;
      }
      
      // Level 3 headings are categories
      if (headingToken.depth === 3) {
        currentCategory = headingToken.text;
      }
      
      // Create a new block with this heading
      mainSheet.blocks.push({
        title: headingToken.text,
        content: block,
        html: marked.parse(block),
        codeExamples: extractCodeExamples(block)
      });
    }
  });
  
  // Extract @import statements to find additional stylesheets
  const importStatements = extractImportStatements(cssText);
  
  importStatements.forEach(importPath => {
    const sheetName = getFilenameFromPath(importPath);
    const sheetId = sheetName.replace(/\s+/g, '-').toLowerCase();
    
    // Add to sheets list
    sheets.push({
      id: sheetId,
      name: sheetName,
      path: importPath,
      category: currentCategory
    });
    
    // Add to categories
    if (!categoriesMap.has(currentCategory)) {
      categoriesMap.set(currentCategory, { name: currentCategory, sheets: [] });
    }
    
    categoriesMap.get(currentCategory).sheets.push({
      id: sheetId,
      name: sheetName
    });
  });
  
  // Convert categories map to array
  const categories = Array.from(categoriesMap.values());
  
  return { sheets, categories };
};

/**
 * Extract CSS comment blocks from a CSS string
 * @param {string} cssText - The CSS content
 * @returns {string[]} - Array of comment blocks
 */
const extractCommentBlocks = (cssText) => {
  const commentRegex = /\/\*([^*]|[\r\n]|(\*+([^*/]|[\r\n])))*\*+\//g;
  const matches = cssText.match(commentRegex) || [];
  
  return matches.map(comment => {
    // Remove the comment delimiters /* and */
    return comment.replace(/^\/\*+/, '').replace(/\*+\/$/, '').trim();
  });
};

/**
 * Extract code examples from a markdown string
 * @param {string} markdown - The markdown content
 * @returns {Object[]} - Array of code examples with language and code
 */
const extractCodeExamples = (markdown) => {
  const codeRegex = /```(\w*)([\s\S]*?)```/g;
  const examples = [];
  let match;
  
  while ((match = codeRegex.exec(markdown)) !== null) {
    examples.push({
      language: match[1] || 'html', // Default to HTML if no language specified
      code: match[2].trim()
    });
  }
  
  return examples;
};

/**
 * Extract @import statements from a CSS string
 * @param {string} cssText - The CSS content
 * @returns {string[]} - Array of import paths
 */
const extractImportStatements = (cssText) => {
  const importRegex = /@import\s+(?:url\()?['"]?([^'")]+)['"]?\)?;?/g;
  const imports = [];
  let match;
  
  while ((match = importRegex.exec(cssText)) !== null) {
    imports.push(match[1]);
  }
  
  return imports;
};

/**
 * Extract filename from a path
 * @param {string} path - The file path
 * @returns {string} - The filename without extension
 */
const getFilenameFromPath = (path) => {
  const filename = path.split('/').pop(); // Get the last part after /
  return filename.replace(/\.\w+$/, ''); // Remove extension
};
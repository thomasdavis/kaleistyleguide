const fs = require('fs');
const path = require('path');
const express = require('express');
const { spawn } = require('child_process');

// Configuration
const nextAppDir = __dirname;
const kaleiDir = path.join(__dirname, '..', '..');
const port = 4000;
const cssSourceDir = path.join(nextAppDir, 'styles');
const kaleiPublicDir = path.join(kaleiDir, 'public');

// Ensure Kalei's public/css directory exists
const publicCssDir = path.join(kaleiPublicDir, 'css');
if (!fs.existsSync(publicCssDir)) {
  fs.mkdirSync(publicCssDir, { recursive: true });
}

// Copy CSS files to Kalei's public directory
console.log('Copying CSS files to Kalei...');
fs.readdirSync(cssSourceDir).forEach(file => {
  if (file.endsWith('.css')) {
    const source = path.join(cssSourceDir, file);
    const dest = path.join(publicCssDir, file);
    fs.copyFileSync(source, dest);
    console.log(`Copied ${file} to Kalei public directory`);
  }
});

// Update Kalei's config to point to our main CSS file
const configPath = path.join(kaleiDir, 'src', 'config.js');
let configContent = fs.readFileSync(configPath, 'utf8');
configContent = configContent.replace(
  /css_path:.*,/,
  `css_path: '/css/global.css',`
);
fs.writeFileSync(configPath, configContent);
console.log('Updated Kalei config to use our CSS files');

// Start the Vite dev server for Kalei
console.log('Starting Kalei Styleguide...');
console.log(`You can view the styleguide at http://localhost:${port}`);

// Run Kalei's Vite server
const viteProcess = spawn('npm', ['run', 'dev', '--', '--port', port], {
  cwd: kaleiDir,
  stdio: 'inherit',
  shell: true
});

// Handle process termination
process.on('SIGINT', () => {
  console.log('Shutting down Kalei...');
  viteProcess.kill();
  process.exit();
});

viteProcess.on('close', (code) => {
  console.log(`Kalei process exited with code ${code}`);
  process.exit(code);
});
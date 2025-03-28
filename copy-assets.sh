#!/bin/bash
# Copy CSS files to the public directory

mkdir -p public/css
mkdir -p public/js

# Copy CSS files
cp -r css/* public/css/

# Copy configuration 
cp js/config.js public/js/

echo "Files copied successfully to public directory!"
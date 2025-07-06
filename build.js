#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

// Copy all built files from src to dist
const srcDir = path.join(__dirname, 'src');
const distDir = path.join(__dirname, 'dist');

if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir);
}

// Copy all .js and .d.ts files from src to dist
fs.readdirSync(srcDir).forEach(file => {
  if (file.endsWith('.js') || file.endsWith('.d.ts')) {
    fs.copyFileSync(path.join(srcDir, file), path.join(distDir, file));
  }
});

// Copy and clean package.json
const pkg = require('./package.json');
const minimalPkg = {
  ...pkg,
  main: 'index.js',
  types: 'index.d.ts',
  scripts: undefined,
  devDependencies: undefined
};
Object.keys(minimalPkg).forEach(
  (k) => minimalPkg[k] === undefined && delete minimalPkg[k]
);
fs.writeFileSync(
  path.join(distDir, 'package.json'),
  JSON.stringify(minimalPkg, null, 2)
);

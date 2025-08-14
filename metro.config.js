const { getDefaultConfig } = require('@expo/metro-config');

const config = getDefaultConfig(__dirname);

// Add support for cjs files
config.resolver.assetExts = [...config.resolver.assetExts, 'cjs'];

// Ensure proper module resolution
config.resolver.sourceExts = [
  'expo.js',
  'expo.ts',
  'expo.tsx',
  'expo.jsx',
  'js',
  'ts',
  'tsx',
  'jsx',
  'json',
  'wasm',
  'd.ts',
  'mjs',
  'cjs'
];

module.exports = config;

const { getDefaultConfig } = require('@expo/metro-config');

const config = getDefaultConfig(__dirname);

config.resolver.assetExts = [...config.resolver.assetExts, 'cjs'];

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

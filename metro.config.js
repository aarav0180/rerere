const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Add bin files to asset extensions so they can be loaded with Asset API
config.resolver.assetExts.push('bin', 'tflite', 'txt');

// Ensure source extensions include all necessary file types
config.resolver.sourceExts = ['jsx', 'js', 'ts', 'tsx', 'json', 'cjs', 'mjs'];

// Add transformer options for assets
config.transformer = {
  ...config.transformer,
  assetPlugins: ['expo-asset/tools/hashAssetFiles'],
};

module.exports = config;

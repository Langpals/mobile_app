module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      // Remove 'expo-router/babel' - it's deprecated in SDK 50
      // The functionality is now included in babel-preset-expo
    ],
  };
};
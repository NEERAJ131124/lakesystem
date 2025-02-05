const path = require('path');

module.exports = function override(config, env) {
  // Find the rule that handles CSS files
  const cssRule = config.module.rules.find(rule => rule.test && rule.test.toString().includes('.css'));

  if (cssRule) {
    // Modify the existing CSS rule
    cssRule.use = [
      require.resolve('style-loader'),
      {
        loader: require.resolve('css-loader'),
        options: {
          importLoaders: 1,
        },
      },
      {
        loader: require.resolve('postcss-loader'),
        options: {
          postcssOptions: {
            config: path.resolve(__dirname, 'postcss.config.js'),
          },
        },
      },
    ];

    // Remove the 'exclude' property if it exists
    delete cssRule.exclude;
  }

  return config;
}


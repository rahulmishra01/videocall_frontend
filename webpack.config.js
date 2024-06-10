// webpack.config.js
module.exports = {
    // ... other configurations
    devtool: 'source-map',
    module: {
      rules: [
        // ... other rules
        {
          test: /\.js$/,
          enforce: 'pre',
          use: ['source-map-loader'],
          exclude: [
            /node_modules\/@react-aria\/utils/, // Ignore source map warnings for this module
          ],
        },
      ],
    },
  };
  
module.exports = {
  devtool: "source-map",
  module: {
    rules: [
      {
        test: /\.js$/,
        enforce: "pre",
        use: ["source-map-loader"],
        exclude: [/node_modules\/@react-aria\/utils/],
      },
    ],
  },
};

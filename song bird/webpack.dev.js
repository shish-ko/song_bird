const common=require('./webpack.config');
const {merge}=require('webpack-merge');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const path=require("path");
const CopyWebpackPlugin=require("copy-webpack-plugin")


module.exports = merge(common, {
  mode: "development",
  watch: true,
  devtool: "source-map",
  module: {
    rules: [
      {
        test: /\.scss$/i,
        use: [
          // Creates `style` nodes from JS strings
          "style-loader",
          // Translates CSS into CommonJS
          "css-loader",
          // Compiles Sass to CSS
          "sass-loader",
        ],
      },
    ],
  },
  plugins: [new MiniCssExtractPlugin()]
});
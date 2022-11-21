const common=require('./webpack.config');
const {merge}=require('webpack-merge');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const path=require("path");


module.exports = merge(common, {
  mode: "production",
  module: {
    rules: [
      {
        test: /\.scss$/i,
        use: [          
          MiniCssExtractPlugin.loader,
          "css-loader",
          "sass-loader",
        ],
      },
    ],
  },
  plugins: [new MiniCssExtractPlugin()]
});
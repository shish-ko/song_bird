const common=require('./webpack.config');
const {merge}=require('webpack-merge');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const path=require("path");
const CopyWebpackPlugin=require("copy-webpack-plugin")


module.exports = merge(common, {
  mode: "production",
  watch: true,
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
  plugins: [new MiniCssExtractPlugin(),
    // new CopyWebpackPlugin({
    //   patterns: [
    //     {
    //       from: path.join(__dirname, 'src', 'assets', 'template'),
    //       to: './assets',
    //     },
    //     {
    //       from: path.join(__dirname, 'src', 'assets', 'sound'),
    //       to: './assets',
    //     },
    //   ],
    // })
  ]
});
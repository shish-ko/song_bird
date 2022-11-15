const path = require('path');
const merge = require("webpack-merge");
const HTMLWebpackPlugin = require("html-webpack-plugin")

module.exports = {
  entry: {
    // main: './src/index.js',
    quiz: "./src/quiz/quiz.js"
  },
  output: {
    path: path.resolve(__dirname, 'dist/quiz'),
    filename: '[name].js',
    // assetModuleFilename: '../assets/[name][ext]'
  },
  module: {
    rules: [
      {
        test: /\.(png|svg|jpg|jpeg)$/,
        type: 'asset/resource'
      },
      {
        test: /\.mp4$/,
        type: 'asset/resource',
        generator: {
          filename: "assets/video/[name][ext]"
        }
      },
    ]
  },
  plugins: [
  //   new HTMLWebpackPlugin({
  //   filename: "index.html",
  //   template: './src/index.html',
  //   favicon: './dist/assets/favicon.png'
  // }),
  new HTMLWebpackPlugin({
    filename: "./quiz.html",
    template: './src/quiz/quiz.html',
    favicon: './dist/assets/favicon.png'
  }) 
]
};
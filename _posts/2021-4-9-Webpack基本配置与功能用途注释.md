---
layout: post
title: Webpack基本配置与功能用途注释
date: 2021-4-9
categories: blog
tags: [Webpack]
author: Mars
pIdentifier: 中文缩进
---

> Webpack基本功能配置

# 生产环境基本配置
## loader

### CSS、SCSS资源

- MiniCssExtractPlugin.loader: 将css文件单独输出，然后html-webpack-plugin自动引入到输出html。
- css-loader: 载入CSS代码；
- postcss-loader： 对CSS进行兼容性处理，根据package.json里的browserlist约定，自动添加CSS前缀；
- sass-loader：载入识别SASS、SCSS代码；

### 图片资源

Webpack 4之前：

url-loader （依赖file-loader）: 识别除了html文档里直接引用的url资源，按设定的限制大小，自动选择打包成base64形式还是独立文件形式。

> Webpack5 已经不建议使用。
>
> 应该使用新特性：asset modules

### html内媒体资源

html-loader： 

### 其他资源(如字体)

file-loader

## 插件



```js
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin');
const ESLintWebpackPlugin = require('eslint-webpack-plugin');

module.exports = {
  mode: 'production',
  entry: './index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, './dist/'),
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
        ],
      },
      {
        test: /\.s[ca]ss$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'sass-loader',
        ],
      },
      {
        test: /\.(png|jpe?g|gif)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 1024 * 8,
            },
          },
        ],
      },
      // 为HTML文档中的媒体资源：比如img、video、audio等引用的资源进行加载并打包。
      {
        test: /\.html$/,
        use: {
          loader: 'html-loader',
          options: {
            esModule: false,
          },
        },
      },

      // 为js代码执行兼容性处理，使用babel-loader @babel/core @babel/preset-env core-js
      // 它们根据package.json中的browserlist约定，对代码进行兼容性处理。
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: [
                ['@babel/preset-env', {
                  targets: {
                    ie: 10,
                    chrome: 56,
                  },
                  // 设定从corejs中按需加载polyfill，而不是一次性加载全部。
                  useBuiltIns: 'usage',
                  // 指定core-js版本
                  corejs: {
                    version: 3,
                  },
                }],
              ],
            },
          },
        ],
      },
    ],
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, './index.html'),
      filename: 'index.html',
    }),
    new MiniCssExtractPlugin({
      filename: 'bundle.css',
    }),
    new OptimizeCssAssetsWebpackPlugin(),
    new ESLintWebpackPlugin({
      fix: true,
    }),
  ],
   
  // webpack-dev-server 配置，打包后根文件目录和端口号。
  devServer: {
    contentBase: path.resolve(__dirname, './dist'),
    port: 3000,
    // 完成后打开页面
    open: true,
    // 开启压缩
    compress: true, 
    // 开启HMR功能
    hot: true,
  },
};
```

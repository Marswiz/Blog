---
layout: post
title: Webpack基本配置与功能用途注释
date: 2021-4-9
categories: blog
tags: [Webpack]
author: Mars
pIdentifier: 中文缩进
---

> Webpack基本功能配置: 虽然只有搞新项目一年半载才会用到一回，还是保存一份参考一下。

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
  devServer: {
    contentBase: path.resolve(__dirname, './dist'),
    port: 3000,
  },
};

```

---
layout: post
title: Webpack和Webpack-dev-server配置中publicPath、path、contentBase等的区别理解
date: 2021-4-11
categories: blog
tags: [Webpack]
author: Mars
pIdentifier: 中文缩进
---

> 容易混还记不住。

# output中的 path

打包后文件的输出目录，规定**必须是绝对路径。**

常用node.js的path模块解析成绝对路径传入。

```js
output: {
    path: path.resolve(__dirname, './dist/');
}

// 输出文件全部在本项目根目录的/dist文件夹内。
```

# output中的 publicPath

这里的publicPath的含义是： 资源请求的公共路径。

output.publicPath的定义对资源请求**非常重要**，它代表了资源请求时相对的基础路径。

> Webpack5 之后，publicPath必须显式定义，没有默认值。

这里的资源请求主要有三个方面：

1. html中标签内通过href、src等路径请求的资源；
2. css中通过url()请求的资源；
3. js中通过URI请求的外部资源；

这些资源在webpack打包后的基础路径，都是这个publicPath路径。比如：

如果设置output.publicPath为'./',则webpack前：
- html文档中<img src='assets/img/cat.png'>：请求的实际路径是`./assets/img/cat.png`;

> 使用webpack-dev-server配合html-webpack-plugin的时候，自动引入的文件会加上publicPath前缀

- CSS中的背景图片：background-image: url('assets/spinner.gif');实际上是./assets/spinner.gif;
- js中,使用import请求的资源和js文件自身有关，不受publicPath影响(仍需使用相对js文件自身的路径)；

# devServer中的 publicPath

这里的publicPath的含义是： devSever服务对外开放的路径。

devServer服务在开启后并不向磁盘中输出生成文件，而是将结果保存在内存中。这里devServer的 publicPath代表的是**通过哪个目录，可以访问devServer服务**，也就是提供生成在内存中的结果文件。

> **注：**
>
> 1. devServe.publicPath 如果未手动设置，默认自动采用output.publicPath；
>
> 2. devServe.publicPath 需要前后都以/结尾。

比如：设置了port为3000，open为true，devServer.publicPath为 '/',则：

服务部署在http://localhost:3000/目录，一打开（自动打开）这个目录就可以看到serve结果。

如果设置devServer的publicPath为'/dist/'，则：

服务开启在http://localhost:3000/dist/目录，自动打开的为http://localhost:3000，需要手动在地址栏输入/dist/进入目录才能看到服务结果。

# devServer中的 contentBase

> 官方说明： 告诉服务器内容的来源。仅在需要提供静态文件时才进行配置，默认情况下，它将使用当前的工作目录(根目录)来提供内容。
>
> 建议使用绝对路径。

设置不受webpack控制（不由 webpack 打包生成的）的静态资源文件的来源地址，默认是项目根目录。     





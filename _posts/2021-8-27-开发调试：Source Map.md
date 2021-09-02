---
layout: post
title: 开发调试：Source Map
date: 2021-9-2
categories: blog
tags: [Webpack]
author: Mars
pIdentifier: 中文缩进
---

> 什么是Source Map？ 怎样设置Source Map？
> 
> [An Introduction to Source Maps](https://blog.teamtreehouse.com/introduction-source-maps)

# 一、Source Map 是什么

当代码被打包完成后，开发调试变得困难，无法查看到一段压缩后的代码在它源文件中的位置。

`source map`是一种将压缩后代码，映射到源代码位置的方式，用于开发调试。 

> Source Map文件以 xxx.js.map命名。

# 二、如何让开发工具识别Source Map文件

1. 在压缩后文件底部，添加注释

> //# sourceMappingURL=/path/to/script.js.map

2. 在响应的Http头部，添加特殊首部行

> X-SourceMap: /path/to/script.js.map

# 三、Source Map文件结构

* version – 遵循的Source Map版本
* file – Source Map文件名
* sources – 各原始文件路径
* sourceRoot – (可选) 根路径
* names – 一个数组，包含了所有源文件中声明的变量和函数名
* mappings – 一个字符串，基于Base64 VLQs，用于实际的代码位置映射（关键信息）

```js
{
    version: 3,
    file: "script.js.map",
    sources: [
        "app.js",
        "content.js",
        "widget.js"
    ],
    sourceRoot: "/",
    names: ["slideUp", "slideDown", "save"],
    mappings: "AAA0B,kBAAhBA,QAAOC,SACjBD,OAAOC,OAAO..."
}
```
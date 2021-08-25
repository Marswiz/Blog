---
layout: post
title: Airbnb JS样式规范里没注意到的点
date: 2021-8-23
categories: blog
tags: [JavaScript]
author: Mars
pIdentifier: 中文缩进
---

> Airbnb JavaScript Style Guide 中文版：
>
> [Airbnb JS 样式指南](https://lin-123.github.io/javascript/)

# 1. 函数

- 不使用`arguments`，使用`...args`收集函数参数；
- 参数带有**默认值**的，放在参数列表**最后**；
- 不使用`Function`构造函数生成函数；
- 参数分为多行时，每行只存在一个参数，并用逗号结尾；
- 箭头函数的参数，永远用小括号包裹；

# 2. 操作符

- 不要使用一元自增自减运算符（++， --），使用`a += 1`；
- 在赋值的时候避免在 `=` 前或后换行。 如果你的赋值语句非常长，那就用小括号把这个值包起来再换行；

# 3. 空格

- 在大括号前空一格；
- 一个缩进 = 两个空格；
- 运算符两侧都用空格隔开；
- 块内部的代码不应该存在空行；
- 代码块之间最多用一行空行隔开；
- 圆括号、方括号内侧不加空格；
- 花括号内侧加空格；
- 逗号后加一个空格；


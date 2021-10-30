---
layout: post
title: 现代JS学习笔记：Class类
date: 2021-3-9
categories: blog
tags: [JavaScript]
author: Mars
pIdentifier: 中文缩进
---
> 学习内容：[《现代JavaScript教程》](https://zh.javascript.info/)

# 8	Class类

## 8.1	Class基本语法

在面向对象的编程中，class 是用于创建对象的可扩展的程序代码模版，它为对象提供了状态（成员变量）的初始值和行为（成员函数或方法）的实现。

```js
class MyClass {
    // class 方法
    constructor() { ... }
    method1() { ... }
    method2() { ... }
    method3() { ... }
    ...
}
```

使用new操作符新建类对象。会自动调用class的constructor方法初始化对象。

> **注意：**
>
>声明类的方法，之间没有逗号！

## 8.2	Class的本质

声明一个Class A，本质上是：

1. 创建了一个名称为A的函数，A的函数体是Class的constructor方法.
2. 其他Class中声明的方法，都在A.prototype上挂载，constructor方法也在A.prototype上，内容是A函数。

## 8.3	Class的特殊性（它不仅仅是语法糖！）

1. 通过 class 创建的函数具有特殊的内部属性标记 [[FunctionKind]]:"classConstructor"；
2. 类转换为字符串，一般都以class开头；
```js
class A {}
A.toString(); // 'class A {}'
```
3. 类中定义的方法默认不可枚举。 类定义将在 "prototype" 中的所有方法的 enumerable 标志设置为 false；
4. **类总是使用 use strict。** 在类构造中的所有代码都将自动进入严格模式。

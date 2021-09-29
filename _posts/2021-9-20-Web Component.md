---
layout: post
title: Web组件： Web Component
date: 2021-9-20
categories: blog
tags: [Web, Web Component]
author: Mars
pIdentifier: 中文缩进
---

> **Web组件相关API：**
> 
> 1. [HTML模板)](#)
> 2. [Shadow DOM](#)
> 3. [自定义组件](#)

# 一、HTML模板

使用`<template>`标签包裹一系列DOM元素，叫做HTML模板。它有以下特性：

- 默认不会被浏览器渲染，内部内容包裹在一个`DocumentFragment`节点内；
- 内部内容不属于活动文档，因此`document.querySelector()`等方法，不会匹配到`<template>`内部元素（`<template>`本身可以被匹配）；
- 匹配`<template>`元素后，访问`.content`属性可以取得内部`DocumentFragment`的引用；
- 在`DocumentFragment`引用上，使用查询方法，可以匹配内部的DOM元素；
- 获取的`DocumentFragment`可以动态挂载到活动DOM元素中。

# 二、Shadow DOM
## 2.1 什么是Shadow DOM

将一个完整的DOM树，作为节点添加到父DOM树。

> 与HTML模板的区别：
> 
> Shadow DOM会实际渲染到页面上，而HTML模板不会。

## 2.2 Shadow DOM的特点

- 完全隔离了子DOM树，内部DOM节点无法从外部选择获取，内部使用的CSS也限制在子DOM树中，不会干扰全局；
- 可以使用插`<slot>`，将宿主元素原本的内容插入到shadow DOM。

## 2.3 Shadow DOM的使用方式

- 使用`attachShadow(<initObj>)`方法创建并添加Shadow DOM到**有效HTML元素（宿主节点）**（只有部分HTML元素能添加Shadow DOM）；
- 传入的initObj，叫做shadowRootInit对象，必须包含一个`mode`属性，取值为"open"或"closed"，表示ShadowDOM是否可以通过`shadowRoot`属性在HTML元素上获得（绝大多数情况都应该设为'open'）；
- `attachShadow()`方法执行后，会立即替换原DOM元素内容。如果shadowDOM中有`<slot>`默认插槽，原DOM元素内容会作为content被添加到插槽中；
- 也可以用具名插槽`<slot name="N1">`，承接宿主元素对应的带有`slot="N1"`的内容；
- `attachShadow()`方法返回shadowDOM的根元素（叫做"影子根"），默认情况下shadowDOM内容为空；

## 2.4 浏览器默认添加的Shadow DOM

浏览器会在`<video>`、`<input>`等元素内部自动添加Shadow DOM，来显示诸如video控制按钮等某些内置元素。

# 三、自定义元素

## 3.1 定义自定义元素
`customElements.define()`方法可以声明创建自定义元素。

`customElements.define()`方法使用方式如下：
```js
customElements.define('x-foo', FooElement, {extends: 'div'});
// (tag, class, extends)
```

## 3.2 自定义元素如何封装组件

自定义元素通过内部挂载Shadow DOM封装组件。

ShadowDOM内容可以用`<template>`模板记载。

> 代码见红宝书P660。


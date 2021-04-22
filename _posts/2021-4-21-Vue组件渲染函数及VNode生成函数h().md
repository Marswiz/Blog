---
layout: post
title: Vue组件渲染函数及VNode生成函数h()
date: 2021-4-21
categories: blog
tags: [Vue]
author: Mars
pIdentifier: 中文缩进
---

> 渲染函数和h()是最本质的组件渲染方式，应该掌握。

# Vue组件进行完成模板解析渲染的几种方式

1. 单文件组件(SFC)中，Vue组件可以使用<template>定义渲染模板；
2. 任何组件都可以通过配置中tempalte property传入模板字符串定义渲染模板；
3. 定义render()方法，作为组件的渲染函数进行纯JS渲染。

# 渲染函数

组件内部可以定义

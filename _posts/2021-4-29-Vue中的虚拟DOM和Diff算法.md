---
layout: post
title: Vue3中的虚拟DOM和Diff算法
date: 2021-4-29
categories: blog
tags: [Vue]
author: Mars
pIdentifier: 中文缩进
---

> 涉及到框架核心问题，必须搞定！
>


# 虚拟DOM是啥？好在哪？

古早时代，程序员都是通过DOM API直接操作DOM，修改页面结构的。比如document.querySelector获取DOM元素，然后修改innerHTML等。

后来因为页面结构体系很大，可能需要一次修改多个数据。而修改数据需要一个一个进行DOM操作，比较浪费性能。

用虚拟DOM可以用JS提前进行新老虚拟DOM树的比较，然后只在真实DOM上一次渲染更新差异的部分，节约了性能。

# 虚拟DOM、diff算法与真实DOM的基本交互原理

![虚拟DOM](/assets/posts/virtual_dom.svg)

# diff算法的源码实现



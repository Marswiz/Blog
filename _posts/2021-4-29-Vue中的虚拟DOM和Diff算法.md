---
layout: post
title: Vue中的虚拟DOM和Diff算法
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

后来因为页面结构体系很大，修改一个数据

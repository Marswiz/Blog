---
layout: post
title: 刷题过程中的错误：总结记录
date: 2021-5-4
categories: blog
tags: [Algorithm]
author: Mars
pIdentifier: 中文缩进
---

> 记录刷题过程中的常犯错误。

# 1. for、while循环

- while循环中，循环终止条件一般应该是一个绝对值，而不是在循环体内修改的变量组成的相对值。

```js
// 下面这个循环是死循环，因为cur+k在不断地增加。
while (cur < cur+k){
    //...codes
    cur++
}
```

- 开闭区间




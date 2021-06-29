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

- if条件尽量不要连写，如果连续写多个if表达式，需要仔细查看里面是否存在耦合关系

```js
// 如果cur.val < A，第一次操作后cur变成cur.left
// 如果刚好cur.left.val > A，那么cur之后又变成了cur.left.right，也就是两个if之间存在了联动耦合关系（一般不希望这样）。
if(cur.val < A) cur = cur.left
if(cur.val > A) cur = cur.right
```

# 2. 细节

- 不要在规定函数外面写变量，有可能在判题器那里不能正确识别；




---
layout: post
title: 现代JS学习笔记：可迭代对象(Iterable Object)
date: 2021-3-16
categories: blog
tags: [JavaScript]
author: Mars
pIdentifier: 中文缩进
---
> 学习内容：[《现代JavaScript教程》](https://zh.javascript.info/)

# 可迭代对象 Iterable Object

## 1	同步可迭代对象
是数组的泛化。这个概念是说任何对象都可以被定制为可在 for..of 循环中使用的对象。

为了让 range 对象可迭代（也就让 for..of 可以运行）我们需要为对象添加一个名为 Symbol.iterator 的方法（一个专门用于使对象可迭代的内置 symbol）。

- 当 for..of 循环启动时，它会调用这个方法（如果没找到，就会报错）。这个方法必须返回一个 迭代器（iterator） —— 一个有 next 方法的对象；
- 从此开始，for..of 仅适用于这个被返回的对象；
- 当 for..of 循环希望取得下一个数值，它就调用这个对象的 next() 方法；
- next() 方法返回的结果的格式必须是 `{done: Boolean, value: any}`，当 done=true 时，表示迭代结束，否则 value 是下一个值。

```js
function Queue(num){
  this.num = num;
  this[Symbol.iterator] = function (){  //★这里开始定义了迭代器函数
    return {
      current: 0,
      total: this.num,
      next(){
        if (this.current < this.total){
          this.current++;
          return {
            done: false,
            value: '人' + this.current
          }
        } else {
          return {
            done: true
          }
        }
      }
    }
  }
}

let a = new Queue(5);
for (let item of a){
  console.log(item);
} //人1人2人3人4人5
```

> **！注意：为什么使用for...of遍历一个数组，无法修改原数组的内容？**
>
> 数组作为可迭代对象，本质上使用的是next()函数返回的新对象里的value属性，所以使用for...of遍历数组获取的是另一个对象的属性,直接修改遍历结果，无法影响到原对象。
>
> 相当于使用可迭代对象方法进行迭代操作是安全的，永远不会修改原对象内容。

## 2	★可迭代（遍历）与类数组对象的区别

**可迭代对象**，指的是部署了Symbol.iterator函数，能用for…of进行遍历的对象。

> 内置可迭代对象：String、Array、Map、Set

**类数组对象**，指的是具有length属性，并且具有数字索引的对象。

> 可迭代对象和类数组对象，都可以用Array.from(iterable)，显式转化为‘真’数组。

## 3	异步可迭代对象

为对象设置`[Symbol.iterator]`方法，可以使用for…of循环对对象进行迭代。前提是迭代过程是同步的，而不是异步的。

如果每次迭代存在异步过程，比如每次迭代都要向服务器请求信息，则需要使用另外的迭代方法。

要使对象异步迭代：

- 使用 Symbol.asyncIterator 取代 Symbol.iterator。
- next() 方法应该返回一个 promise（带有下一个值，并且状态为 fulfilled）。关键字 async 可以实现这一点，我们可以简单地使用 async next()。
- 我们应该使用 for await (let item of iterable) 循环来迭代这样的对象。(注意关键字 await。)

> **注意：**
> 异步的迭代对象，无法使用…spread语法展开。因为默认使用[Symbol.iterator]而不是[Symbol.asyncIterator]，如果不存在会报错。

---
layout: post
title: Object与Array原生方法和Object几种属性遍历方式的区别
date: 2021-5-3
categories: blog
tags: [JavaScript]
author: Mars
pIdentifier: 中文缩进
---

> 总是搞混，这里记录一下。


# Object.prototype 中的方法

- hasOwnProperty(key): 检测字符串属性key，是否是对象自身的内部属性（纯自身内部，不包括从原型继承的属性）；

> key in obj 这种形式，如果key在obj的原型中，也会返回True。

- isPrototypeOf(obj): 检测对象是否在obj的原型链中；
- propertyIsEnumerable(key): 检测key是否是可枚举的； 
- toLocaleString: 本地化字符串；
- toString: 转换字符串；
- valueOf: 返回对象本身；

# Object 函数本身挂载的方法

- Object.assign(target, …objs): 将多个其他对象，合并整合到目标对象target，然后返回整合后的target;
- Object.create(prototype, \[properties\]): 用已知原型对象创建新对象；
- Object.defineProperty(object ,property ,descriptor): 为对象object添加属性，可以配置描述符；
- Object.defineProperties(obj, properties): 给对象添加多个属性并分别指定它们的配置。传入两个参数，第一个为添加属性的目标对象，第二个为以属性名为键，以属性描述符为值的配置对象。
- Object.entries()： 返回给定对象以自身键值组成的数组[key, value]为元素，组成的数组。
- Object.freeze() 冻结对象：其他代码不能删除或更改任何属性。
- Object.getOwnPropertyDescriptor()  返回对象指定的属性配置。
- Object.getOwnPropertyNames()  返回一个数组，它包含了指定对象所有的可枚举或不可枚举的属性名。
- Object.getOwnPropertySymbols()  返回一个数组，它包含了指定对象自身所有的符号属性。
- Object.getPrototypeOf()  返回指定对象的原型对象；
- Object.is(value1, value2)  比较两个值是否相同。(所有 NaN 值都相等，这与==和===不同）；
- Object.isExtensible()  判断对象是否可扩展；
- Object.isFrozen()  判断对象是否已经冻结；
- Object.isSealed()  判断对象是否已经密封；
- Object.keys()  返回一个包含所有给定对象自身可枚举属性名称的数组；
- Object.preventExtensions()  防止对象的任何扩展。（使对象无法再添加新的属性。）
- Object.seal()  防止其他代码删除对象的属性；
- Object.setPrototypeOf()  设置对象的原型（即内部 \[\[Prototype\]\] 属性）；
- Object.values()  返回给定对象自身可枚举值的数组。

# 对象obj的几种属性遍历方式及其区别

## 1. for (let key in obj)

for…in会遍历出对象内所有**非Symbol**的**可枚举enumerable**属性，**包括从原型继承**来的属性。

只有这种方式返回的结果中带有原型的属性。

## 2. Object.keys() / values()

返回所有**非Symbol**的**可枚举**属性。 

## 3. Object.getOwnPropertyNames(obj)

返回所有**非Symbol键名**，**无论是否可枚举enumerable**。

## 4. Object.getOwnPropertySymbols(obj)

返回所有**Symbol类型的键名**，**无论是否可枚举enumerable**。

# Array或Array.prototype中的方法

## 构造Array

- Array.from(): 将类数组对象或可迭代对象，转化为数组；
- Array.of(): 将传入的一组参数转化为数组；

## 数组检测
- Array.isArray(): 检测传入的变量是否为数组类型；

## 迭代器方法

返回的是一个迭代器。

- Array.keys(): 返回数组键名的迭代器；
- Array.values(): 返回数组值的迭代器；
- Array.entries(): 返回数组键值对组成的数组的迭代器。

## 复制与填充

直接修改原Array。

- Array.prototype.copyWithin(): 复制自身的一部分，并插入到自身指定的位置；
- Array.prototype.fill(): 将数组的一部分，用传入的变量重新填充。

## 字符串转换

- Array.prototype.toString(): 调用每个元素的toString方法，然后用逗号串联；
- Array.prototype.toLocaleString(): 调用每个元素的toLocaleString方法，然后用逗号串联；
- Array.prototype.valueOf(): 返回数组本身。

## 栈和队列方法

直接修改原Array。

- Array.prototype.push(): 入栈——将元素推入末尾；
- Array.prototype.pop(): 出栈——将元素弹出末尾；
- Array.prototype.unshift(): 入队列——将元素加入起始位置；
- Array.prototype.shift(): 出队列——将元素从起始位置移除；

## 排序方法

直接修改原Array。

- Array.prototype.sort(): 不传入比较函数，默认将数组按照字符串顺序排序。传入比较函数，按比较结果排序；
- Array.prototype.reverse(): 反转数组。

## 操作数组

- Array.prototype.concat(): (不修改原Array，返回新数组。) 在原数组后，添加其他参数到末尾，然后返回新数组；
- Array.prototype.slice(): (不修改原Array，返回新数组。) 复制原数组的一小段，并返回；
- Array.prototype.splice(): (直接修改原数组) 从原数组中删除部分元素，然后在删除的位置添加部分元素；

## 搜索方法

- Array.prototype.indexOf(): 执行严格相等的比较，返回第一个结果索引；
- Array.prototype.lastIndexOf()： 执行严格相等的比较，返回最后一个结果索引；
- Array.prototype.includes()
- Array.prototype.find()
- Array.prototype.findIndex()

## 迭代方法

为数组每一项运行传入的函数。（参数为item ,index ,array）

修改item参数，不会对原数组造成影响。

通过array\[index\]进行修改，直接对原数组造成影响。

- Array.prototype.every(): 每一项都返回true，则返回true；
- Array.prototype.filter(): 返回返回值为true的项目组成的数组；
- Array.prototype.some(): 如果有一项返回true，则方法整体返回true；
- Array.prototype.map(): 对每一个数组项运行函数，返回结果组成的数组；
- Array.prototype.forEach()：对每一个数组项运行函数，不返回值。

## 归并方法

可接受两个参数： ① (accumulator,item,index,array)=>{...} 归并函数 ② accumulator的初始值。

- Array.prototype.reduce(): 从左到右归并；
- Array.prototype.reduceRight(): 从右到左归并。

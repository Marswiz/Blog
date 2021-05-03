---
layout: post
title: Js Object原生方法和几种属性遍历方式区别
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

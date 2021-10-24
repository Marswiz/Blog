---
layout: post
title: JavaScript设计模式
date: 2021-9-21
categories: blog
tags: [JavaScript,设计模式]
author: Mars
pIdentifier: 中文缩进
---

> 《JS设计模式》 —— 曾探

# 一、基本概念
## 1. 高阶函数

高阶函数满足以下条件：

- 函数可以作为参数被传递；
- 函数可以作为返回值被输出；

高阶函数的部分应用：

1. 面向切面编程 AOP；
   
   [感受面向切面编程](https://juejin.cn/post/6844904051805519886)

2. 柯里化函数；
3. 函数节流、防抖；

# 二、设计模式

## 单例模式

> 一个类只有一个实例，全局都可访问。

## 策略模式
### 定义

> 为了解决一个问题，定义多种不同的解决策略函数，它们可以用统一的执行方式执行。

```js
// 策略对象
const strategies = {
   A: function(){...},
   B: function(){...},
   C: function(){...},
};
// 执行策略
const cal(strategy, ...args) {
   return strategy(...args);
}
```

### 应用场景

### 优缺点

**优点：**

1. 策略方法与执行解耦，便于扩展、修改、理解；
2. 避免了大量的`if...else`语句；
3. 策略可以复用；

## 代理模式

## 发布-订阅模式

## 职责链模式

## 中介者模式

## 装饰器模式

## 适配器模式
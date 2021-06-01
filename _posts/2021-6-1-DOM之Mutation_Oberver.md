---
layout: post
title: DOM之Mutation_Oberver
date: 2021-6-1
categories: blog
tags: [JavaScript]
author: Mars
pIdentifier: 中文缩进
---

> DOM中新增的的Mutation Observer
>

# 1. MutationObeserver是做什么的

MutationObserver 可以监视DOM文档的变化，并在变化时执行相应的回调操作。

# 2. 基本用法

MutationObserver的基本用法如下：

① 创建一个MutationObserver对象，并传入一个回调函数：
```js
const mutationObserverObj = new MutationObserver( (res) => {console.log(res)} )
```

② 调用MutationObserver对象内的observe()方法，依次传入两个参数：监视对象和初始化配置对象MutationObserverInit

> MutationObserverInit的配置方法见红宝书P437。

```js
mutationObserverObj.observe(document.body, {
    // 代表监视body元素的属性变化
    attributes: true
})
```

③ 如上面配置，当document.body的attributes发生变化，则触发MutationObserver构造时传入的回调函数，传入参数为MutationRecord，其中记录着这次变化的信息。

> MutationRecord的全部属性见红宝书P434。

# 3. 断开监视

MutationObserver对象的disconnect方法，可以用于断开MutationObserver的监视。

一旦调用了disconnect()方法，MutationObserver就不再对DOM对象的变化进行响应，**同时已经添加到任务队列里的MutationObserver微任务也会消失（即使还没执行）**


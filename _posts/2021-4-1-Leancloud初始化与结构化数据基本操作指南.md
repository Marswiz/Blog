---
layout: post
title: Leancloud初始化与结构化数据基本操作指南
date: 2021-4-1
categories: blog
tags: [Leancloud]
author: Mars
pIdentifier: 中文缩进
---

> Leancloud，快速开发小程序利器。
>
> 用这么多次了，还每次都忘。。记录一下吧。。

# Leancloud引入

官网查。CDN直接标签引入、npm安装引入都可以。

```js
// leancloud 配置的ES6模块引入（先npm安装）
import * as AV from "leancloud-storage";
```

# 初始化

在leancloud网站上创建了应用后，在设置页面可以查到appID和appKey，传给AV.init函数用来初始化，告诉leancloud与哪个APP通信。

```js
AV.init({
  appId: "1cIxhO0Vf6jLVLLKXPWdwTOK-MdYXbMMI",
  appKey: "Pn8EFfvyMY8TrmMwBBMf24Cr",
});
```
此后，AV就绑定了appID，操作都在这个APP中进行。

# 查询Class中数据

需要创建一个查询对象，用来对查询应用中的某一个class里面的数据。

```js
// 指定查询App中的Recipes类
const query = new AV.Query('Recipes');
```

这样设置后，query以后都在Recipes里面查询并返回数据。这个query对象的使用方式基本如下：

1. 为query对象指定查询条件，可以多次；
2. 执行query.find()方法，返回包含查询后结果对象(child对象)**数组**为结果的Promise对象；
3. 结果中的每一个child元素，都包含get、toJSON等方法，供获取内容使用。

```js
// 按中文名获取菜谱函数
async function getRecipeFromName(name){
  const queryRecipes = new AV.Query('Recipes');
  queryRecipes.equalTo('chName', name);
  let res = await queryRecipes.find();
  return res[0].toJSON();
}
```
---
layout: post
title: RESTful及RESTful API
date: 2021-4-25
categories: blog
tags: [RESTful]
author: Mars
pIdentifier: 中文缩进
---

> 什么是RESTful架构？如何设计使用RESTful API？
>
> 参考: [阮一峰网络日志](http://www.ruanyifeng.com/blog/2014/05/restful_api.html)

# RESTful架构是什么？

RESTful架构，是目前最流行的一种互联网软件架构。（REST：Representational State Transfer 表现状态转化）

通俗理解：

① 资源在HTTP请求URI中定义
URI代表资源，资源是原始的数据，不带有表现形式。

② 表现层在HTTP头部Accept和Content-Type字段指定
在网络中，页面可以用.html表现，图片可以用.png等表现，文字可以用.txt表现，加上这些表现形式，构成了资源的表现层。

③ 表现层状态转化：使用GET/POST/PUT/DELETE等HTTP方法，操作服务器中的资源

# RESTful API 设计

在网络中其实就是指前后端接口的设计（前后端整体遵循RESTful架构）。

## 协议、API域名、API版本号

应该总是使用HTTPs协议。

应该尽量把API放在专属域名下，并带有API的版本号： https://api.somesite.com/v2/

## 路径

通过API请求的是资源，因此API中不应该有动词，而应该是名词。

动词代表一种操作，应该是通过HTTP请求方式或对事件资源进行请求来实现。

## 资源操作

通过HTTP请求方式，对应数据库的增删改查方式，实现对资源的操作。（GET/POST/DELETE/PUT等）

## 信息过滤Filtering

API提供参数，返回过滤后的结果。

> 例如可以使用Axios发送的请求： 
```js
// 请求目标为: http://marswiz.com?name=Cool
axios.get({
   url: 'http://marswiz.com',
   params: {
      name: 'Cool',
   },
 });
```

## 返回状态码与错误处理

HTTP返回状态码用来提示客户端资源的信息。（2xx,3xx,4xx,5xx）

如果返回资源状态码为4xx或5xx，则需要客户端提示返回出错信息。

## 各种操作返回的资源类型

- GET /collection：返回资源对象的列表（数组）
- GET /collection/resource：返回单个资源对象
- POST /collection：返回新生成的资源对象
- PUT /collection/resource：返回完整的资源对象
- PATCH /collection/resource：返回完整的资源对象
- DELETE /collection/resource：返回一个空文档

## Hypermedia API

Hypermedia API就是在访问API根目录的时候，应该返回根目录下所有可用API组成的JSON文件，提供了各种API的URI，让用户无需查文档也能获取到想要的API接口地址。

## 其他

服务器返回的数据格式，应该尽量使用JSON，避免使用XML。

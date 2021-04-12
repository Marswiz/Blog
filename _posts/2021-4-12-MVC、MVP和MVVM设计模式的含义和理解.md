---
layout: post
title: MVC、MVP和MVVM架构的含义和理解.
date: 2021-4-12
categories: blog
tags: [Design_Mode]
author: Mars
pIdentifier: 中文缩进
---

> 前端框架的几种设计模式，理解其含义，了解其优缺点很重要。

MVC、MVP、MVVM都是软件架构，或称为设计模式。

# MVC模式

MVC的含义是： Model-View-Controller （模型-视图-控制器）模式。其中各项含义是：

- Model: 储存的数据；
- View： 用户界面；
- Controller： 业务逻辑、方法；

用户可以直接与View层（用户界面）交互，也可以与Controller层（调用业务逻辑方法）进行交互。

MVC模型，是应用比较广泛的一种架构，M、V、C三层耦合度低，便于后期根据需求修改。

缺点是MVC模型逻辑较为复杂，完成一个操作需要多次调用与交互。

# MVP模式

MVP模式中，P为Presenter（主持人，控制者）。M层与V层均通过这个P层进行联系，二者不直接联系。

MVP模型中因为中间的Presenter部分因为要控制所有的View与Model之间的映射，因而变得很复杂很庞大，不利于后期维护。

# MVVM模式

将MVP模式中间层Presenter改为视图模型ViewModel，就成为了MVVM模型（Model-ViewModel-View）。

MVVM模型中最大的特点是，中间的ViewModel为Model和View两层之间形成了双向绑定。

因此可以通过数据驱动视图更新，也可以通过View修改绑定的Model。

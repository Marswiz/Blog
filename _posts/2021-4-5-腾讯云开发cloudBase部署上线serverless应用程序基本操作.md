---
layout: post
title: 腾讯云开发cloudBase部署上线serverless应用程序基本操作
date: 2021-4-1
categories: blog
tags: [cloudBase,Serverless]
author: Mars
pIdentifier: 中文缩进
---

> 腾讯云开发cloudBase部署上线serverless应用程序基本操作,不用复杂的后端配置流程，轻松上线前端app。

# 基本环境安装

全局安装腾讯云开发命令行工具：cloudbase-cli

```
npm install -g @cloudbase/cli
```

# 初始化

初始化环境：

```
cloudbase init --without-template
```

第一次运行会跳转提示登录，然后如果没有环境需要新建环境，全程都是引导性操作。

# 一键部署

进入项目所在根目录，运行下面的命令一键部署app：

```
cloudbase framework:deploy
```
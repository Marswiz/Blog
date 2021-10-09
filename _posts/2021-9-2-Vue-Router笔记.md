---
layout: post
title: Vue-Router笔记
date: 2021-9-2
categories: blog
tags: [Vue,Vue-Router]
author: Mars
pIdentifier: 中文缩进
---

> Vuex-Router: 路由管理工具

# 一、核

# 路由懒加载

通过动态引入组件`cosnt comp = import(component)`，实现让路由**只有在被访问到的时候，才去加载组件**。

这可以提高页面的加载速度。

只有在第一次访问对应路由时，执行加载对应的组件，加载完成后组件会被缓存，供再次使用。

**全部路由，理论上都应该使用动态引入组件的懒加载模式。**

# 导航守卫（导航过程中的钩子）

所有的导航守卫，都可以接受两个参数`(to, from)`，beforeEach和beforeRouteEnter可以接受第三个参数next。

## 1. 全局守卫

- **router.beforeEach**： 每次导航被触发，在所有钩子最前面调用；
- **router.beforeResolve**：每次导航被触发，在导航被确认之前调用；
- **router.afterEach**：每次导航被触发，在所有钩子最后面调用；

## 2. 路由专属守卫

在路由配置中，可以为某一路由单独配置自己的守卫。

- **beforeEnter**: 在该路由进入前调用；

## 3. 为组件单独配置路由守卫

组件内，可以单独配置专属于这个组件的路由守卫，在组件被路由加载后调用。

- **beforeRouteEnter**: 组件已确定被路由加载，在路由执行之前调用；
- **beforeRouteUpdate**: 当路由发生变动，但是组件被重复使用的时候调用；
- **beforeRouteLeave**: 当渲染该组件的路由，即将跳转到其他路由时调用。

## 4. 路由守卫调用时序

1. Navigation triggered.
2. Call **beforeRouteLeave** guards in deactivated components.
3. Call global **beforeEach** guards.
4. Call **beforeRouteUpdate** guards in reused components.
5. Call **beforeEnter** in route configs.
6. Resolve async route components.
7. Call **beforeRouteEnter** in activated components.
8. Call global **beforeResolve** guards.
9. Navigation is confirmed.
10. Call global **afterEach** hooks.
11. DOM updates triggered.
12. Call callbacks passed to **next in beforeRouteEnter** guards with instantiated instances.

# 路由元数据 meta

配置路由的时候，可以传入一个`meta`属性，为路由添加一些额外的数据。

因此，可以在导航守卫执行的时候，访问to路由或from路由的元数据，来针对性执行对应的逻辑。

# 导航 & 异步获取数据

**导航完成后获取数据**和**导航完成前获取数据**都是可以的。

> **导航完成之后获取**：先完成导航，然后在接下来的组件生命周期钩子中获取数据。在数据获取期间显示“加载中”之类的指示。
>  
> **导航完成之前获取**：导航完成前，在`beforeRouteEnter`钩子中获取数据，在数据获取成功后执行导航。

# 组合式API

组合式 API中使用Vue-Router，需要从`vue-router`引入方法：

- **useRouter**： 返回`this.$router`;
- **useRoute**： 返回`this.$route`；
- 
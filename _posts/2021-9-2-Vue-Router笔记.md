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

# 1. 路由链接、路由出口

这是两个vue-router内置组件：

- `<router-link>`: 用来存放路由链接的内置组件，点击即可进行路由跳转；
- `<router-view>`: 用来显示路由匹配结果的内置组件，路由匹配到的组件会显示在这里。

# JS: 配置一个vue-router基本流程

```js
// 官方代码示例：

// 1. 引入路由需要的vue组件.
// 也可以从其他文件导入
const Home = { template: '<div>Home</div>' }
const About = { template: '<div>About</div>' }

// 【路由配置】
// 2. 定义一些路由
// 每个路由都需要映射到一个组件。
// 我们后面再讨论嵌套路由。
const routes = [
  { path: '/', component: Home },
  { path: '/about', component: About },
]

// 【路由器配置】
// 3. 创建路由实例并传递 `routes` 配置
// 你可以在这里输入更多的配置，但我们在这里
// 暂时保持简单
const router = VueRouter.createRouter({
  // 4. 内部提供了 history 模式的实现。为了简单起见，我们在这里使用 hash 模式。
  history: VueRouter.createWebHashHistory(),
  routes, // `routes: routes` 的缩写
})

// 5. 创建并挂载到vue根实例
const app = Vue.createApp({})
//确保 _use_ 路由实例使
//整个应用支持路由。
app.use(router)

app.mount('#app')

// OK，路由已经应用。
```

# 动态路由匹配

路由配置中：

- path可以定义部分动态字段，通过`:dymPara`形式定义；
- 当匹配到路由后，在路由的params属性中可以获取到匹配到的`dymPara`实际字段。

# 嵌套路由

一个路由的组件中，如果还有`<router-view>`出口，希望通过这个路由的子路由进行匹配显示不同的组件，则需要使用嵌套路由实现。

一个路由的子路由，通过该路由配置的`children`选项配置。子路由匹配的组件内容，会通过上层路由组件中的`<router-view>`输出。

```js
{
    path: '/user/',
    component: UserInfo,
    children: [{
        // 当匹配'/user/Mars'时，UserInfo中的<router-view>显示MarsInfo组件。
        path: 'Mars',
        component: MarsInfo,
    },{
        // 当匹配'/user/Liu'时，UserInfo中的<router-view>显示LiuInfo组件。
        path: 'Liu',
        component: LiuInfo,
    }],
}
```

# 命名视图

同一个路由，匹配的组件内可以定义**多个`<router-view>`出口**，通过`name`属性命名。

路由通过配置项中的`components`选项，对每个`<router-view>`出口显示哪一组件进行定义。

# 将路由的匹配参数route.params设置为组件的props

配置路由的`props`选项为true，即可将路由匹配的参数route.params直接设置为组件的`props`，而不是在组件内通过`this.$route.params`获取参数。

这样可以解耦组件和路由，组件可以被应用到其他地方，而非与路由参数强绑定（必须要this.$route.params和组件内的使用方式一致才能正确显示组件）。

[将 props 传递给路由组件](https://next.router.vuejs.org/zh/guide/essentials/passing-props.html)

# 为路由命名

在路由配置中配置`name`属性，可以为该路由命名。

被命名的路由，在其他地方使用的时候，可以不用再通过url触发，通过传入配置对象，减少url硬编码的麻烦：

```js
const routes = [
  {
    path: '/user/:username',
    name: 'user',
    component: User
  }
]

// 使用
<router-link :to="{ name: 'user', params: { username: 'erina' }}">
  User
</router-link>

// 或
router.push({ name: 'user', params: { username: 'erina' } })
```

# 重定向

路由重定向在路由配置中的`redirect`选项配置。

配置了重定向的路由在触发时，会直接跳转到重定向的路由，也不会触发当前路由的导航守卫`beforeEnter`。

有两种方式设置重定向路由：

1. **静态：**直接传入一个路由配置对象；
2. **动态：**传入一个函数`cur => {...target route}`，接收当前路由cur为参数，可以根据当前路由的参数，动态重定向到对应的路由。

```js
// 动态重定向路由配置：
  {
    // /search/text 被动态重定向到 --> /search?q=text
    path: '/search/:searchText',
    redirect: cur => {
      // 方法接收当前路由作为参数****
      // return 重定向的路由
      return { path: '/search', query: { q: cur.params.searchText } }
    },
  },
```

# 别名 alias

为当前路由设置别名，与当前路由具有相同的效果。

可以是一个单独的路径字符串，也可以是一个由它们组成的数组（代表多个别名）。

别名会如实显示在url中。

**别名与重定向的区别：** 

  别名没有重定向过程，与原路由是一样的效果，相当于配置了与原路由一模一样的多个路由；
- 重定向是在进入原路由后，又执行了跳转到另一个路由。

# 历史记录模式

在router配置中的`history`选项设置。

```js
const router = createRouter({
    // hash mode.
  history: createWebHashHistory(),
})
```

## 1. hash模式（默认）

在router配置项中的history选项，传入`createWebHashHistory()`。

**hash模式的特点：**

1. url中存在一个`/#/`，#之后的部分都是**hash部分，不会被传送到服务器**（hash路由完全发生在前端）；
2. 页面url的hash部分发生变化，不会引起页面的刷新；
3. hash部分发生变化，会新增一条记录到history，因此可以进行前进、后退操作；
4. 服务器无法获得用户的实际url，用户请求的始终是#之前的url部分，因此在路由跳转、刷新后服务器无需进行任何配置，因为请求的都是同一个url；
5. 每次点击触发路由，hash部分改变，但是并**不会发送新的http请求，仅仅是在前端js层面执行了代码**(进行了组件替换)，搜索引擎爬虫可能无法获取到替换后页面的内容；

## 2. history模式

在router配置项中的history选项，传入`createWebHistory()`。

**history模式的特点：**

1. url中没有'#'，更为美观；
2. **全部url都会被传给服务器**，进行对应的资源请求。因此服务器必须把**所有可能用到的url都重定向到SPA根页面的html**，否则一旦用户刷新页面，可能报错404；
3. 通过history的`pushState()`和`replaceState()`方法实现修改路由（修改history记录，不会造成刷新），通过监听`popState`事件进行路由跳转操作；

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

# 路由后的滚动行为

router配置的`scrollBehavior`选项，可以配置路由跳转后的默认滚动行为（位置，滚动是否顺滑等）。

[滚动行为](https://next.router.vuejs.org/zh/guide/advanced/scroll-behavior.html)

```js
const router = createRouter({
  scrollBehavior(to, from, savedPosition) {
    // 始终滚动到顶部
    return { top: 0 }
  },
})
```

# 
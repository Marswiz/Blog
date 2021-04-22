---
layout: post
title: Vue3源码学习：从createApp开始发生了什么
date: 2021-4-21
categories: blog
tags: [Vue]
author: Mars
pIdentifier: 中文缩进
---

> Vue3源码学习： runtime-core
>
> 从createApp开始，探索应用实例的创建过程。
>
> 源码目录：packages/runtime-core/src/apiCreateApp.ts

# Vue应用实例相关的TS类型声明

## App应用实例

app应用实例所暴露的内部属性，都在这里定义了。

```typescript
export interface App<HostElement = any> {
  // 版本号
  version: string

  // app配置对象
  config: AppConfig

  // use()方法
  use(plugin: Plugin, ...options: any[]): this

  // 使用mixin
  mixin(mixin: ComponentOptions): this

  // 全局注册组件方法：可以只传入一个字符串name 或 先后传入字符串name和组件component本身。
  // 两个都传入的时候，返回app本身
  // 只传入一个字符串name，返回已注册的component。
  component(name: string): Component | undefined
  component(name: string, component: Component): this

  // 全局注册自定义指令方法，同上。
  directive(name: string): Directive | undefined
  directive(name: string, directive: Directive): this

  // 挂载方法mount
  // 三个参数：①rootContainer: 根容器，类型是【宿主环境的元素】或【字符串】。（浏览器中对应【DOM元素】和【query字符串选择符】）
  // ② isHydrate：设置是否是hydrate操作。（hydrate【注水】：含义是将服务器渲染出的字符串数据，在前端浏览器中进行再次渲染，将字符串数据整合成页面，类似将干巴巴的原始数据注水盘活成网页。）
  // ③ isSVG：设置挂载目标是否是SVG元素，用在render()函数中。
  mount(
    rootContainer: HostElement | string,
    isHydrate?: boolean,
    isSVG?: boolean
  ): ComponentPublicInstance
  unmount(): void
  provide<T>(key: InjectionKey<T> | string, value: T): this

  // internal, but we need to expose these for the server-renderer and devtools
  _uid: number
  _component: ConcreteComponent
  _props: Data | null
  _container: HostElement | null
  _context: AppContext
}
```
## 应用实例配置对象：AppConfig

app的应用配置，使用应用实例对象的app.config获取。

```typescript
export interface AppConfig {
  // @private
  readonly isNativeTag?: (tag: string) => boolean

// app配置对象
// 官方解释：设置为 true 以在浏览器开发工具的 performance/timeline 面板中启用对组件初始化、编译、渲染和更新的性能追踪。只适用于开发模式和支持 performance.mark API 的浏览器。
  performance: boolean
  // 自定义选项合并策略：父实例和子实例上同名选项的合并方式。用得少，具体看文档。
  optionMergeStrategies: Record<string, OptionMergeFunction>
  // 组件的全局属性。
  globalProperties: Record<string, any>
  // 官方解释：指定一个方法，用来识别在 Vue 之外定义的自定义元素。
  isCustomElement: (tag: string) => boolean
  // 指定一个处理函数，来处理组件渲染方法执行期间以及侦听器抛出的未捕获错误。这个处理函数被调用时，可获取错误信息和应用实例。
  errorHandler?: (
    err: unknown,
    instance: ComponentPublicInstance | null,
    info: string
  ) => void
  // 为 Vue 的运行时警告指定一个自定义处理函数。只在开发环境下生效，在生产环境下它会被忽略。
  warnHandler?: (
    msg: string,
    instance: ComponentPublicInstance | null,
    trace: string
  ) => void
}
```

## 应用环境：AppContext

应用环境类型，定义了应用实例内部配置、mixin、组件、自定义指令和provide信息。

```typescript
export interface AppContext {
  app: App // for devtools
  config: AppConfig
  mixins: ComponentOptions[]
  components: Record<string, Component>
  directives: Record<string, Directive>
  provides: Record<string | symbol, any>
  /**
   * Flag for de-optimizing props normalization
   * @internal
   */
  deopt?: boolean
  /**
   * HMR only
   * @internal
   */
  reload?: () => void
}
```

# 应用实例app的：createApp方法源码

```typescript
export function createAppAPI<HostElement>(
  render: RootRenderFunction,
  hydrate?: RootHydrateFunction
): CreateAppFunction<HostElement> {
  return function createApp(rootComponent, rootProps = null) {
    if (rootProps != null && !isObject(rootProps)) {
      __DEV__ && warn(`root props passed to app.mount() must be an object.`)
      rootProps = null
    }

    const context = createAppContext()
    const installedPlugins = new Set()

    let isMounted = false

    // 这里创建了app实例对象：
    const app: App = (context.app = {

    // 内部属性定义
      _uid: uid++,
      _component: rootComponent as ConcreteComponent,
      _props: rootProps,
      _container: null,
      _context: context,

      version,

      // 实例对象的config配置属性，是一对getter/setter，不允许通过app实例对象修改内部配置app.config。
      get config() {
        return context.config
      },

      set config(v) {
        if (__DEV__) {
          warn(
            `app.config cannot be replaced. Modify individual options instead.`
          )
        }
      },

      use(plugin: Plugin, ...options: any[]) {
        if (installedPlugins.has(plugin)) {
          __DEV__ && warn(`Plugin has already been applied to target app.`)
        } else if (plugin && isFunction(plugin.install)) {
          installedPlugins.add(plugin)
          plugin.install(app, ...options)
        } else if (isFunction(plugin)) {
          installedPlugins.add(plugin)
          plugin(app, ...options)
        } else if (__DEV__) {
          warn(
            `A plugin must either be a function or an object with an "install" ` +
              `function.`
          )
        }
        return app
      },

      mixin(mixin: ComponentOptions) {
        if (__FEATURE_OPTIONS_API__) {
          if (!context.mixins.includes(mixin)) {
            context.mixins.push(mixin)
            // global mixin with props/emits de-optimizes props/emits
            // normalization caching.
            if (mixin.props || mixin.emits) {
              context.deopt = true
            }
          } else if (__DEV__) {
            warn(
              'Mixin has already been applied to target app' +
                (mixin.name ? `: ${mixin.name}` : '')
            )
          }
        } else if (__DEV__) {
          warn('Mixins are only available in builds supporting Options API')
        }
        return app
      },

      component(name: string, component?: Component): any {
        if (__DEV__) {
          validateComponentName(name, context.config)
        }
        if (!component) {
          return context.components[name]
        }
        if (__DEV__ && context.components[name]) {
          warn(`Component "${name}" has already been registered in target app.`)
        }
        context.components[name] = component
        return app
      },

      directive(name: string, directive?: Directive) {
        if (__DEV__) {
          validateDirectiveName(name)
        }

        if (!directive) {
          return context.directives[name] as any
        }
        if (__DEV__ && context.directives[name]) {
          warn(`Directive "${name}" has already been registered in target app.`)
        }
        context.directives[name] = directive
        return app
      },

      mount(
        rootContainer: HostElement,
        isHydrate?: boolean,
        isSVG?: boolean
      ): any {
        if (!isMounted) {
          const vnode = createVNode(
            rootComponent as ConcreteComponent,
            rootProps
          )
          // store app context on the root VNode.
          // this will be set on the root instance on initial mount.
          vnode.appContext = context

          // HMR root reload
          if (__DEV__) {
            context.reload = () => {
              render(cloneVNode(vnode), rootContainer, isSVG)
            }
          }

          if (isHydrate && hydrate) {
            hydrate(vnode as VNode<Node, Element>, rootContainer as any)
          } else {
            render(vnode, rootContainer, isSVG)
          }
          isMounted = true
          app._container = rootContainer
          // for devtools and telemetry
          ;(rootContainer as any).__vue_app__ = app

          if (__DEV__ || __FEATURE_PROD_DEVTOOLS__) {
            devtoolsInitApp(app, version)
          }

          return vnode.component!.proxy
        } else if (__DEV__) {
          warn(
            `App has already been mounted.\n` +
              `If you want to remount the same app, move your app creation logic ` +
              `into a factory function and create fresh app instances for each ` +
              `mount - e.g. \`const createMyApp = () => createApp(App)\``
          )
        }
      },

      unmount() {
        if (isMounted) {
          render(null, app._container)
          if (__DEV__ || __FEATURE_PROD_DEVTOOLS__) {
            devtoolsUnmountApp(app)
          }
          delete app._container.__vue_app__
        } else if (__DEV__) {
          warn(`Cannot unmount an app that is not mounted.`)
        }
      },

      provide(key, value) {
        if (__DEV__ && (key as string | symbol) in context.provides) {
          warn(
            `App already provides property with key "${String(key)}". ` +
              `It will be overwritten with the new value.`
          )
        }
        // TypeScript doesn't allow symbols as index type
        // https://github.com/Microsoft/TypeScript/issues/24587
        context.provides[key as string] = value

        return app
      }
    })

    return app
  }
}
```

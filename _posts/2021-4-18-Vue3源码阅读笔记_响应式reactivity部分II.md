---
layout: post
title: Vue3源码阅读笔记——响应式reactivity部分II:reactive,ref等
date: 2021-4-19
categories: blog
tags: [Vue]
author: Mars
pIdentifier: 中文缩进
---

> 尝试探索Vue3源码： 响应式reactivity部分: reactive,ref等。
>
> 原项目目录： /packages/reactivity

# 1. reactive()函数

```typescript
/*
 * Creates a reactive copy of the original object.
 *
 * The reactive conversion is "deep"—it affects all nested properties. In the
 * ES2015 Proxy based implementation, the returned proxy is **not** equal to the
 * original object. It is recommended to work exclusively with the reactive
 * proxy and avoid relying on the original object.
 *
 * A reactive object also automatically unwraps refs contained in it, so you
 * don't need to use `.value` when accessing and mutating their value:
 *
 * ```js
 * const count = ref(0)
 * const obj = reactive({
 *   count
 * })
 *
 * obj.count++
 * obj.count // -> 1
 * count.value // -> 1
 * 
 */

// 对不同的响应式对象，分别在内部声明了不同的weakMap用来储存。
export const reactiveMap = new WeakMap<Target, any>()
export const shallowReactiveMap = new WeakMap<Target, any>()
export const readonlyMap = new WeakMap<Target, any>()
export const shallowReadonlyMap = new WeakMap<Target, any>()


export function reactive<T extends object>(target: T): UnwrapNestedRefs<T>
export function reactive(target: object) {
  // if trying to observe a readonly proxy, return the readonly version.
  if (target && (target as Target)[ReactiveFlags.IS_READONLY]) {
    return target
  }

// 这里返回了创建的响应式对象。
  return createReactiveObject(
    target,
    false,
    mutableHandlers,
    mutableCollectionHandlers,
    reactiveMap
  )
}

// 这里传入的target是Target类型：
// 它的定义：也可以是原始object，但可选具有以下四个内部属性：__v_skip，__v_isReactive，__v_isReadonly，__v_raw。
export const enum ReactiveFlags {
  SKIP = '__v_skip',
  IS_REACTIVE = '__v_isReactive',
  IS_READONLY = '__v_isReadonly',
  RAW = '__v_raw'
}
export interface Target {
  [ReactiveFlags.SKIP]?: boolean
  [ReactiveFlags.IS_REACTIVE]?: boolean
  [ReactiveFlags.IS_READONLY]?: boolean
  [ReactiveFlags.RAW]?: any
}

function createReactiveObject(
  target: Target,
  isReadonly: boolean,
  baseHandlers: ProxyHandler<any>,
  collectionHandlers: ProxyHandler<any>,
  proxyMap: WeakMap<Target, any>
) {
// 非对象的原始值不能用reactive()转化
  if (!isObject(target)) {
    if (__DEV__) {
      console.warn(`value cannot be made reactive: ${String(target)}`)
    }
    return target
  }
  // target is already a Proxy, return it.
  // exception: calling readonly() on a reactive object
  if (
    target[ReactiveFlags.RAW] &&
    !(isReadonly && target[ReactiveFlags.IS_REACTIVE])
  ) {
    return target
  }

  // 已经注册过的target proxy，直接获取并返回。
  const existingProxy = proxyMap.get(target)
  if (existingProxy) {
    return existingProxy
  }

  // 根据不同的target类型，创建设置不同的proxy handler，返回对应proxy。
  // 
  // target类型有三种：COMMON/COLLECTION/INVALID
  // COMMON: object和array
  // COLLECTION: map,set,weakmap,weakset
  // 其他都是INVALID.
  const targetType = getTargetType(target)
  if (targetType === TargetType.INVALID) {
    return target
  }
  const proxy = new Proxy(
    target,
    targetType === TargetType.COLLECTION ? collectionHandlers : baseHandlers
  )
  proxyMap.set(target, proxy)
  return proxy
}
```

# 2. ref()函数

```typescript
// ref的几个重载：
export function ref<T extends object>(value: T): ToRef<T>
export function ref<T>(value: T): Ref<UnwrapRef<T>>
export function ref<T = any>(): Ref<T | undefined>
export function ref(value?: unknown) {
  return createRef(value)
}

// createRef()： 可以看到这里是返回了一个RefImpl类的实例。
function createRef(rawValue: unknown, shallow = false) {
  if (isRef(rawValue)) {
    return rawValue
  }
  return new RefImpl(rawValue, shallow)
}

// RefImpl Class类
class RefImpl<T> {
  private _value: T

  public readonly __v_isRef = true

  constructor(private _rawValue: T, public readonly _shallow = false) {
// 根据是否shallow（浅响应式），来确定内部_value的值：浅的话就直接传入原始值，非浅就把原始值深度转化为响应式再传入。
    this._value = _shallow ? _rawValue : convert(_rawValue)
  }

// 这里是ref响应式的核心内容：
// ① 在get这个ref.value的时候，对这个响应式对象的原始对象value属性进行GET形式的Track；
// ② 在set这个ref.value的时候，对新的值newVal和旧的值value进行比较，如果有改动，就将内部的_rawValue修改为newVal，然后将_value修改为响应式的newVal，然后用newVal对原始对象的value属性进行SET trigger。
// 
// ★★★
// toRaw的函数定义：这里使用了逻辑表达式进行递归，很难理解。
// 结果就是通过传入对象observed,层层递归找到最内层的[ReactiveFlags.RAW]值返回。如果对象observed本身就不带有[ReactiveFlags.RAW]值，说明本身就是原始对象，就返回对象本身。
// export function toRaw<T>(observed: T): T {
//     return (
//         (observed && toRaw((observed as Target)[ReactiveFlags.RAW])) || observed
// )
// }
  get value() {
    track(toRaw(this), TrackOpTypes.GET, 'value')
    return this._value
  }

  set value(newVal) {
    if (hasChanged(toRaw(newVal), this._rawValue)) {
      this._rawValue = newVal
      this._value = this._shallow ? newVal : convert(newVal)
      trigger(toRaw(this), TriggerOpTypes.SET, 'value', newVal)
    }
  }
}
```

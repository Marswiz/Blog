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


// 常规reactive()函数定义如下，返回的是非shallow非readonly的响应式对象。
// 类似地，还有shallowReactive()、readonly()、shallowReadonly()，用来创建不同类型的响应式对象。
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
    // 传入对应的handler，对于普通reactive对象就是mutableHandler，这些handler决定了对target执行各种操作时发生的行为。
    mutableHandlers,
    mutableCollectionHandlers,
    reactiveMap
  )
}

// 这里传入的target是Target类型：
// 它的定义：也可以是原始object，但可选具有以下四个内部属性：__v_skip，__v_isReactive，__v_isReadonly，__v_raw。
export const enum ReactiveFlags {
  // SKIP为ture,代表这个对象永远不会成为reactive对象
  SKIP = '__v_skip',

  // IS_REACTIVE为true，代表为reactive对象
  IS_REACTIVE = '__v_isReactive',

  // IS_READONLY为true，代表这是只读reactive对象
  IS_READONLY = '__v_isReadonly',

  // RAW中记录了reactive proxy对象代理的原始值
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
  // 如果target本身就是一个reactive proxy，则直接返回。
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
  // 这些handler内部，定义了对target各种操作的拦截器，在各个调用时机执行trace或trigger方法，用来实现target的响应式。
  // target就是传入用来创建响应式的原始变量。
  //
  // Vue定义的target类型有三种：COMMON/COLLECTION/INVALID
  // COMMON: object和array
  // COLLECTION: map,set,weakmap,weakset
  // 其他都是INVALID：直接返回原target。
  // 
  const targetType = getTargetType(target)
  if (targetType === TargetType.INVALID) {
    return target
  }
  
  // 这里使用了不同的handler，创建proxy，然后返回。
  const proxy = new Proxy(
    target,
    targetType === TargetType.COLLECTION ? collectionHandlers : baseHandlers
  )
  // 在对应的map记录新生成的proxy。 然后返回proxy
  proxyMap.set(target, proxy)
  return proxy
}
```
# 2. 用于创建响应式对象proxy的拦截器：baseHandlers和collectionHandlers

```typescript
// 普通reactive()函数的proxy handler
// 只捕获五种操作：Get，set，deleteProperty,has和ownkeys
export const mutableHandlers: ProxyHandler<object> = {
   get,
   set,
   deleteProperty,
   has,
   ownKeys
}

// 下面拿一个最常见的get捕获器，进行说明。

// 普通reactive()函数proxy get拦截器的定义。
const get = createGetter()
function createGetter(isReadonly = false, shallow = false) {
  // 这里设置了读取(GET)一个Target的某一个key时所进行的操作。
  return function get(target: Target, key: string | symbol, receiver: object) {
    // get的target属性是内部属性：ReactiveFlags.IS_REACTIVE、ReactiveFlags.IS_READONLY、ReactiveFlags.RAW时的返回值。
    // ReactiveFlags.RAW返回原始对象target, 其他按情况返回对应布尔值。
    if (key === ReactiveFlags.IS_REACTIVE) {
      return !isReadonly
    } else if (key === ReactiveFlags.IS_READONLY) {
      return isReadonly
    } else if (
  // Marswiz: receiver是捕获器中，传入的调用这个捕获器的原始对象。
  // 这里的含义是：只有从各个Map中注册过的proxy get这个raw值（也就是通过createReactive、createReadonly这类工厂函数创建的proxy）.
  // 才返回原始target，其他proxy对象即使有ReactiveFlags.RAW属性，也用这个get捕获器，也不会返回target,因为vue不认这个对象，它不是从Vue内部创建的。
      key === ReactiveFlags.RAW &&
      receiver ===
        (isReadonly
          ? shallow
            ? shallowReadonlyMap
            : readonlyMap
          : shallow
            ? shallowReactiveMap
            : reactiveMap
        ).get(target)
    ) {
      return target
    }

    // ！！注意：如果target是数组对象，有特殊规则限制！
    const targetIsArray = isArray(target)
    // 对于数组的target，如果get的key是arrayInstrumentations中注册的，则执行arrayInstrumentations内对应的方法。
    // arrayInstrumentations主要拦截数组的三种操作: 'includes', 'indexOf', 'lastIndexOf'
    // 这三种操作因为对数组元素的身份敏感，如果一个数组内还有嵌套的reactive元素，那么在执行这些操作的时候有可能出现错误结果。
    // arrayInstrumentations 保证了无论是直接按照内部reactive()对象执行这些方法还是通过原始值RawValue，都能获取到正确的结果。
    // 同时，在执行这些方法的时候，如果数组target本身没有被track，则按数组的索引字符串为key进行track。
    if (!isReadonly && targetIsArray && hasOwn(arrayInstrumentations, key)) {
      return Reflect.get(arrayInstrumentations, key, receiver)
    }

    // 获取Target对应key的目标值res。
    const res = Reflect.get(target, key, receiver)
    //  内置symbol作为key，或者没有被track的key，都直接返回目标值。
    if (
      isSymbol(key)
        ? builtInSymbols.has(key as symbol)
        : isNonTrackableKeys(key)
    ) {
      return res
    }

    //  ★★★★★★★    关键操作    ★★★★★★★
    //  非只读target，对target.key进行track。 
    if (!isReadonly) {
      track(target, TrackOpTypes.GET, key)
    }
    //  浅响应式对象，直接返回目标结果。
    if (shallow) {
      return res
    }

    //  如果目标值本身直接是ref对象，直接返回Ref.value
    //  ！！！注意这里有一个例外：target是Array数组类型，且key是整数索引时，默认直接返回ref而不是ref.value;
    //  也就是说，在响应式数组中，保存的ref，在执行get操作的时候，返回值仍然是ref，需要进行.value操作才能获取到结果。
    if (isRef(res)) {
      // ref unwrapping - does not apply for Array + integer key.
      const shouldUnwrap = !targetIsArray || !isIntegerKey(key)
      return shouldUnwrap ? res.value : res
    }

    //  如果目标值是对象类型，按是否只读，转化为 只读响应式对象 or 普通响应式对象 返回。
    if (isObject(res)) {
      // Convert returned value into a proxy as well. we do the isObject check
      // here to avoid invalid value warning. Also need to lazy access readonly
      // and reactive here to avoid circular dependency.
      return isReadonly ? readonly(res) : reactive(res)
    }

    // 其他默认情况，都直接返回res目标值。
    return res
  }
}
```
readonly proxy的拦截器：

```js
// Marswiz: 只读对象的proxy捕获器
// 只拦截get/set/deleteProperty三个操作。
export const readonlyHandlers: ProxyHandler<object> = {
  get: readonlyGet,
  // 可以看到，这里Set和deleteProperty都不进行任何操作，且开发环境会报错。
  set(target, key) {
    if (__DEV__) {
      console.warn(
        `Set operation on key "${String(key)}" failed: target is readonly.`,
        target
      )
    }
    return true
  },
  deleteProperty(target, key) {
    if (__DEV__) {
      console.warn(
        `Delete operation on key "${String(key)}" failed: target is readonly.`,
        target
      )
    }
    return true
  }
}
```

# 3. ref()函数

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

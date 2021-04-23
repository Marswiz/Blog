---
layout: post
title: Vue3源码阅读笔记——响应式reactivity部分I:effect/track/trigger
date: 2021-4-18
categories: blog
tags: [Vue]
author: Mars
pIdentifier: 中文缩进
---

> 尝试探索Vue3源码： 响应式reactivity部分。
>
> 原项目目录： /packages/reactivity

# 1. effect.ts

## 1.1 定义dep、keyToDepMap和targetMap的接口类型

可以看到，这里：

- dep被定义为由ReactiveEffect组成的Set集合；
- KeyToDepMap被定义为<any,Dep>类型构成的Map；
- targetMap为一WeakMap实例，其内部元素类型为<any, KeyToDepMap>。

执行顺序是： targetMap -> keyToDepMap -> dep

```typescript
type Dep = Set<ReactiveEffect>
type KeyToDepMap = Map<any, Dep>
const targetMap = new WeakMap<any, KeyToDepMap>()
```

## 1.2 reactiveEffect接口定义

```typescript
export interface ReactiveEffect<T = any> {
  (): T //直接执行的定义
  _isEffect: true // 判断是否为effect的标志，reactiveEffect永远为true. 
  id: number  // reactiveEffect 的 ID
  active: boolean // reactiveEffect是否为活动状态
  raw: () => T // reactiveEffect内effect的原始函数
  deps: Array<Dep> // 保存reactiveEffect在那些Dep中注册的信息，用<dep>类型的Array存放
  options: ReactiveEffectOptions // reactiveEffect的选项配置
  allowRecurse: boolean // 是否允许递归reactiveEffect？ 
}
```
```typescript
export interface ReactiveEffectOptions {
  lazy?: boolean // reactiveEffect是否是懒执行的
  scheduler?: (job: ReactiveEffect) => void
  onTrack?: (event: DebuggerEvent) => void
  onTrigger?: (event: DebuggerEvent) => void
  onStop?: () => void
  allowRecurse?: boolean
}
```

## 1.3 createReactiveEffect函数

```typescript
// effectStack为当前所有ReactiveEffect组成的数组，默认初始值为空；
const effectStack: ReactiveEffect[] = []
// activeEffect声明，取值类型为ReactiveEffect或undefined，没设置初始值（所以是undefined）；
let activeEffect: ReactiveEffect | undefined
```

```typescript
function createReactiveEffect<T = any>(
  fn: () => T, // Effect记录的原始操作fn
  options: ReactiveEffectOptions  // 配置选项
): ReactiveEffect<T> {

// 返回的effect：是一个函数，可以被执行。
  const effect = function reactiveEffect(): unknown {
// 这里定义了返回的effect这个函数，在后续被执行时候，发生的事情。
// 当这个effect不是active激活状态，按options.scheduler是否为true，决定返回effect为undefined或执行fn()；
    if (!effect.active) {
      return options.scheduler ? undefined : fn()
    }
// 当执行时的effectStack栈中，还没有包含这个Effect时：（已包含不进行任何操作）
// 1. 先在所有Deps中彻底清除这个effect，以防重复注册；
// 2. 尝试重新track这个effect，并且把它重新push到effectStack，并且设置它为当前的activeEffect，然后执行effect原始方法fn();
    if (!effectStack.includes(effect)) {
      cleanup(effect)
      try {
        enableTracking()
        effectStack.push(effect)
        activeEffect = effect
        return fn()
      } finally {
        effectStack.pop()
        resetTracking()
        activeEffect = effectStack[effectStack.length - 1]
      }
    }
  } as ReactiveEffect // effect函数接口类型为ReactiveEffect，也就是effect函数上具有ReactiiveEffect接口定义的各种属性（函数属性）。
// 下面设置了这个返回的effect函数的函数属性。
  effect.id = uid++ // 每次uid+1,effect从0开始每个有自己的id。
  effect.allowRecurse = !!options.allowRecurse // 按配置决定effect是否可递归。
  effect._isEffect = true
  effect.active = true 
  effect.raw = fn // effect记录的原始方法fn
  effect.deps = [] // 初始Effect不注册在任何dep中
  effect.options = options // effect也记录了创建时的配置对象信息
  return effect
}
```

## 1.4 effect相关函数定义

```typescript
export function effect<T = any>(
// 传入两个参数： 一个是fn函数，是effect需要运行的主体函数；
// 另一个是options，默认值为空对象，是ReactiveEffectOptions类型的配置对象，为这个effect进行配置。
  fn: () => T,
  options: ReactiveEffectOptions = EMPTY_OBJ
): ReactiveEffect<T> {  //返回值是reactiveEffect接口类型的
// fn可能本身就是effect类型，因为这里需要原始fn函数，所以读取它的原始函数
  if (isEffect(fn)) { //如果fn是一个Effect,则读取它的原始函数
    fn = fn.raw
  }
  const effect = createReactiveEffect(fn, options) //使用fn和options配置调用createReactiveEffect,创建effect(一个带有ReactiveEffect接口类型的函数)用于返回值。
  if (!options.lazy) { //非懒执行的effect，创建后立即执行一次
    effect()
  }
  return effect
}
```

停止一个effect函数:

```typescript
export function stop(effect: ReactiveEffect) {
// 当effect为Active状态时：
  if (effect.active) {
// 先彻底清除掉这个effect
    cleanup(effect) 
// 如果Effect有手动停止函数onStop，就运行一下。
    if (effect.options.onStop) {
      effect.options.onStop()
    }
// 让这个effect的Active属性为false
    effect.active = false
  }
}

// cleanup function: 用来彻底清除一个effect
function cleanup(effect: ReactiveEffect) {
// 1. 先提取包含这个effect的所有dep
  const { deps } = effect
// 2. 遍历清除所有dep内的这个effect
  if (deps.length) {
    for (let i = 0; i < deps.length; i++) {
      deps[i].delete(effect)
    }
// 3. 手动销毁deps对象，腾出内存；
    deps.length = 0
  }
}
```

## 1.5 track相关函数

```typescript
// 设置当前是否可以进行Track操作的总开关：shouldTrack
let shouldTrack = true
// 记录track的历史
const trackStack: boolean[] = []

// 终止Track方法
export function pauseTracking() {
  trackStack.push(shouldTrack)
  shouldTrack = false
}

// 开启track方法
export function enableTracking() {
  trackStack.push(shouldTrack)
  shouldTrack = true
}

// 返回上一个track操作状态
export function resetTracking() {
  const last = trackStack.pop()
  shouldTrack = last === undefined ? true : last
}

// 定义Track函数： 用于track一个effect。
// 传入的参数有： 1. target： track的对象  2. type: track的操作类型，定义如下  3. key： track的target的key
// export const enum TrackOpTypes {
//  GET = 'get',
//  HAS = 'has',
//  ITERATE = 'iterate'
// }
export function track(target: object, type: TrackOpTypes, key: unknown) {
// 这里先进行如下两个判断：
// ① ！shouldTrack 为判定当前不允许track操作
// ② activeEffect === undefined 为判定当前没有活跃状态的effect，当然这时就无法进行track，因为无effect可track.
  if (!shouldTrack || activeEffect === undefined) {
    return
  }
// 获取需要track的target对象对应的depsMap，没有则创建新map。
  let depsMap = targetMap.get(target)
  if (!depsMap) {
    targetMap.set(target, (depsMap = new Map()))
  }
// 在depsMap中通过key获取到对应的dep，没有则创建
  let dep = depsMap.get(key)
  if (!dep) {
    depsMap.set(key, (dep = new Set()))
  }
// 当dep中还没注册(track)当前活跃的effect(activeEffect时)，执行track操作。具体看下面每一步。
  if (!dep.has(activeEffect)) {
// 1. 在Dep中添加这个effect，
    dep.add(activeEffect)
// 2. 在当前track的effect中，添加注册dep的信息
    activeEffect.deps.push(dep)
// △3. 在开发环境：当当前的effect配置中具有onTrack方法时，表明开发者需要在此时执行这个onTrack操作。
// 此时传入相关的对象，执行onTrack方法。
    if (__DEV__ && activeEffect.options.onTrack) {
      activeEffect.options.onTrack({
        effect: activeEffect,
        target,
        type,
        key
      })
    }
  }
}
```

### 1.6 trigger函数

```typescript
export function trigger(
  target: object,
  type: TriggerOpTypes,
  key?: unknown,
  newValue?: unknown,
  oldValue?: unknown,
  oldTarget?: Map<unknown, unknown> | Set<unknown>
) {
// 获取target对应的depsMap
  const depsMap = targetMap.get(target)
  if (!depsMap) {
    // never been tracked： 从未被track的effect，不需做任何操作直接返回。
    return
  }

// 声明需要被触发的所有Effect集合：effects
  const effects = new Set<ReactiveEffect>()
// 添加effect到effects的函数，传入一个dep Set。
  const add = (effectsToAdd: Set<ReactiveEffect> | undefined) => {
    if (effectsToAdd) {
      effectsToAdd.forEach(effect => {
        if (effect !== activeEffect || effect.allowRecurse) {
          effects.add(effect)
        }
      })
    }
  }

// 当触发操作类型是CLEAR时，重新触发Target全部的effect。
  if (type === TriggerOpTypes.CLEAR) {
    // collection being cleared
    // trigger all effects for target
    depsMap.forEach(add)
  } else if (key === 'length' && isArray(target)) {  //这里是修改数组长度对应的触发操作
    depsMap.forEach((dep, key) => {
      if (key === 'length' || key >= (newValue as number)) {
        add(dep)
      }
    })
  } else {
    // schedule runs for SET | ADD | DELETE
       // 其他操作
    if (key !== void 0) {
      add(depsMap.get(key))
    }

    // also run for iteration key on ADD | DELETE | Map.SET
    switch (type) {
      case TriggerOpTypes.ADD:
        if (!isArray(target)) {
          add(depsMap.get(ITERATE_KEY))
          if (isMap(target)) {
            add(depsMap.get(MAP_KEY_ITERATE_KEY))
          }
        } else if (isIntegerKey(key)) {
          // new index added to array -> length changes
          add(depsMap.get('length'))
        }
        break
      case TriggerOpTypes.DELETE:
        if (!isArray(target)) {
          add(depsMap.get(ITERATE_KEY))
          if (isMap(target)) {
            add(depsMap.get(MAP_KEY_ITERATE_KEY))
          }
        }
        break
      case TriggerOpTypes.SET:
        if (isMap(target)) {
          add(depsMap.get(ITERATE_KEY))
        }
        break
    }
  }

  const run = (effect: ReactiveEffect) => {
    if (__DEV__ && effect.options.onTrigger) {
      effect.options.onTrigger({
        effect,
        target,
        key,
        type,
        newValue,
        oldValue,
        oldTarget
      })
    }
    if (effect.options.scheduler) {
      effect.options.scheduler(effect)
    } else {
      effect()
    }
  }

  effects.forEach(run)
}
```

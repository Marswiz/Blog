---
layout: post
title: Promise A+ 规范与实现
date: 2021-9-20
categories: blog
tags: [Promise]
author: Mars
pIdentifier: 中文缩进
---

> Promise A+规范 与 手动实现

# 一、Promis A+ 规范

> 截自：字节路白讲义
> 
> [Promise A+ 官方原文](https://promisesaplus.com/#notes)

## 1. 术语

1. promise 是一个有then方法的对象或者是函数，行为遵循本规范;
2. thenable 是一个有then方法的对象或者是函数;
3. value 是promise状态成功时的值，也就是resolve的参数, 包括各种数据类型, 也包括undefined/thenable或者是 promise
4. reason 是promise状态失败时的值, 也就是reject的参数, 表示拒绝的原因
5. exception 是一个使用throw抛出的异常值

## 2. 规范内容
### 2.1 Promise States 

promise只有三种状态：

1. **pending**

    1.1 初始的状态, 可改变.
    1.2 一个promise在resolve或者reject前都处于这个状态。
    1.3 可以通过 resolve -> fulfilled 状态;
    1.4 可以通过 reject -> rejected 状态;

2. **fulfilled**

    2.1 最终态, 不可变
    2.2 一个promise被resolve后会变成这个状态.
    2.3 必须拥有一个value值

3. **rejected**

    3.1 最终态, 不可变
    3.2 一个promise被reject后会变成这个状态
    3.3 必须拥有一个reason

总结一下, promise的状态流转规律是这样的：

- **pending -> resolve(value) -> fulfilled**
- **pending -> reject(reason) -> rejected**

### 2.2 then()方法

promise应该提供一个`then()`方法, 用来访问最终的结果, 无论是value还是reason.

```js
promise.then(onFulfilled, onRejected)
```

1. **参数要求**
    1.1 onFulfilled 必须是函数类型, 如果不是函数, 应该被忽略.
    1.2 onRejected 必须是函数类型, 如果不是函数, 应该被忽略.
2. **onFulfilled 特性**
    2.1 在promise变成 fulfilled 时，应该调用 onFulfilled, 参数是value
    2.2 在promise变成 fulfilled 之前, 不应该被调用.
    2.3 只能被调用一次(所以在实现的时候需要一个变量来限制执行次数)
3. **onRejected 特性**
    3.1 在promise变成 rejected 时，应该调用 onRejected, 参数是reason
    3.2 在promise变成 rejected 之前, 不应该被调用.
    3.3 只能被调用一次(所以在实现的时候需要一个变量来限制执行次数)
4. **onFulfilled 和 onRejected 应该是微任务**
    这里用`queueMicrotask`来实现微任务的调用.
5. **then方法可以被调用多次**
    5.1 promise状态变成 fulfilled 后，所有的 onFulfilled 回调都需要按照then的顺序执行, 也就是按照注册顺序执行(所以在实现的时候需要一个数组来存放多个onFulfilled的回调)
    5.2 promise状态变成 rejected 后，所有的 onRejected 回调都需要按照then的顺序执行, 也就是按照注册顺序执行(所以在实现的时候需要一个数组来存放多
6. **返回值**
    then 应该返回一个promise
    ```js
    promise2 = promise1.then(onFulfilled, onRejected);
    ```
    6.1 onFulfilled 或 onRejected 执行的结果为x, 调用 resolvePromise( 这里大家可能难以理解, 可以先保留疑问, 下面详细讲一下resolvePromise是什么东西 )
    6.2 如果 onFulfilled 或者 onRejected 执行时抛出异常e, promise2需要被reject
    6.3 如果 onFulfilled 不是一个函数, promise2 以promise1的value 触发fulfilled
    6.4 如果 onRejected 不是一个函数, promise2 以promise1的reason 触发rejected
7. **resolvePromise过程**
   ```js
   resolvePromise(promise2, x, resolve, reject)
   ```
    7.1 如果 promise2 和 x 相等，那么 reject TypeError；

    7.2 如果 x 是一个 promise；

    - 如果x是pending态，那么promise必须要在pending,直到 x 变成 fulfilled or rejected.
    - 如果 x 被 fulfilled, fulfill promise with the same value.
    - 如果 x 被 rejected, reject promise with the same reason.

    7.3 如果 x 是一个 object 或者 是一个 function：`let then = x.then.`
      - 如果 x.then 这步出错，那么 reject promise with e as the reason.
      - 如果 then 是一个函数，then.call(x, resolvePromiseFn, rejectPromise)
            resolvePromiseFn 的 入参是 y, 执行 resolvePromise(promise2, y, resolve, reject);
            rejectPromise 的 入参是 r, reject promise with r.
      - 如果 resolvePromise 和 rejectPromise 都调用了，那么第一个调用优先，后面的调用忽略。
      - 如果调用then抛出异常e 
      - 如果 resolvePromise 或 rejectPromise 已经被调用，那么忽略
                则，reject promise with e as the reason
      - 如果 then 不是一个function. fulfill promise with x.


# 二、手动实现
## 2.1 基本思路

1. 通过为state设置`setter`，实现当状态state改变时(`prepend -> fulfilled` 或 `prepend -> rejected`)，根据改变的目标值，按序依次执行`.then()`传入的方法；
2. 多次调用`.then()`，用2个队列数组分别保存传入的`onResolved`和`onRejected`函数，这样可以按传入顺序依次执行；
3. `new Promise(fn)`传入的函数`fn`应该是直接同步调用的；
4. `.then()`传入的函数应该是**微任务**，使用`queueMicrotask()`方法实现；

## 2.2 实现代码

```js
const PENDING = 'pending';
const FULFILLED = 'fulfilled';
const REJECTED = 'rejected';

class MPromise {

    FULFILLED_CALLBACK_LIST = [];
    REJECTED_CALLBACK_LIST = [];
    _status = PENDING;

    constructor(fn) {
        // 初始状态为pending
        this.value = null;
        this.reason = null;

        try {
            fn(this.resolve.bind(this), this.reject.bind(this));
        } catch (e) {
            this.reject(e);
        }
    }

    get status() {
        return this._status;
    }

    set status(newStatus) {
        this._status = newStatus;
        switch (newStatus) {
            case FULFILLED: {
                this.FULFILLED_CALLBACK_LIST.forEach(callback => {
                    callback(this.value);
                });
                break;
            }
            case REJECTED: {
                this.REJECTED_CALLBACK_LIST.forEach(callback => {
                    callback(this.reason);
                });
                break;
            }
        }
    }

    resolve(value) {
        if (this.status === PENDING) {
            this.value = value;
            this.status = FULFILLED;
        }
    }

    reject(reason) {
        if (this.status === PENDING) {
            this.reason = reason;
            this.status = REJECTED;
        }
    }

    then(onFulfilled, onRejected) {
        const fulFilledFn = this.isFunction(onFulfilled) ? onFulfilled : (value) => {
            return value;
        };
        const rejectedFn = this.isFunction(onRejected) ? onRejected : (reason) => {
            throw reason;
        };

        const fulFilledFnWithCatch = (resolve, reject, newPromise) => {
            queueMicrotask(() => {
                try {
                    if (!this.isFunction(onFulfilled)) {
                        resolve(this.value);
                    } else {
                        const x = fulFilledFn(this.value);
                        this.resolvePromise(newPromise, x, resolve, reject);
                    }
                } catch (e) {
                    reject(e)
                }
            })
        };

        const rejectedFnWithCatch = (resolve, reject, newPromise) => {
            queueMicrotask(() => {
                try {
                    if (!this.isFunction(onRejected)) {
                        reject(this.reason);
                    } else {
                        const x = rejectedFn(this.reason);
                        this.resolvePromise(newPromise, x, resolve, reject);
                    }
                } catch (e) {
                    reject(e);
                }
            })
        }

        switch (this.status) {
            case FULFILLED: {
                const newPromise = new MPromise((resolve, reject) => fulFilledFnWithCatch(resolve, reject, newPromise));
                return newPromise;
            }
            case REJECTED: {
                const newPromise = new MPromise((resolve, reject) => rejectedFnWithCatch(resolve, reject, newPromise));
                return newPromise;
            }
            case PENDING: {
                const newPromise = new MPromise((resolve, reject) => {
                    this.FULFILLED_CALLBACK_LIST.push(() => fulFilledFnWithCatch(resolve, reject, newPromise));
                    this.REJECTED_CALLBACK_LIST.push(() => rejectedFnWithCatch(resolve, reject, newPromise));
                });
                return newPromise;
            }
        }
    }

    resolvePromise(newPromise, x, resolve, reject) { 
        // resolvePromise的功能是：
        // 使用值x，对newPromise进行解决，解决使用的方法是resolve和reject。

        // 如果 newPromise 和 x 指向同一对象，以 TypeError 为 reason 拒绝执行 newPromise
        // 这是为了防止死循环
        if (newPromise === x) {
            return reject(new TypeError('The promise and the return value are the same'));
        }

        if (x instanceof MPromise) {
            // 如果 x 为 Promise ，则使 newPromise 接受 x 的状态
            // 也就是继续执行x，如果执行的时候拿到一个y，还要继续解析y
            x.then((y) => {
                this.resolvePromise(newPromise, y, resolve, reject);
            }, reject);
        } else if (typeof x === 'object' || this.isFunction(x)) {
            // 如果 x 为对象或者函数
            if (x === null) {
                // null也会被判断为对象
                return resolve(x);
            }

            let then = null;

            try {
                // 把 x.then 赋值给 then
                then = x.then;
            } catch (error) {
                // 如果取 x.then 的值时抛出错误 e ，则以 e 为据因拒绝 promise
                return reject(error);
            }

            // 如果 then 是函数
            if (this.isFunction(then)) {
                let called = false;
                // 将 x 作为函数的作用域 this 调用
                // 传递两个回调函数作为参数，第一个参数叫做 resolvePromise ，第二个参数叫做 rejectPromise
                try {
                    then.call(
                        x,
                        // 如果 resolvePromise 以值 y 为参数被调用，则运行 resolvePromise
                        (y) => {
                            // 需要有一个变量called来保证只调用一次.
                            if (called) return;
                            called = true;
                            this.resolvePromise(newPromise, y, resolve, reject);
                        },
                        // 如果 rejectPromise 以据因 r 为参数被调用，则以据因 r 拒绝 promise
                        (r) => {
                            if (called) return;
                            called = true;
                            reject(r);
                        });
                } catch (error) {
                    // 如果调用 then 方法抛出了异常 e：
                    if (called) return;

                    // 否则以 e 为据因拒绝 promise
                    reject(error);
                }
            } else {
                // 如果 then 不是函数，以 x 为参数执行 promise
                resolve(x);
            }
        } else {
            // 如果 x 不为对象或者函数，以 x 为参数执行 promise
            resolve(x);
        }
    }

    catch (onRejected) {
        return this.then(null, onRejected);
    }

    isFunction(param) {
        return typeof param === 'function';
    }

    static resolve(value) {
        if (value instanceof MPromise) {
            return value;
        }

        return new MPromise((resolve) => {
            resolve(value);
        });
    }

    static reject(reason) {
        return new MPromise((resolve, reject) => {
            reject(reason);
        });
    }

    static race(promiseList) {
        return new MPromise((resolve, reject) => {
            const length = promiseList.length;

            if (length === 0) {
                return resolve();
            } else {
                for (let i = 0; i < length; i++) {
                    MPromise.resolve(promiseList[i]).then(
                        (value) => {
                            return resolve(value);
                        },
                        (reason) => {
                            return reject(reason);
                        });
                }
            }
        });

    }
}
```
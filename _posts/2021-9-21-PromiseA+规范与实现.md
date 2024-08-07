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
const REJECTED = 'rejected';
const FULFILLED = 'fulfilled';

class MPromise {
    _status = PENDING;

    // .then(onFulfilled: (res)=>{}, onRejected: (res)=>{}); 
    // all callbacks are microtasks.
    RESOLVE_CALLBACKS = [];
    REJECT_CALLBACKS = [];

    constructor(fn) {
        this.value = null;
        this.reason = null;
        try {
            fn(this.resolve.bind(this), this.reject.bind(this));
        } catch (error) {
            this.reject(error);
        }
    }

    get status() {
        return this._status;
    }

    set status(e) {
        this._status = e;
        if (e === FULFILLED) {
            for (let callback of this.RESOLVE_CALLBACKS) {
                callback(this.value);
            }
        } else if (e === REJECTED) {
            for (let callback of this.REJECT_CALLBACKS) {
                callback(this.reason);
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

    isFunc(e) {
        return typeof e === 'function';
    }

    then(onFulfilled, onRejected) {
        const fulfillFn = this.isFunc(onFulfilled) ? onFulfilled : (value) => value;
        const rejectFn = this.isFunc(onRejected) ? onRejected : (reason) => {
            throw reason;
        };

        const fulfillFnWithTryCatch = (resolve, reject, promise2) => {
            queueMicrotask(() => {
                try {
                    if (!this.isFunc(onFulfilled)) {
                        resolve(this.value);
                    } else {
                        let x = fulfillFn(this.value);
                        this._resolvePromise(promise2, x, resolve, reject);
                    }
                } catch (error) {
                    reject(error);
                }
            });
        }

        const rejectFnWithTryCatch = (resolve, reject, promise2) => {
            queueMicrotask(() => {
                try {
                    if (!this.isFunc(onRejected)) {
                        reject(this.reason);
                    } else {
                        let x = rejectFn(this.reason);
                        this._resolvePromise(promise2, x, resolve, reject);
                    }
                } catch (error) {
                    reject(error);
                }
            });
        }


        switch (this.status) {
            case FULFILLED: {
                const promise2 = new MPromise((resolve2, reject2) => {
                    setTimeout(() => {
                        fulfillFnWithTryCatch(resolve2, reject2, promise2);
                    }, 0);
                });
                return promise2;
            }
            case REJECTED: {
                const promise2 = new MPromise((resolve2, reject2) => {
                    setTimeout(() => {
                        rejectFnWithTryCatch(resolve2, reject2, promise2)
                    }, 0);
                });
                return promise2;
            }
            case PENDING: {
                const promise2 = new MPromise((resolve2, reject2) => {
                    this.RESOLVE_CALLBACKS.push(() => {
                        fulfillFnWithTryCatch(resolve2, reject2, promise2);
                    });
                    this.REJECT_CALLBACKS.push(() => rejectFnWithTryCatch(resolve2, reject2, promise2));
                });
                return promise2;
            }
        }
    }

    _resolvePromise(newPromise, x, resolve, reject) {
        if (newPromise === x) {
            reject(new TypeError(`Try to resolve a promise with itself.`));
            return;
        }

        if (x instanceof MPromise) {
            return x.then((value) => {
                this._resolvePromise(newPromise, value, resolve, reject);
            }, (reason) => {
                reject(reason);
            });
        }

        if ((typeof x === 'object' && x !== null) || this.isFunc(x)) {
            let then;
            try {
                then = x.then;
                let called = false;
                if (this.isFunc(then)) {
                    const resolvePromise = (y) => {
                        if (called) return;
                        called = true;
                        this._resolvePromise(newPromise, y, resolve, reject);
                    };
                    const rejectPromise = (r) => {
                        if (called) return;
                        called = true;
                        reject(r);
                    };
                    try {
                        then.call(x, resolvePromise, rejectPromise);
                    } catch (error) {
                        if (called) return;
                        reject(error);
                    }
                } else {
                    resolve(x);
                }
            } catch (error) {
                reject(error);
            }
            return;
        }

        resolve(x);
    }

    catch (onRejected) {
        return this.then(null, onRejected);
    }

    static resolve(value) {
        if (value instanceof MPromise) return value;
        return new MPromise((res, rej) => {
            res(value);
        });
    }
}
```

Promise A+ 测试 All Pass，截图纪念。

![allpass](/assets/posts/34.png)
---
layout: post
title: 前端防抖(debounce)和节流(throttle)
date: 2021-3-31
categories: blog
tags: [Frontend]
author: Mars
pIdentifier: 中文缩进
---

> 防抖和节流，在本质上都是为了防止函数被多次频繁触发，采取的保护措施。
>
> 防抖和节流的区别：在约定的时间间隔内重复执行函数，是否重新计时。节流不会重新计时，而防抖会。

# 一、防抖 (Debounce)

防抖（Debounce）：在函数被执行后的规定间隔时间内，无法再次执行函数。如果间隔时间内再次执行了函数，则重新计算时间间隔。

防抖可以保证函数不会被连续触发，规定时间间隔内最多只能触发一次。连续的触发事件如果间隔均小于防抖规定的时间间隔，则只会在最后一次事件结束之后才会执行。

下面是一段实现函数防抖的代码：

```js
    // 防抖函数
    function debounce(fn, delay) {
        let timer = null;
        return function (...args) {
            if(timer !== null){
                clearTimeout(timer);
            }
            timer = setTimeout(() => {
                fn.call(this, ...args); // 防止this指向错误 
            }, delay);
        }
    }

    function say(e){
      console.log(e.target.value);
    }

    let debouncedSay = _debounce(say, 1000);
    document.getElementById('debounceElement').addEventListener('keyup', debouncedSay);  //输入结束1S后才会打印到控制台。
```

**应用：** 

- input元素在输入的时候，输入完毕再获取输入值，而不是在输入的时候一直触发；
- resize事件，等到窗口调整完成后再触发事件。

# 二、节流（Throttle）

节流（Throttle）：函数在规定的时间间隔内最多执行1次，时间间隔内多次触发无任何效果，不会重新计算时间间隔。

节流模式分为：

- **首节流**：第一次触发立即响应，事件结束之后不再响应； （时间戳实现法）
- **尾节流**：第一次触发不立即响应，需要等到第一次时间间隔到了才响应，事件结束之后也会在最后一个间隔周期到了的时候保留一次响应；（setTimeout实现法）
- **首尾节流**：第一次触发立即响应，事件结束后的下一个间隔周期也保留一次响应；（前二者结合）

下面是一段实现函数节流的代码：

```js
    // 首节流
    function throttleFront(fn, delay) {
        let prevTime = 0;
        return function (...args) {
            let curTime = Date.now();
            if (curTime - prevTime >= delay) {
                prevTime = curTime;
                fn.call(this, ...args);
            }
        }
    }

    // 尾节流
    function throttleEnd(fn, delay) {
        let timer = null;
        return function (...args) {
            if (timer === null) {
                timer = setTimeout(() => {
                    fn(...args);
                    timer = null;
                }, delay);
            }
        }
    }
    
    // 首尾节流
    function throttleBoth(fn, delay) {
        let prevTime = 0;
        let timer = null;
        return function (...args) {
            let curTime = Date.now();
        // 第一次触发和中间过程的触发，都是使用时间戳实现；
            if (curTime - prevTime >= delay) {
                fn(...args);
                prevTime = curTime;
            } else {
        // 这里相当于是防抖，只有事件结束后的最后一次触发，才使用setTimeout进行。
                if (timer !== null) {
                    clearTimeout(timer);
                }
                timer = setTimeout(() => {
                    fn(...args);
                }, delay);
            }
        }
    }
```

**应用：**

- scroll，resize等事件，防止高频触发；
- 鼠标点击事件，防止高频触发；

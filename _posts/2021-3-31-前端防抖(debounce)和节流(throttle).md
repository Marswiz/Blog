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

# 防抖 (Debounce)

防抖（Debounce）：在函数被执行后的规定间隔时间内，无法再次执行函数。如果间隔时间内再次执行了函数，则重新计算时间间隔。

防抖可以保证函数不会被连续触发，规定时间间隔内最多只能触发一次。连续的触发事件如果间隔均小于防抖规定的时间间隔，则只会在最后一次事件结束之后才会执行。

下面是一段实现函数防抖的代码：

```js
    // 防抖函数
    function _debounce(func, delay){
      return function (...args){
        if (this.timeoutID){
          clearTimeout(this.timeoutID);
        }
        let timeout = setTimeout(()=>{
            func(...args);
          }, delay);
        this.timeoutID = timeout;
       }
    }

    function say(e){
      console.log(e.target.value);
    }

    let debouncedSay = _debounce(say, 1000);
    document.getElementById('debounceElement').addEventListener('keyup', debouncedSay);  //输入结束1S后才会打印到控制台。
```
# 节流（Throttle）

节流（Throttle）：函数在规定的时间间隔内最多执行1次，时间间隔内多次触发无任何效果，不会重新计算时间间隔。

下面是一段实现函数节流的代码：

```js
    // 节流函数
    function _throttle(func, delay){
      return function (...args){
        if (this.timeoutID){
          console.log('canceled');
          return ;
        }
        let timeout = setTimeout(()=>{
          func(...args);
          this.timeoutID = null;
        } ,delay);
        this.timeoutID = timeout;
      }
    }

    function say(e){
      console.log(e.target.value);
    }

    let throttledSay = _throttle(say, 1000);
    document.getElementById('throttleElement').addEventListener('keyup', throttledSay);
```


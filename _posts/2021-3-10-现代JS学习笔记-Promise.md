---
layout: post
title: 现代JS学习笔记：Promise
date: 2021-3-10
categories: blog
tags: [JavaScript]
author: Mars
pIdentifier: 中文缩进
---
> 学习内容：[《现代JavaScript教程》](https://zh.javascript.info/)

# 13	Promise
## 13.1	基于回调的异步编程

比如想要在一个请求完成后，立即执行一个函数。这个形式叫做异步编程，可以使用回调函数的形式编写。如下：

```js
function loadScript(src, callback) {
  let script = document.createElement('script');
  script.src = src;
  script.onload = () => callback(script); //这里编写了script标签载入后的回调函数。
  document.head.append(script);
}

loadScript('https://cdnjs.cloudflare.com/ajax/libs/lodash.js/3.2.0/lodash.js', script => {
  alert(`Cool, the script ${script.src} is loaded`);
  alert( _ ); // 所加载的脚本中声明的函数
});
```

这种回调函数在少量的嵌套时没问题，在多层嵌套时，比如回调里面还有异步的回调，多层嵌套会导致代码难以维护。

## 13.2	Promise基本知识

Promise含义是“承诺”，顾名思义，一个Promise对象是一个承诺，它承诺了在一段时间后会给出某种解决方案：抛出一个结果或抛出错误。

Promise对象的存在是为了解决异步编程中的回调地狱问题。Promise在“生产者”和“消费者”之间达成契约，作为中间商，当生产者一旦产出结果，立即通报给消费者。

Promise()是JavaScript内置构造函数。语法如下：

```js
let promise = new Promise(function(resolve, reject) { //参数为一个函数，函数参数列表第一个是resolve函数，第二个是reject函数，这两个函数都是JS内置的，无需自己定义。
  // executor（生产者代码）
});
```

Promise构造时传入的函数被称为executor，它最终一定应该调用resolve或reject函数中的一个，代表执行成功返回结果 或 出现Error。

## 13.3	Promise中的resolve和reject函数

Promise对象在构造的时候，传入的executor函数带有两个参数，resolve和reject函数。

这两个函数都是可以直接执行的（Js内部定义好的），可以传入任何类型的值。

resolve(value)传入的value会作为promise最终输出的Value保存在promise的result属性中。reject（error）传入的error会作为promise错误输出值，保存在promise的内部result属性中。

1. 使用reject函数作为报错输出时，一般建议使用Error对象作为参数，因为这样可以明确看出是出现了错误，后面有很多好处。
2. promise中resolve和reject调用时间不受限制，不一定非要异步操作，也可以直接调用二者其一，把promise立即解决。

## 13.4	Promise对象的内部属性

Promise对象具有两个内部属性：state 和 result。

- state: 初始值为’pending’，当resolve函数运行后，变更为’fulfilled’。在reject函数运行后，变更为’rejected’；
- result: 初始值为undefined。在resolved函数运行后变更为返回的结果value，在Reject函数运行后变更为错误对象error；

所以， promise 最终必将变为以下状态之一：
 
无论promise是被解决resolved还是被拒绝rejected，都称作settled。

>注意：
>
>state和result这两个属性，和原型对象`[[prototype]]`一样，都是内部属性，不能直接访问。只能通过.then()这类方法访问。

## 13.5	then()、catch()和finally()
## 13.5.1	then()

then()方法是promise对象内置的方法，可以调用，目的是在promise对象被resolved或rejected之后，做出相应操作。

then传入两个函数作为参数，第一个函数代表了resolve之后执行的操作，第二个函数代表了reject之后执行的操作。

promise 被 settle 后，始终都会传入一个结果给.then()内部的函数：当promise被resolve，传入结果给第一个函数参数；当promise被reject，传入结果给第二个函数参数。

```js
promise.then(
  function(result) { /* handle a successful result */ },
  function(error) { /* handle an error */ }
);
```


如果只对promise运行成功之后的结果感兴趣，可以不传入第二个参数，只传入第一个函数参数。

只要promise是settled状态，调用其.then函数就会立即执行。

then函数可以调用多次，相当于多次处理一个promise产生的结果。

## 13.5.2	catch()

catch(func)只在promise被reject的时候才起作用。它相当于then(null, func)。

## 13.5.3	finally()

finally（func）中的func会在promise被Settled之后运行。

基本相似于then(func, func)，表示无论如何，只要promise产生了结果，就一定要运行的函数。（比如执行某些清理操作。）

finally()不处理promise运行的结果，只是执行某些一定要进行的操作。finally运行之后，带有结果的promise对象依然被传出，可以继续直接调用.then或.catch，对结果进行处理。

## 13.6	Promise链

一个Promise在使用了.then()之后，整个.then()返回的仍是一个promise（但不是原来的promise.），它也有.then()方法，可以继续调用。

如果.then内部的两个函数返回了值，那么它就是整个.then()返回promise的result；如果没有返回值，.then()返回promise result是undefined。

上一个.then()调用后的结果，会作为其返回promise对象的内部result属性值，下一个.then（）会获取该值进行相应处理。

比如：

```js
new Promise(function(resolve, reject) {
  setTimeout(() => resolve(1), 1000);
}).then(function(result) { 
  alert(result); // 1
  return result * 2;
}).then(function(result) { 
  alert(result); // 2
  return result * 2;
}).then(function(result) {
  alert(result); // 4
  return result * 2;
});
```


then方法内部也可以手动return一个promise对象，那么下一个.then将等待这个返回的promise对象Settle之后才会运行。这使得我们可以利用promise链进行一连串的异步行为。

## 13.7	Promise构造函数自带的方法

## 13.7.1	Promise.all()

Promise.all()方法接收一个数组作为参数，当该数组中含有的所有Promise对象都被resolve，返回一个新promise对象，它的Result是原数组中所有result组成的数组（原数组中不是promise对象的，就原样返回）。

当传入数组中有一个promise被reject，则Promise.all 就会立即被 reject，完全忽略列表中其他的 promise。它们的结果也被忽略。

```js
let promise1 = new Promise((resolve, reject)=>{
  setTimeout(()=>resolve('first promise resolved!'),1000);
});

let promise2 = new Promise((resolve, reject)=>{
  setTimeout(()=>resolve('second promise resolved!'),3000);
});

let controler = Promise.all(
  [promise1, promise2, 1234]
);

controler.then((result)=>{
  console.log(result);  
// ["first promise resolved!", "second promise resolved!", 1234]
})
```

## 13.7.2	Promise.allSettled()

Promise.allSettled()方法接收一个数组作为参数，当该数组中含有的所有Promise对象都被settle，也就是被resolve或reject，就立即返回一个新promise对象，它的Result是由对象构成的数组，对象的结构视resolve或reject而不同，具体如下：

```js
{status:"fulfilled", value:result}  // 对于成功的响应，
{status:"rejected", reason:error} //对于 error。
```

## 13.7.3	Promise.race（）

Promise.race()方法接收一个数组作为参数，返回该数组中第一个被settle的Promise结果（result或error）。

```js
Promise.race([
  new Promise((resolve, reject) => setTimeout(() => resolve(1), 1000)),
  new Promise((resolve, reject) => setTimeout(() => reject(new Error("Whoops!")), 2000)),
  new Promise((resolve, reject) => setTimeout(() => resolve(3), 3000))
]).then(alert); // 1
```

## 13.8	Promisefication (Promise化)

“Promisification” 是用于一个简单转换的一个长单词。它指将一个接受回调的函数转换为一个返回 promise 的函数。

具体的promisefy方法见：https://zh.javascript.info/promisify

## 13.9	微任务microtask

Promise始终是异步的，它一旦被settle，它的then/catch/finally这些handler会被放入一个叫做微任务队列(microtask queue)的队列中等待被执行。

当JS代码执行完毕后，JS引擎才会从微任务队列里按先后顺序执行这些任务。

>**注：**
> 
>队列是一种数据结构，它的特点是先进先出。
>
>因此，即使是创建后立即就被resolve或reject的promise对象，它的then方法也会在全部JS代码执行完毕后才会执行。

## 13.10	async/await
## 13.10.1	async

async关键字可以用在函数的前部，它的含义是：

- 让这个函数总是返回一个 promise；
- 允许在该函数内使用 await。

async关键字修饰的函数，即使return了一个非promise对象的变量，也会被作为Result包装成promise对象返回。

## 13.10.2	await

await关键字用在async修饰的函数体内的promise对象前，它的含义是：

让JS引擎暂停，等待这个promise对象被settle，然后返回结果result或错误error。（可以避免使用.then方法，让代码更容易阅读）

>注意：
>
>await 实际上会暂停函数的执行，直到 promise 状态变为 settled，然后以 promise 的结果继续执行。这个行为只是在本函数内有效，JavaScript 引擎可以同时处理其他任务：执行其他脚本，处理事件等。
>
>await也可以Promise.all()一起使用，把许多promise对象包装在一起等待settle。

## 13.10.3	async/await中的Error处理

如果await后面的promise对象被reject了，那么这一行**相当于抛出了这个Error**。和throw error是一样的。

---
layout: post
title: 现代JS学习笔记：Generator（生成器）
date: 2021-3-10
categories: blog
tags: [JavaScript]
author: Mars
pIdentifier: 中文缩进
---
> 学习内容：[《现代JavaScript教程》](https://zh.javascript.info/)

# 14	Generator （生成器）
## 14.1	Generator基本知识

Generator生成器函数，顾名思义，就是一个能按照既定的规则，连续产生多个数据的函数。它区别于常规的函数，因为函数只能返回一个值。它的创建方法是：

1. 创建一个Generator函数声明，需要在function关键字后面加一个星号：
    ```js
    function*  <functionName>(){};
    ```
2. 在对象内部定义Generator函数方法，只需在方法名前加一个星号*：
    ```js
    {
        *fun1(){…},
    }
    ```

在Generator函数中可以使用yield关键字（yield的本意是生产、产出），定义Generator对象每次产出的值。

调用Generator函数会返回一个Generator对象，可以将其赋值给变量。每一个Generator对象都有next()方法，可以根据Generator内部yield的value依次返回以下格式的对象，直到最后的retrun。

`
{value: <yield value> ,done: <true/false>}
`

例如:

```js
function* generator1(){
  yield 1;
  yield 2;
  yield 3;
  return 4;
}

let a = generator1();  //调用生成Generator对象赋值给变量a 
let i = true;
while(i){
  let temp = a.next();
  console.log(temp);
  i = !temp.done;
}   // 结果如下：
```

![](/assets/posts/4.png)

## 14.2	Generator对象是可迭代的Iteratable

一个Generator对象，是一个可迭代(Iteratable)对象。也就是说，它可以用for…of迭代，也可以使用spread符号(…)展开为独立的参数列表。

例如，针对上小节的a对象，可以这样迭代使用：

```js
for (let value of a){
  console.log(value);
}  // 1,2,3
console.log(…a);  // 1 2 3
```

>**注意：**
>
>Generator对象中只有使用yield关键字声明的value才会被迭代返回，而return的参数不会。
>
>Generator函数的产生使得对象自定义Symbol.iterator方法的编写更加明晰和方便。

```js
let range = {
  from: 1,
  to: 5,

  *[Symbol.iterator](){
 // [Symbol.iterator]: function*() 的简写形式，返回Generator。
    for(let value = this.from; value <= this.to; value++) {
      yield value;
    }
  }
};

alert( [...range] ); // 1,2,3,4,5
```

## 14.3	Generator合并

如果想将多个Generator对象yield的值传入另一个Generator函数中，可以使用yield* 这个语句。

![](/assets/posts/5.png)
 
## 14.4	yield是一条双向路：既可以传出，也可以传入

单独使用yield value表示传出value到Generator外。

将yield value赋值给一个变量a，则代表让Generator函数在此停止运行，等待在下次next()方法被调用的时候，传入一个参数value,也就是下次调用是next(value)这个形式。这个传入的value会自动传入Generator对象内部并赋值给变量a。

```js
function* gene1(){
  yield 1;
  let a = yield 'what is your lucky number?';
  console.log('your lucky number is: '+a);
  yield 3;
}
let g = gene1();
```
![](/assets/posts/7.png)

## 14.5	generator.throw()

也可以在yield那里发起（抛出）一个 error,因为 error 本身也是一种结果,可以传入yield那一行赋值的变量a。要向 yield 传递一个 error，我们应该调用 generator.throw(err)。在这种情况下，err 将被抛到对应的 yield 所在的那一行。

可以在Generator函数内部使用try…catch捕获这个传入的Error。

## 14.6 使用Generator进行异步迭代

在generator声明前加上async关键字，可以使generator声明为异步Generator。同时，其内部可以使用await关键字进行promise等待与解析。

这样异步generator，常规使用for…of进行迭代也是不行的，会报错（not iteratble）。必须使用for await…of这样的异步迭代方式进行迭代（相当于是异步可迭代对象，而非普通可迭代对象）。例子如下：
 
![](/assets/posts/6.png)
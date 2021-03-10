---
layout: post
title: 现代JS学习笔记：Proxy和Reflect
date: 2021-3-10
categories: blog
tags: [JavaScript]
author: Mars
pIdentifier: 中文缩进
---
> 学习内容：[《现代JavaScript教程》](https://zh.javascript.info/)

# Proxy和Reflect
## 	Proxy代理器
### 	Proxy是什么

Proxy顾名思义，是一个对象的代理对象。

Proxy可以将一个对象包装成另一个对象，可以简单理解为被包装对象的“经纪人”。它监控对这个被包装对象的一切操作，并针对不同的操作，代替这个对象执行一些设定好的操作。Proxy是ES6之后才添加的新对象。

>对象是明星，Proxy是这个明星的经纪人，要找明星办事先要联系经纪人.
>
>经纪人可以拒绝你的任何要求，或者可以告诉你一些明星的信息，也可以帮你传信给明星本人。

### 	Proxy基本语法

Proxy的基本语法是这样的：

```js
let proxy = new Proxy(target, handler)；
```

其中，target是被包装的对象，handler是代理配置（也叫“捕获器”（trap），就是拦截各种操作的方法）。

一般可以将handler对象在外部单独声明，然后在声明Proxy的时候直接使用变量名。

对Proxy进行操作，如果Proxy存在针对这种操作的捕获器trap，则将执行捕获器定义的操作。如果不存在，就直接把这种操作传入给被包装的对象。

handler捕获器有**13种**，见下表。

|内部方法|Handler方法|何时触发|
|---|---|---|
|[[Get]]|	get|	读取属性|
|[[Set]]|	set	|写入属性|
|[[HasProperty]]|	has|	in 操作符|
|[[Delete]]|	deleteProperty|	delete 操作符|
|[[Call]]|	apply	|函数调用|
|[[Construct]]|	construct	|new 操作符|
|[[GetPrototypeOf]]|	getPrototypeOf|	Object.getPrototypeOf|
|[[SetPrototypeOf]]|	setPrototypeOf|	Object.setPrototypeOf|
|[[IsExtensible]]|	isExtensible	|Object.isExtensible|
|[[PreventExtensions]]|	preventExtensions|	Object.preventExtensions|
|[[DefineOwnProperty]]|	defineProperty|	Object.defineProperty, Object.defineProperties|
|[[GetOwnProperty]]|	getOwnPropertyDescriptor|	Object.getOwnPropertyDescriptor, for..in, Object.keys/values/entries|
|[[OwnPropertyKeys]]|	ownKeys|	Object.getOwnPropertyNames, Object.getOwnPropertySymbols, for..in, Object/keys/values/entries|

> 这里的内部方法，是Js语言中操作对象最底层的方法，这些方法我们不能直接使用，仅仅能在规范中使用。
>
>但是我们可以通过Proxy检测并拦截这些底层方法。

### 	常见的捕获器设置

new Proxy(target, handler)创建的时候，第二个参数捕获器handler是一个对象，里面的各个方法设定了捕获到各种操作后，进行相应的处理方式。
最简单常见的是get和set捕获器，它们分别在target被获取和被修改的时候触发。

#### get捕获器

要拦截读取操作，handler 应该有 get(target, property, receiver) 方法。
读取属性时触发该方法，参数如下：
- target —— 是目标对象，该对象被作为第一个参数传递给 new Proxy;
- property —— 目标属性名;
- receiver —— 与Getter访问器属性有关，暂时不考虑。
let numbers = [0, 1, 2];
numbers = new Proxy(numbers, {
  get(target, prop) {
    if (prop in target) {
      return target[prop];
    } else {
      return 0; // 默认值
    }
  }
});
alert( numbers[1] ); // 1
alert( numbers[123] ); // 0（没有这个数组项）

####	 set捕获器

当写入属性时 set 捕捉器被触发。
set(target, property, value, receiver)：
- target —— 是目标对象，该对象被作为第一个参数传递给 new Proxy，
- property —— 目标属性名称，
- value —— 目标属性的值，
- receiver —— 与 get 捕捉器类似，仅与 setter 访问器属性相关。
set捕获器在属性值成功设定后，必须返回true(return true)。否则会报错。

####	 ownKeys捕获器

Object.keys，for..in 循环和大多数其他遍历对象属性的方法都使用内部方法 **[[OwnPropertyKeys]]**（由 ownKeys 捕捉器拦截) 来获取属性列表。

ownKeys捕获器可以捕获这些行为。

★ 几种不同遍历对象属性方法之间的区别：

1. Object.getOwnPropertyNames(obj) 返回所有非 Symbol 键，无论是否enumerable；
2. Object.getOwnPropertySymbols(obj) 只返回 Symbol 键；
3. Object.keys/values() 返回带有 enumerable 标志的非 Symbol 键/值；
4. for..in 循环遍历所有带有 enumerable 标志的非 Symbol 键，还会返回原型对象的键。

ownKeys(target)传入一个目标对象，它应该Return 一个数组对象，里面元素是想要返回的遍历结果。

```js
function unModified(obj){
  return new Proxy(obj,{
    ownKeys(target) {
      return ['a','b','c']; 
//这里设定在遍历的时候返回a,b,c,但是每个属性都相当于没有配置属性标志，enumerable默认为false。所以只能用Object.getOwnPropertyName()遍历才能显示出来。其他方法返回都是空的。
    }
  });
}
```

####	 has捕获器

has捕获器在对包装对象使用in操作符的时候触发。

```js
has(target,prop){}
// target是包装的对象本身，prop表示in前面的，也就是传入的属性参数。
```

####	 apply捕获器

apply(target, thisArg, args) 捕捉器能使代理以函数的方式被调用：

- target 是目标对象（在 JavaScript 中，函数就是一个对象）；
- thisArg 是 this 的值；
- args 是参数列表。

具体见：[proxy-apply](https://zh.javascript.info/proxy#proxy-apply)

### 	Proxy的弊端
####	 Proxy ！= target

Proxy虽然可以把外部的操作透明地传给内部，但是毕竟代理后的Proxy对象和原target不是一个对象，因此他们之间不相等。

####	 使用”内部插槽”的对象无法使用

有些特殊类型对象的数据，使用“内部插槽”的形式保存，并使用内部方法修改（比如Map.set()），并不通过常规**[[get]]/[[set]]**这类内建方法，因此代理后无法实现捕获和修改等操作。

这类对象类型包括：Map/Set/Date/Promise/class的#开头私有属性。

这些对象需要通过以下方式，将原本的内部方法绑定到自身后返回使用：

```js
let map = new Map();
let proxy = new Proxy(map, {
  get(target, prop, receiver) {
    let value = Reflect.get(...arguments);
    return typeof value == 'function' ? value.bind(target) : value;
  }
});

proxy.set('test', 1);
alert(proxy.get('test')); // 1（工作了！）
```

## Reflect对象
### Reflect对象引入的目的

Reflect对象是ES6新加入的一个内置对象，它的目的如下：

- 将原来Object中本来属于语言内部的一些方法，转移到Reflect对象上，未来的新的语言内部方法都只部署在Reflect对象上；
- 修改如defineProperty的某些Object方法的返回结果，使更合理；
- 把原来的delete obj， key in obj这类命令式操作，都转化为函数操作Reflect.deleteProperty()、Reflect.has()；
- ★Reflect对象的方法与Proxy对象的方法一一对应，只要是Proxy对象的方法，就能在Reflect对象上找到对应的方法。这就让Proxy对象可以方便地调用对应的Reflect方法，完成默认行为，作为修改行为的基础。

也就是说，不管Proxy怎么修改默认行为，你总可以在Reflect上获取原始的默认行为。

有了Reflect对象以后，很多操作会更易读。

###	Reflect静态方法

Reflect对象一共有 13 个静态方法。

- Reflect.apply(target, thisArg, args)
- Reflect.construct(target, args)
- Reflect.get(target, name, receiver)
- Reflect.set(target, name, value, receiver)
- Reflect.defineProperty(target, name, desc)
- Reflect.deleteProperty(target, name)
- Reflect.has(target, name)
- Reflect.ownKeys(target)
- Reflect.isExtensible(target)
- Reflect.preventExtensions(target)
- Reflect.getOwnPropertyDescriptor(target, name)
- Reflect.getPrototypeOf(target)
- Reflect.setPrototypeOf(target, prototype)

上面这些方法的作用，大部分与Object对象的同名方法的作用都是相同的，而且它与Proxy对象的方法是一一对应的。

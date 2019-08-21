---
layout: post
title: ECMAScript6 学习笔记
date: 2019-8-21
categories: blog
tags: [BLOG,JavaScript,FrontEnd,Web]
author: Mars
pIdentifier: 中文缩进
---
> 学习内容：[《ECMAScript 6 入门》 —— 阮一峰](http://es6.ruanyifeng.com/)

## 1. 块级作用域、let 与 const 声明变量
### 1.1 let 命令

- 只在其所在的代码块（花括号）内起作用；
- 可以用于声明`for`循环的计数器`i`，使得`i`只作用于`for`的代码块里，每一轮都生成新的`i`而不是将`i`泄露于全局；
- 不存在变量提升现象；
- 一旦`let`在块级作用域中声明，就与这个代码块绑定，外部同名变量不能在这个代码块内使用；
- 块级作用域在`let`声明前，对于同名变量是`"暂时性死区"`，不可使用，否则报错；
- `let`不允许在相同块级作用域内，重复声明同名变量；

### 1.2 块级作用域
- `ES6`引入了块级作用域，明确允许在块级作用域之中声明函数;
- `ES6`规定，块级作用域之中，函数声明语句的行为类似于let，在块级作用域之外不可引用;
- 应该避免在块级作用域内声明函数。如果确实需要，也应该写成函数表达式，而不是函数声明语句。

### 1.3 const 命令
- `const`声明一个只读的常量。一旦声明，常量的值就不能改变；
- `const`一旦声明变量，就必须立即初始化，不能留到以后赋值；
- 与`let`具有相同的属性；
- `const`实际上保证的，并不是变量的值不得改动，而是变量指向的那个内存地址所保存的数据不得改动。当`const`保存的是`基本类型变量`，可以保证其值不被修改。但如果保存的是对象等`引用类型变量`，因为本质上变量只是一个指向实际对象堆内存地址的指针，只能保证`const`变量所指向的内存地址固定，`const`声明不能约束指向的对象本身是否可改变（给`const`声明的对象修改属性是可以的）；

## 2. 解构赋值
### 2.1 数组解构赋值
~~~js
let [a,b,c] = [1,2,3];
~~~
按照先后位置给数组内变量赋予相应的值。
~~~js
let [x, y = 'b'] = ['a']; // x='a', y='b'
let [x, y = 'b'] = ['a', undefined]; // x='a', y='b'
~~~
可以给数组内元素设定默认值。当给变量赋予的值严格等于`undefined`时，默认值生效。
默认值也可以是函数，此时函数是`惰性求值`的，也就是说只有真的模式匹配失败变量被赋予默认值时才会执行。
### 2.2 对象解构赋值
~~~js
let { foo, bar } = { foo: 'aaa', bar: 'bbb' };
foo // "aaa"
bar // "bbb"
~~~
对象解构赋值的依据是对象的属性名，必须属性同名的变量才能发生赋值。

如果因找不到相同属性名而不能解构，则变量会被赋予`undefined`。

变量名也可以与属性名不一致，此时变量名必须作为属性的值在左边对象中标明。
~~~js
let { foo: baz } = { foo: 'aaa', bar: 'bbb' };
baz // "aaa"
let obj = { first: 'hello', last: 'world' };
let { first: f, last: l } = obj;
f // 'hello'
l // 'world'
~~~
对象的解构赋值也可以取到对象继承的属性。
### 2.3 字符串解构赋值
字符串可以像数组一样进行解构赋值，赋值规则是按先后位置。
~~~js
const [a, b, c, d, e] = 'hello';
a // "h"
b // "e"
c // "l"
d // "l"
e // "o"
~~~
### 2.4 数值、布尔值解构赋值
数值和布尔值，解构赋值会先转为对象。只能赋值其中的`toString`等属性。

`undefined`和`null`无法解构赋值，会报错。

### 2.5 函数参数的解构赋值
~~~js
function move({x = 0, y = 0} = {}) {
  return [x, y];
}

move({x: 3, y: 8}); // [3, 8]
move({x: 3}); // [3, 0]
move({}); // [0, 0]
move(); // [0, 0]
~~~
解释：函数的参数是一个对象`{x,y}`，`x`,`y`都有默认值`0`，函数参数对象的默认值是空对象`{}`。当函数未传入参数时，函数参数对象默认取值`{}`，则此时进行解构赋值，`x`，`y`都找不到同名属性用来赋值，则均取默认值`0`。因此输出为`[0,0]`。

### 2.6 解构赋值注意事项
- 尽量不要用圆括号`()`；
- 只有赋值语句的非模式部分才允许使用圆括号`()`。

## 3. 模板字符串
### 3.1 模板字符串说明
模板字符串（template string）是增强版的字符串，用反引号（\`）标识。它可以当作普通字符串使用，也可以用来定义多行字符串，或者在字符串中嵌入变量（用`${}`包裹）。
~~~js
let text = '我勒个去~';
`我说： ${text}`;  // 我说： 我勒个去~
~~~
模板字符串表示多行字符串，所有的空格和缩进都会被保留在输出之中。

`${}`中表示的变量可以进行运算，也可以引用对象的属性，或者调用函数。
~~~js
let x = 1;
let y = 2;

`${x} + ${y} = ${x + y}`
// "1 + 2 = 3"

`${x} + ${y * 2} = ${x + y * 2}`
// "1 + 4 = 5"

let obj = {x: 1, y: 2};
`${obj.x + obj.y}`
// "3"

function fn() {
  return "Hello World";
}

`foo ${fn()} bar`
// foo Hello World bar
~~~
模板字符串中引用未声明的变量，会报错。

模板字符串中的变量如果内部是一个字符串，则会原样输出。
### 3.2 标签模板字符串
所谓`标签模板字符串`，就是模板字符串跟在一个`函数名`后面。

当标签模板字符串中没有变量时，相当于`普通字符串`作为参数传入了函数并执行。、

~~~js
let a = 5;
let b = 10;

tag`Hello ${ a + b } world ${ a * b }`;
// 等同于
tag(['Hello ', ' world ', ''], 15, 50);
~~~
当标签模板字符串中含有变量，情况会变复杂。模板字符串中没被变量替换的部分会组合成一个字符串数组作为第一项参数传入。然后是各变量值作为独立参数依次传入。
~~~js
let total = 30;
let msg = passthru`The total is ${total} (${total*1.05} with tax)`;
function passthru(literals) {
  let result = '';
  let i = 0;
  while (i < literals.length) {
    result += literals[i++];
    if (i < arguments.length) {
      result += arguments[i];
    }
  }
  return result;
}
msg // "The total is 30 (31.5 with tax)"
~~~
解释：`passthru`函数只接受一个参数`literals`，而最后一行`msg`调用后传入了模板字符串<code>`The total is ${total} (${total*1.05} with tax)`</code>，由上一个例子，实际上是传入了`["The total is ", " (", " with tax)"],30,31.5`,而`literals`接受第一个赋值，被赋值`["The total is ", " (", " with tax)"]`。`arguments`则包含全部接收参数，为`["The total is ", " (", " with tax)"],30,31.5`。第七行的`i++`正好导致错开`arguments`里第一位的字符串数组，从而可以正确插入变量。
## 4. 字符串新增方法
### 4.1 String.raw()
`String.raw()`一般用于处理`模板字符串`，返回模板字符串的原始值，且其中的每一个斜杠都被转义，每一个变量都被替换完毕。
~~~js
String.raw`Hi\n${2+3}!`;
// 返回 "Hi\\n5!"

String.raw`Hi\u000A!`;
// 返回 "Hi\\u000A!"
~~~
### 4.2 String.fromCodePoint() 和 String.codePointAt() 
`String.fromCodePoint()`接受一个`Unicode 码点`，返回对应的实际字符，且可识别码点大于`0xFFFF`的字符。

如果接受的参数大于1个，则返回由参数码点实际字符组成的`字符串`。
~~~js
String.fromCodePoint(0x20CC5)
// "𠳅"
String.fromCodePoint(0x78, 0x1f680, 0x79) === 'x\uD83D\uDE80y'
// true
~~~
`String.codePointAt() `接受一个位置数值，返回该字符串位置的`Unicode码点`。

### 4.3 includes(), startsWith() 和 endsWith()
接受一个字符串，返回Boolean值。

`includes()`：检查`传入字符串`是否为`原字符串`的`子字符串`。

`startsWith()`：检查`原字符串`是否以`传入字符串`开头。

`endWith()`：检查`原字符串`是否以`传入字符串`结尾。

### 4.4 repeat()
`repeat()` 函数接受一个数值`N`，返回一个新字符串，表示将原字符串`重复N次`。

如果`N`为小数，则`向下取整`。如果`N`为负数，则报错。

### 4.5 padStart() 和 padEnd() 
~~~js
'x'.padStart(5, 'ab') // 'ababx'
'x'.padStart(4, 'ab') // 'abax'

'x'.padEnd(5, 'ab') // 'xabab'
'x'.padEnd(4, 'ab') // 'xaba'
~~~
`padStart()` 和 `padEnd()`接受两个参数，第一个为数值`N`，第二个为字符串`string`。

分别表示将原字符串调整为`N`位，不足的位数以`string`补齐。 `padStart()` 表示在原字符串前面补齐， `padEnd()`表示在原字符串后补齐。

如果只传入一个数值，则默认以`空格`补齐。
~~~js
'x'.padStart(4) // '   x'
'x'.padEnd(4) // 'x   '
~~~
如果用来补全的字符串与原字符串，两者的长度之和超过了最大长度，则会截去超出位数的补全字符串。
~~~js
'abc'.padStart(10, '0123456789')
// '0123456abc'
~~~
### 4.6 trimStart() 和 trimEnd()
用法同`trim()`，区别在于仅去除字符串前面或后面的空格。

### 4.7 matchAll()
`matchAll()`方法返回一个正则表达式在当前字符串的所有匹配。
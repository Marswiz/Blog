---
layout: post
title: 现代JS学习笔记：Module模块化
date: 2021-3-9
categories: blog
tags: [JavaScript]
author: Mars
pIdentifier: 中文缩进
---

> 学习内容：[《现代JavaScript教程》](https://zh.javascript.info/)

# 15	模块化Module

整个的长代码不易维护和重用，我们希望将一个单独的功能分离出来，使用时按需加载。这个分离的实现某个单一功能的代码就是模块。

一个模块可以包含用于特定目的的类或函数库。

## 15.1	历史上的JS模块

因为历史原因而存在的早期JS模块化系统，现在不应该再被使用。

- AMD —— 最古老的模块系统之一，最初由 require.js 库实现。
- CommonJS —— 为 Node.js 服务器创建的模块系统。
- UMD —— 另外一个模块系统，建议作为通用的模块系统，它与 AMD 和 CommonJS 都兼容。

## 15.2	同步模块与非同步模块

由于Node.js主要用于服务器编程，模块文件一般都已经存在于本地硬盘，所以加载起来比较快，不用考虑非同步加载的方式，所以CommonJS规范比较适用。

但是，如果是浏览器环境，要从服务器端加载模块，这时就必须采用非同步模式。

浏览器加载模块，异步方式更适用。

## 15.3	CommonJS模块系统

因为Node.js起初只能使用CommonJS模块，所以还是需要学习这个同步加载模块系统的使用方法。

[阮一峰：模块](https://javascript.ruanyifeng.com/nodejs/module.html)

**CommonJS的一些基本特性：**

- 每个文件是一个模块，具有独立的作用域。在每个文件内定义的变量都是自己私有的，外部不可访问；
- 如果想暴露变量给其他文件（模块），必须定义为global对象的属性；

> **不推荐。**暴露模块内变量为全局，违背模块化设计的初衷。

- 每个模块内部，module变量代表当前模块，相当于this；
- module的exports属性（即module.exports）是模块对外的接口。加载某个模块，其实是加载该模块的module.exports属性；
- 模块内使用require(<url>)来引入外部模块，它获取到的值是模块的module.exports，可以赋值给当前模块任意变量；
- 模块只会在第一次加载的时候运行一次，之后结果被缓存，不会再次运行。如果想要再次运行，必须清除缓存；
- 所有代码都运行在模块作用域，不会污染全局作用域；
- 模块加载的顺序，按照其在代码中出现的顺序；
- module是Module（）构造函数的实例，具有以下属性：
   - module.id 模块的识别符，通常是带有绝对路径的模块文件名。
   - module.filename 模块的文件名，带有绝对路径。
   - module.loaded 返回一个布尔值，表示模块是否已经完成加载。
   - module.parent 返回一个对象，表示调用该模块的模块。
   - module.children 返回一个数组，表示该模块要用到的其他模块。
   - module.exports 表示模块对外输出的值。
- 为了方便，Node为每个模块提供一个exports变量，指向module.exports。 这等同在每个模块头部，有一行这样的命令；
`let exports = module.exports;`
- require(<filename>)中的filename，如果没有扩展名，则默认为.js；
    > **根据参数的不同格式，require命令去不同路径寻找模块文件：**
    > 1. 如果参数字符串以“/”开头，则表示加载的是一个位于绝对路径的模块文件。比如，require('/home/marco/foo.js')将加载/home/marco/foo.js。
    > 2. 如果参数字符串以“./”开头，则表示加载的是一个位于相对路径（跟当前执行脚本的位置相比）的模块文件。比如，require('./circle')将加载当前脚本同一目录的circle.js。
    > 3. 如果参数字符串不以“./“或”/“开头，则表示加载的是一个默认提供的核心模块（位于Node的系统安装目录中），或者一个位于各级node_modules目录的已安装模块（全局安装或局部安装）。
    >
    > 举例来说，脚本/home/user/projects/foo.js执行了require('bar.js')命令，Node会依次搜索以下文件:
    > 
    >    1. /usr/local/lib/node/bar.js  【先寻找全局目录】
    >    2. /home/user/projects/node_modules/bar.js
    >    3. /home/user/node_modules/bar.js
    >    4. /home/node_modules/bar.js
    >    5. /node_modules/bar.js
    > 
    > 这样设计的目的是，使得不同的模块可以将所依赖的模块本地化。
    > 
    > 4. 如果参数字符串不以“./“或”/“开头，而且是一个路径，比如require('example-module/path/to/file')，则将先找到example-module的位置，然后再以它为参数，找到后续路径。
    > 5. 如果指定的模块文件没有发现，Node会尝试为文件名添加.js、.json、.node后，再去搜索。.js件会以文本格式的JavaScript脚本文件解析，.json文件会以JSON格式的文本文件解析，.node文件会以编译后的二进制文件解析。
    > 6. 如果想得到require命令加载的确切文件名，使用require.resolve()方法。
    >
    >
- require()中传入一个目录的时候，会按以下方式操作：
   1. 如果目录中存在package.json文件，则从中读取main字段用来确定入口文件；
   2. 如果目录中没有package.json或没配置main字段，就寻找index.js或index.node作为默认的入口文件。
- 所有缓存的模块保存在require.cache之中。如果想删除某一个加载过的模块的缓存，可以使用`delete require.cache[moduleName]`；
- CommonJS模块输出的内容，一旦被require()获取，就不再受到原模块内变量的影响；

## 15.4	ES6引入的JavaScript语言级模块（静态导入）

ES6之后引入了语言级Module语法：

- 使用import…from…引入模块；
- 使用export…导出模块内容；

> **注意：**
>
>如果在HTML文档中使用，必须在\<script\>标签内加上type=’module’，告诉浏览器这里的代码应该被当做module处理。
>
>import/export都只能使用在当前文件的顶级作用域上，在{}包裹的代码块内部无法使用import和export，会报错（比如if(){}这类）。

## 15.4.1	import

import有两种用法：
一是从export的内容中摘取某几个变量，使用花括号括起来利用对象的解构赋值规则进行赋值：
```js
import {a,b} from ‘./something.js’;
// 从something.js export的对象中找到键名为a,b的两个，然后赋值给前面对象,变量名还是a,b。
```
二是作为一个对象整体导入。使用import * as obj from…语法。
```js
import * as something from ‘./something.js’
// something有something.js中全部的方法，使用时用something.fun1()这样的语法结构。
import导入的时候也可以修改导入后的变量名。使用as关键字。
import {a as fun1} from ‘./something.js’;
//将something.js中的a方法导入为fun1使用。
```

## 15.4.2	export

可以在任何声明前加上export，表示对外部引用导出这个变量。
```js
export let a = 1;
export const b = 3.14;
export function fun1(){};
export class User{}
```

亦可以先声明，然后再统一导出。这里需要在导出的时候将他们汇总成一个对象。

```js
let a = 1;
const PI = 3.14;
function fun1(){};
export {a,PI,fun1};  //统一为一个对象导出
export也可以使用as关键字，为导出的变量另起一个名。
let a = 1;
export {a as goodBoy}; // 外面在import的时候，使用goodBoy进行匹配；
```

## 15.4.3	默认的export和import

使用export导出的数据，需要命名，且import导入的时候也需要用花括号内部使用同样的命名。

还有一种export方式，可以使得在import的时候无需使用花括号，也无需强制使用原来的命名，就是带有default的export。

```js
// default默认导出
export default class User{};
// 默认导入：无需花括号，也可以随便起名，User可以换成其他变量名。
import User from ‘User.js’;
```

> 本质上，export default是在导出的对象中创建了一个键名为default的属性，一旦检测到import未使用花括号，就默认把这个default的键值赋给外部。
>
> 默认导出这个方式存在争议，它给了导入的人员一定的命名权。
> 
> 一般来说使用带命名的导出更不容易出错。
> 
> 默认导出在使用export … from … 这个立即导入并导出语法的时候也存在问题。
>

## 15.4.4	导入并立即导出export … from …

当我们需要import一个文件，并立即将其导出export给其他文件使用时，可以简化写法：export … from …

export {User} from ‘User.js’；
// 表示从User.js导入User，并立即export {User}。

## 15.4.5	★动态导入

import…from… 称作静态导入，因为它from后面的必须是完整字符串，而不能是一个函数调用。而且也不能在代码块（如函数）内部使用，必须在顶级作用域声明。

> 这是因为 import/export 旨在提供代码结构的主干。
>
>这是非常好的事儿，因为这样便于分析代码结构，可以收集模块，可以使用特殊工具将收集的模块打包到一个文件中，可以删除未使用的导出（“tree-shaken”）。
>
>这些只有在 import/export 结构简单且固定的情况下才能够实现。
>
>

可以在import后加一个括号()，来进行动态的导入。

```js
import(‘./index.js’);
// 加载并返回一个promise对象，它被resolve为包含index.js所有导出的模块对象。
```

>尽管 import() 看起来像一个函数调用，但它只是一种特殊语法，只是恰好使用了括号（类似于 super()）。因此，我们不能将 import 复制到一个变量中，或者对其使用 call/apply。因为它不是一个函数。
>
>动态导入在常规脚本中工作时，它们不需要 \<script type="module"\>.

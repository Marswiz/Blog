---
layout: post
title: JavaScript 变量、作用域、和内存问题学习笔记
date: 2017-2-8
categories: blog
tags: [BLOG,JavaScript,FrontEnd]
description: He wants a more wonderful life.
header-img: "img/js.jpg"
titlecolor: black
tagcolor: black
---

<blockquote style="text-indent: 2em;">
	<b style="font-size: large;text-decoration: none; color: #222; font-style: normal;">
	《JavaScript 高级程序设计第四章》：变量值的基本类型和引用类型、类型检测、执行环境、作用域链、垃圾收集。
	</b><br>
	<b style="font-size: large;text-decoration: none; color: tomato; font-style: normal;">
	这应该是JavaScript最重要的部分，理解这些概念真的很重要。 ————2016.2.18
	</b>
<br><br>
	————2017.2.8 Mars 北航三馆314教研室
</blockquote>

<h1>1. 变量</h1>
<h2>1.1 JavaScript 的松散变量类型</h2>
JavaScript的变量是<code>松散类型</code>的：变量名称只是用于在特定时间内保存特定值的一个名字，并非定义某一类型变量必须存放该类型的数据。<br>
因此同一变量名的变量值和类型都可以在生存周期内被改变。

<h2>1.2 变量值的基本类型与引用类型</h2>
基本类型值：简单的数据段。（undefined\null\boolean\number\string），按值访问，操作的是保存在变量中的实际的值。<br>
引用类型值：保存在内存中的对象。JavaScript 不支持直接访问内存空间，操作对象访问的都是对象的引用。<br>
<blockquote>什么是引用？<br>引用可以理解为对象的另一个复制品，并且与对象捆绑，同时更改或变化。（就是对象的分身）</blockquote>

<h2>1.3 变量值的复制</h2>
<h3>1.3.1 基本类型值的复制</h3>
	var mars1=5;
	var mars2=mars1;

创建<code>mars2</code>之后，内存为其分配了新空间，并把<code>mars1</code>的值5和类型<code>number</code>复制到新空间中，从此<code>mars1</code>和<code>mars2</code>这两个变量互不干扰。<br>
<h3>1.3.2 引用类型值的复制</h3>
	var mars1 = new Object();
	var mars2 = mars1; // 复制mars1对象
	mars1.name = "mars1";
	alert(mars2.name); //mars1

<code>mars2</code>复制了<code>mars1</code>之后，实际上只是指向<code>mars1</code>所指向对象的一个指针被复制到<code>mars2</code>的新内存空间中，并不是<code>mars1</code>指向对象的实际值。所以复制之后，<code>mars1</code>与<code>mars2</code>共同指向同一个<code class="tooltip-mars" title="当我们在程序中创建一个对象时，这个对象将被保存到运行时数据区中，以便反复利用（因为对象的创建成本通常较大），这个运行时的数据区就是堆内存。堆内存中的对象不会随方法的结束而销毁。">堆内存</code>中的对象，所以<code>name属性</code>被同时修改了。

<h2>1.4 变量值向函数参数的传递</h2>
ECMAScript 所有函数的参数都是 <code>按值传递</code> 的。

<h3>1.4.1 基本类型值的传递</h3>
基本类型值在传递过程和基本类型值复制过程一样。函数内部对参数的操作不影响函数外部变量本体。
<h3>1.4.2 引用类型值的传递</h3>
引用类型值在传递给函数参数的时候是<b>按值传递</b>的，这个<b>值是原对象的内存地址</b>，因此函数参数在函数中的操作可以直接影响到外部的变量本体。<br>

	function mars1(obj){
	obj.name = "mars";
	}

	var mars2 = new Object();
	mars1(mars2);
	alert(mars2.name); // mars

<code>obj</code>是函数<code>mars1</code>的参数（局部变量），<code>mars2</code>的内存地址作为值传给<code>obj</code>在<code>mars1</code>中运算，增添了<code>name</code>属性，实际上就是增添了堆内存中<code>mars2</code>所代表对象的<code>name</code>属性。<br>

	function mars1(obj){
		obj.name = "mars";
		obj = new Object();
		obj.name = "whatthehell";
	}
	var mars2 = new Object();
	mars1(mars2);
	alert(mars2.name); //mars

上述例子表明，这种传递并不是<code class="tooltip-mars" title="引用可以理解为对象的另一个复制品，并且与对象捆绑，同时更改或变化。（就是对象的分身）">按引用传递</code>。<br>
如果是按引用传递，那么<code>mars2</code>的指向对象会随着<code>obj</code>（mars2指针）的重新赋值而随之指向新的对象，实际上并不会。<br>

<h2>1.5 类型检测</h2>
<h3>1.5.1 typeof() 操作符</h3>
<b>typeof() 操作符可以用来检测基本类型值。</b>

<code>typeof()</code>操作符是确定变量是<b>string、number、boolean、undefined</b>的最佳方法。用<code>typeof()</code>来检测<code>null</code>和<code>object</code>都会返回<code>Object</code>。<br>
<h3>1.5.2 instanceof 操作符</h3>
**用于检测引用类型值**，instanceof 根据原型链来识别。<br>

	alert(person instanceof Object); // true
	alert(colors instanceof Array); // true
	alert(pattern instanceof RegExp); // true

所有引用类型的值都是<code>Object</code> 的实例。<br>

<h1>2. 执行环境与作用域</h1>
<h2>2.1 执行环境</h2>
<code class="tooltip-mars" title="执行环境决定了变量或者函数能访问哪些变量数据，而访问顺序是由作用域链决定的。">执行环境</code>
<b>定义了变量或函数有权访问的其他数据，决定了它们各自的行为。</b><br>
每个执行环境都有一个与之关联的<code >变量对象</code>，环境中定义的所有变量和函数都保存在这个对象中。<br>
全局环境是最外层的执行环境。Web浏览器中是Windows对象，全局环境中的变量只有在应用程序退出（关闭浏览器或者网页）才会销毁。<br>
每执行一个函数，函数的执行环境就会被推入一个<code >环境栈</code>中，函数执行完毕，栈将其环境弹出，把控制权交给之前的执行环境。<br>
<h2>2.2 作用域链</h2>
<b><code class="tooltip-mars" title="作用域链指定了执行环境中可访问数据（变量或函数）的访问顺序。<br>作用域链实际上是一个指针列表，指向可访问的不同的对象。">作用域链</code>的作用是保证对执行环境有权访问的所有变量和函数的有序访问。</b><br>
作用域链的前端是当前执行的代码所在环境的变量对象，最后端是全局环境的变量对象。<br>
<h2>2.3 标识符解析</h2>
沿着作用域链一级一级搜索标识符的过程，从前端开始，一直到找到标识符为止。
<h2>2.4 if 和 for 语句中定义变量的注意事项</h2>
	
	var x=true;
	if(x){
		var y="mars";
	}
	alert(y); //mars
	
这里if语句内定义的变量y被保存在当前的执行环境（全局）中，所以在{}外面也可以访问。<br>

	for(var i=0;i<10;i++){
		...
	}
	alert(i);

这里i在for循环内定义，结束后并不会释放，因为在全局环境中。<br>

<h1>3. 垃圾收集与内存管理</h1>
垃圾收集的两种方式：<b>标记清除</b>和<b>引用计数</b>。<br>
所有浏览器都是用标记清除式的垃圾收集策略。<br>
<code >内存管理</code>:对所有的全局变量，在不再有用的时候应该设置为null以便使其<code >脱离工作环境让垃圾回收器回收</code>

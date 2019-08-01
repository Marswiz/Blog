---
layout: post
title: 理解 JavaScript 函数参数
date: 2017-2-5
categories: blog
tags: [BLOG,JavaScript,FrontEnd]
description: He wants a more wonderful life.
header-img: "img/js.jpg"
titlecolor: black
tagcolor: black
---

<blockquote>JavaScript 函数的参数在函数内部是用一个&nbsp;<code>arguments</code>&nbsp;数组表示的，因此一个函数输入任意多的参数都是可行的，甚至可以在内部通过&nbsp;<code>arguments</code>&nbsp;
访问这个函数参数。</blockquote>

	function doadd(){
		var sum=0;
		for (var i=0 ; i<arguments.length ; i++){
			sum += arguments[i];
		}
		return sum;
	}

以上函数实现了通过&nbsp;<code>doadd()</code>&nbsp;函数，计算任意多参数总和的功能。其中&nbsp;<code>arguments[i]</code>&nbsp;与函数的
第i+1个参数是相同的，在非严格模式下，修改&nbsp;<code>arguments[i]</code>&nbsp;的值等同于修改函数参数的值，但是这两个变量并不等同，不共用同一内存空间。<br><br>

在ECMAScript函数中，命名的参数只是提供便利，并不是必需的。（它利用数组保存传入的变量，随时可以通过<code>arguments[i]</code>(i从0开始)调用，无论命名与否。）<br><br>

因此，ECMAScript 函数并没有严格意义上的函数重载（根据不同的彼函数签名：接收的参数和类型——定义不同的函数。）的功能，但是可以通过检查传入函数中的参数的类型和数量，选择做出不同的反应，这类似于函数的重载。如下所示：<br><br>

	function abc(){
		if (arguments.length == 1){
		// do someting.
		}
		else if(arguments.length == 2){
		// do some other thing.
		}
		else {
		//do some other thing else.
		} 
	}
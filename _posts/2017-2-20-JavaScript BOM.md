---
layout: post
title: JavaScript BOM
date: 2017-2-20
categories: blog
tags: [BLOG,JavaScript,FrontEnd,BOM]
description: He wants a more wonderful life.
header-img: "img/js.jpg"
titlecolor: black
tagcolor: black
navtoggle: true
---

<blockquote style="text-indent: 2em;">
	<b style="font-size: large;text-decoration: none; color: #222; font-style: normal;">
	《JavaScript 高级程序设计第八章》：BOM</b>
<br><br>
	————2017.2.20 Mars 北航三馆314教研室
</blockquote>

<h1>BOM</h1>
<blockquote>
	<h3>什么是BOM？</h3>

	 <ul>BOM（Browser Object Document）即浏览器对象模型。
<li>	      BOM提供了独立于内容 而与浏览器窗口进行交互的对象；
	      </li>	      <li>由于BOM主要用于管理窗口与窗口之间的通讯，因此其核心对象是window；</li>
	      <li>BOM由一系列相关的对象构成，并且每个对象都提供了很多方法与属性；</li>
	      <li>BOM缺乏标准，JavaScript语法的标准化组织是ECMA，DOM的标准化组织是W3C，BOM最初是Netscape浏览器标准的一部分。</li></ul>
</blockquote>
<h2>1.窗口关系和框架</h2>
<code>window</code>:当前框架的Global对象<br>
<code>top</code>:最高层框架的Global对象<br>
<code>parent</code>:当前框架的直接上层框架<br>
<h2>1.窗口位置</h2>
<code>screenLeft</code>、<code>screenRight</code>、<code>screenX</code>、<code>screenY</code><br>
<h2>2.窗口大小</h2>
<code>innerWidth</code>、<code>outerWidth</code>、<code>innerHeight</code>、<code>OuterHeight</code><br>
<code>document.documentElement.clientWidth</code>、<code>document.documentElement.clientHeight</code>、<code>document.body.clientWidth</code>、<code>document.body.clientHeight</code><br>
<h2>3.导航和打开窗口</h2>
<code>window.open("url","_target");</code>
返回新打开标签页的指针。可以这样跟踪新标签页：<br>
<code>var newTag = window.open("www.marswiz.com","_blank");</code>
关闭新标签页：<br>
<code>newTag.close();</code>
默认由一个页面打开的另一个页面，新页面保存着<code>opener</code>属性以建立联系，彼此通信。<br>
设置<code>newTag.opener = null</code>切断联系，让新页面独立运行。
<h2>4.间歇调用和超时调用<span style="border-style: dashed;border-width: 1px;border-radius: 3px;border-color: tomato;color: tomato;font-weight: bold;">&nbsp;重点&nbsp;</span></h2>
<b>超时调用：</b><code>setTimeOut()</code><br>
接受两个参数：第一个是包含要执行的JavaScript的字符串或者一个函数。第二个是要等待多长时间的毫秒数。
	
	//不推荐
    setTimeout("alert('Hello world!') ", 1000);
    
    //推荐
    setTimeout(function() { 
        alert("Hello world!"); 
    }, 1000);

<blockquote>
<h3>为啥时间到了也不一定执行？</h3>
JavaScript是一个单线程的解释器，为控制要执行的代码，就有一个JavaScript任务队列，这些任务会按照他们添加到队列的顺序执行。<code>setTimeOut()</code>第二个参数告诉JavaScript再过多长时间把当前任务添加到队列。如果队列是空的，添加的代码会立即执行。如果队列不是空的，要等前面的代码都执行完毕才会执行。
</blockquote>
<b>间歇调用：</b><code>setInterval()</code><br>
用法与<code>setTimeOut()</code>相同，到时间间隔重复执行代码。<br>
<h2>5.系统对话框</h2>
<code>alert()</code>：显示一个提示框，只有一个OK按钮。
<br>
<code>confirm()</code>：用于确认，有Ok和cancel两个按钮。会返回boolean值，ok-ture,cancel-false。
<br>
<code>prompt()</code>:向用户提出一个问题并让用户输入结果，最后返回值。
<br>
<h2>6.location 对象<span style="border-style: dashed;border-width: 1px;border-radius: 3px;border-color: tomato;color: tomato;font-weight: bold;">&nbsp;重点&nbsp;</span></h2>
location对象既是window对象的属性，也是document对象的属性。<br>
保存着当前文档的信息，还将URL解析为独立的片段，让开发人员可以通过不同的属性访问这些片段。<br>
每次修改location对象属性，页面会以新的URL重新加载。
<br>location方法：<br><code>replace()</code>，传入一个url并且直接转到，且无法后退。<br>
<code>reload()</code>：以最有效的方式重新加载当前页面，如果传入参数<code>true</code>，则强制重新加载。<br>
<h2>7.navigator对象</h2>
识别客户端浏览器的标准。常用来检测浏览器类型。
常用功能：<br>
<h3>7.1 检测插件</h3>
利用<code>navigator.plugins</code>数组，每一项都包含<code>name</code>
<code>description</code>
<code>filename</code>
<code>length</code>四个属性。

	//plugin detection - doesn't work in IE
        function hasPlugin(name){
            name = name.toLowerCase();
            for (var i=0; i < navigator.mimeTypes.length; i++){
                if (navigator.mimeTypes[i].name.toLowerCase().indexOf(name) > -1){
                    return true;
                }
            }
        
            return false;
        }
        
    //detect flash
    alert(hasPlugin("Flash"));
    
    //detect quicktime
    alert(hasPlugin("QuickTime"));
    
    //detect Java
    alert(hasPlugin("Java"));
<h2>8.screen 对象</h2>
保存浏览器窗口外部显示器的信息。
<h2>9.history 对象</h2>
保存着用户的上网记录，从<code>window</code>被打开的一刻算起。<br>
常用方法：<br>
<code>history.go()</code>按历史记录跳转。接受一个数值，正数表示向前，负数表示向后。<br>
<code>history.back()</code>向后<br>
<code>history.forward()</code>向前<br>


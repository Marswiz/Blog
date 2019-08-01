---
layout: post
title: JavaScript 能力检测与怪癖检测
date: 2017-2-21
categories: blog
tags: [BLOG,JavaScript,FrontEnd]
description: He wants a more wonderful life.
header-img: "img/js.jpg"
titlecolor: black
tagcolor: black
navtoggle: true
---

<blockquote style="text-indent: 2em;">
	《JavaScript 高级程序设计第九章》：能力检测、怪癖检测
<br><br>
	<p class="info">———— 2017.2.21 Mars 北航三馆314教研室</p>
</blockquote>
<h2>1.浏览器能力检测</h2>
<b>能力检测</b>是检测浏览器是否有执行某一特定方法的能力。检测时要先检测最常用的特性，这样可以避免测试多个条件增加执行速度。

模式：<br>

    if(object.property){
        //能力可行的代码
    } else {
        //能力不可行的代码
    }

例如：<br>

    function getElement(id){
        if (document.getElementById){
        return document.getElementById(id);
    } else if (document.all){
        return document.all(id);
    } else {
        throw new Error("No way to get element by ID.");
    }
    }

另外，尽量使用<code>typeof</code>操作符检测能力。

    function hascreateElement(){
        return typeof document.createElement == "function";
    }

但是ie浏览器早期版本返回的很可能不是function。
<h2>2.怪癖（quirks）检测</h2>
测试某个浏览器是否有某种潜在的BUG。<br>

    var hasDontEnumQuirk = function(){        
        var o = { toString : function(){} };
        for (var prop in o){
            if (prop == "toString"){
                return false;
            }
        }    
        return true;
    }();

检测是否有与原型不可枚举属性同名的实例属性不可枚举的BUG。
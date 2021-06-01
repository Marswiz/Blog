---
layout: post
title: JavaScript BOM
date: 2017-2-20
categories: blog
tags: [JavaScript,BOM]
author: Mars
pIdentifier: 全缩进
---
> 《JavaScript 高级程序设计第八章》：BOM
>> ————2017.2.20 Mars 北航三馆314教研室


## BOM

>**什么是BOM？**
- BOM（Browser Object Document）即浏览器对象模型。
- BOM提供了独立于内容 而与浏览器窗口进行交互的对象；
- 由于BOM主要用于管理窗口与窗口之间的通讯，因此其核心对象是window；
- BOM由一系列相关的对象构成，并且每个对象都提供了很多方法与属性；
- BOM缺乏标准，JavaScript语法的标准化组织是ECMA，DOM的标准化组织是W3C，BOM最初是Netscape浏览器标准的一部分。

## 1.窗口关系和框架
`window`:当前框架的Global对象<br>
`top`:最高层框架的Global对象<br>
`parent`:当前框架的直接上层框架
## 1.窗口位置
`screenLeft`、`screenRight`、`screenX`、`screenY`
## 2.窗口大小
`innerWidth`、`outerWidth`、`innerHeight`、`OuterHeight`、`document.documentElement.clientWidth`、`document.documentElement.clientHeight`、`document.body.clientWidth`、`document.body.clientHeight`
## 3.导航和打开窗口
`window.open("url","_target");`

返回新打开标签页的指针。可以这样跟踪新标签页：<br>
`let newTag = window.open("www.marswiz.com","_blank");`

关闭新标签页：<br>
`newTag.close();`

默认由一个页面打开的另一个页面，新页面保存着`opener`属性以建立联系，彼此通信。<br>
设置`newTag.opener = null`切断联系，让新页面独立运行。
## 4.间歇调用和超时调用<span style="border-style: dashed;border-width: 1px;border-radius: 3px;border-color: tomato;color: tomato;font-weight: bold;">&nbsp;重点&nbsp;</span>
**超时调用：**`setTimeOut()`
接受两个参数：第一个是包含要执行的JavaScript的字符串或者一个函数。第二个是要等待多长时间的毫秒数。
	
	//不推荐
    setTimeout("alert('Hello world!') ", 1000);
    
    //推荐
    setTimeout(function() { 
        alert("Hello world!"); 
    }, 1000);


>**为啥时间到了也不一定执行？**<br>
JavaScript是一个单线程的解释器，为控制要执行的代码，就有一个JavaScript任务队列，这些任务会按照他们添加到队列的顺序执行。`setTimeOut()`第二个参数告诉JavaScript再过多长时间把当前任务添加到队列。如果队列是空的，添加的代码会立即执行。如果队列不是空的，要等前面的代码都执行完毕才会执行。

**间歇调用：**`setInterval()`
用法与`setTimeOut()`相同，到时间间隔重复执行代码。
## 5.系统对话框
`alert()`：显示一个提示框，只有一个OK按钮。

`confirm()`：用于确认，有Ok和cancel两个按钮。会返回boolean值，ok-ture,cancel-false。

`prompt()`:向用户提出一个问题并让用户输入结果，最后返回值。

## 6.location 对象<span style="border-style: dashed;border-width: 1px;border-radius: 3px;border-color: tomato;color: tomato;font-weight: bold;">&nbsp;重点&nbsp;</span>
location对象既是window对象的属性，也是document对象的属性。
保存着当前文档的信息，还将URL解析为独立的片段，让开发人员可以通过不同的属性访问这些片段。
每次修改location对象属性，页面会以新的URL重新加载。
location方法：`replace()`，传入一个url并且直接转到，且无法后退。
`reload()`：以最有效的方式重新加载当前页面，如果传入参数`true`，则强制重新加载。
## 7.navigator对象
识别客户端浏览器的标准。常用来检测浏览器类型。
常用功能：
### 7.1 检测插件
利用`navigator.plugins`数组，每一项都包含`name`
`description`
`filename`
`length`四个属性。

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

## 8.screen 对象
保存浏览器窗口外部显示器的信息。

## 9.history 对象
保存着用户的上网记录，从`window`被打开的一刻算起。

常用方法：

`history.go()`按历史记录跳转。接受一个数值，正数表示向前，负数表示向后。<br>
`history.back()`向后<br>
`history.forward()`向前


---
layout: post
title: JavaScript一些内置API
date: 2021-6-1
categories: blog
tags: [JavaScript]
author: Mars
pIdentifier: 中文缩进
---

> JavaScript一些内置API： 
>
> 跨文档通信API、FIle API、媒体元素API、拖放API、Page Visibility API、Performance API、Web组件 API 

# 1. 跨文档通信API

主要是全局对象的`postMessage()`方法。

用于窗口间通信，或工作线程之间的通信。

# 1.1 postMessage()方法的使用

postMessage()方法接受三个参数：**①消息本体； ②一个表示消息接受目标页面【源】的字符串； ③(与web worker相关)可传输对象数组；**

> 其中第二个参数非常重要，发动消息的目标页面只有在与这个参数同源的情况下才能正常收到message。这是一种保护策略。

# 1.2 目标页面的响应事件

目标页面在成功接收postMessage发来的消息后，在自身window对象上会触发**message**事件（异步，因为传输可能会有时延）。

message的事件对象event具有下列信息：

- data: 传输的消息本体；
- origin：发送消息的文档的源；
- source：发送消息的文档的window的代理对象，主要用来向消息来源页面回复消息source.postMessage()。

# 1.3 跨文档通信的注意事项

postMessage的第二个参数可以保证接收页面的源，接收页面在收到消息后也应该对消息的来源event.origin进行检查，确保来自可信的地方。

# 2. File API

File API用于访问并处理用户本地的文件。

# 2.1 获取本地文件的方式

获取文件的方式主要有两种：

1. 文件类型input元素：<input type="file">
2. 文件拖放

# 2.1.1 文件类型input元素

```html
<input type="file">
```

文件类型的input元素，本身具有files属性，里面包含了用户选择的文件集合（FileList类实例）。

其中的每个file可以通过索引获取，每个file对象都包含如下基本信息:

- name: 本地系统中的文件名；
- size: 文件体积（字节）；
- type: MIME类型（字符串）；
- lastModifiedDate：文件最后修改的时间（字符串）。

获取文件的详细内容，必须使用下面的文件读取器FileReader。

# 2.1.2 文件拖放

拖放本地文件到页面，在drop的事件对象`event.dataTransfer.files`中获取文件列表。

# 2.2 FileReader 文件读取器

FileReader用于异步读取本地文件内容，可以选择多种读取类型。

FileReader为全局构造函数，使用前需要先实例化。

```js
const reader = new FileReader()
```

FileReader实例具有下列方法：

- readAsText(file,encoding)： 读取文件为文本；
- readAsDataURL(file)：读取文件为内容的URL；
- readAsBinaryString(file)：读取文件为二进制数据；
- readAsArrayBuffer(file)：读取文件为ArrayBuffer。

FileReader实例读取文件过程中会有如下几个事件：

- progress: 每50ms触发一次，与XHR对象的progress事件相同，用来反馈文件读取的进度；
- error： 读取文件发生错误时触发；
- load： 读取文件完成后触发。

文件读取结果在reader.result中获取。因为文件读取是异步操作，需要在reader的load事件回调中获取reader.result。

```js
reader.addEventListener('load',e=>{
    console.log(reader.result)
})
```

# 2.3 对象URL

访问本地文件时，可以不读取文件内容到JavaScript，而是通过内存地址直接访问内存中的文件。这就是文件的对象URL（也叫Blob URL）

```js
// 为文件创建对象URL：返回指向文件内存地址的URL
window.URL.createObjectURL(file)
```

使用这个URL，浏览器可以直接从本地相应的内存位置获取文件，并读取到页面上，不用像FileReader那样预先读取到JS中。


# 3. 媒体元素API



# 4. 拖放API



# 5. Page Visibility API



# 6. Performance API



# 7. Web组件 API 








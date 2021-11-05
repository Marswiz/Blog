---
layout: post
title: Web Socket协议
date: 2021-11-1
categories: blog
tags: [Network]
author: Mars
pIdentifier: 中文缩进
---

> Web Socket协议

# Web Socket 协议诞生的原因（相比于http的优势）

1. **WS支持服务端推送**: http协议中，请求只能由客户端发起，无法进行服务端推送（获取实时信息只能轮询，浪费网络资源）；
2. **WS在建立连接之后，数据包头部字段较轻**: http协议每次都要携带完整头部，字节数较大。
3. **WS支持二进制流式传输**；
4. **WS可扩展，用于实现自定义的子协议**。

# Web Socket的应用场景

即时通讯应用，即时音视频

# Web Socket连接的建立

WebSocket复用HTTP的握手通道。客户端通过HTTP请求与WebSocket服务端协商升级协议。

协议升级完成后，后续的数据交换则遵照WebSocket的协议。

步骤如下：

## 1. 客户端申请协议升级

客户端向服务器发送http请求，头部如下：

```http
GET / HTTP/1.1
Host: localhost:8080
Origin: http://127.0.0.1:3000
Connection: Upgrade
Upgrade: websocket
Sec-WebSocket-Version: 13
Sec-WebSocket-Key: w4v7O6xFTi36lq3RNcgctw==
```

其中有四个关键头部：

- `Connection: Upgrade`：表示要升级协议
- `Upgrade: websocket`：表示要升级到websocket协议。
- `Sec-WebSocket-Version: 13`：表示websocket的版本。如果服务端不支持该版本，需要返回一个Sec-WebSocket-Versionheader，里面包含服务端支持的版本号。
- `Sec-WebSocket-Key`：与后面服务端响应首部的Sec-WebSocket-Accept是配套的，提供基本的防护，比如防止恶意的连接，或者无意的连接。

## 2. 服务端响应协议升级请求

```http
HTTP/1.1 101 Switching Protocols
Connection:Upgrade
Upgrade: websocket
Sec-WebSocket-Accept: Oy4NRAQ13jhfONC7bP8dTKb4PTU=
```
其中的`Sec-WebSocket-Accept`字段，是根据请求的`Sec-WebSocket-Key`首部计算出来的，计算的方法如下：

> 1. 将`Sec-WebSocket-Key`跟`258EAFA5-E914-47DA-95CA-C5AB0DC85B11`字符串拼接。
> 
> 2. 通过`SHA1`计算出摘要，并转成`base64`字符串。

# Web Socket 的数据帧格式

WebSocket客户端、服务端通信的最小单位是帧（frame），由1个或多个帧组成一条完整的消息（message）。

- **发送端**：将消息切割成多个帧，并发送给服务端；
- **接收端**：接收消息帧，并将关联的帧重新组装成完整的消息；



# 参考资料

[WebSocket：5分钟从入门到精通](https://juejin.cn/post/6844903544978407431#heading-8)
---
layout: post
title: Bootstrap 响应式导航类
date: 2017-1-23
categories: blog
tags: [Bootstrap]
author: Mars
pIdentifier: 中文缩进
---
>Bootstrap 响应式导航条由两部分组成，最外层是<code><nav></code>元素，类名为:<code>.nav .nav-default</code><code><nav></code>标签后，两个部分class分别是<code>.navbar-header</code>和<code>.navbar-collapse .collapse</code> <br>


	<nav class="navbar navbar-default navbar-fixed-top">
	<div class="navbar-header">
		<button type="button" class="navbar-toggle" data-toggle="collapse" data-target=".navbar-collapse">
			<!-- toggle按钮的三个短横线 -->
			<span class="icon-bar"></span>
			<span class="icon-bar"></span>
			<span class="icon-bar"></span>
		</button>
		<!-- navbar 标题/logo -->
		<a href="#" class="navbar-brand">Project</a>
	</div>
	<!-- 要折叠的navbar区域 -->
	<div class="navbar-collapse collapse">
		<ul class="nav navbar-nav pull-right">
			<li class="active"> <a href="#">1</a></li>
			<li> <a href="#">2</a></li>
			<li> <a href="#">3</a></li>
		</ul>
	</div>
    </nav>


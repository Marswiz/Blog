---
layout: post
title: jQuery 快速title提示器
date: 2016-12-26
categories: blog
tags: [BLOG,jQuery,Codes,Web,FrontEnd]
author: Mars
pIdentifier: 中文缩进
---
 
    // By MarsYao 20161225
    // jQuery 快速title提示器
    // 用法： 
    // 文字：提示内容加在title属性里， 需要快速提示的元素加class="tooltip"
    // 图片：用一a元素包裹img元素，img中链接缩略图，a元素href链接大图。tooltip class给a元素即可.
    $(function(){
    
    $(".tooltip")
    .mouseover(function(e) {
      this.myTitle = this.title;  //用myTitle 替代原来的 title ， 防止原提示干扰。
      this.title = "";
      var x = 10 , y = 20;        //防止遮盖原内容设置的偏移量

    //用于文字提示器
    // var tooltip = "<div id='tooltip'>" + this.myTitle + "</div>"; 

    //用于图片放大提示器
      var tooltip = "<div id='tooltip'>" 
        + "<img src='" + this.href+ "'>" 
        +"<div>" + this.myTitle + "</div>"
         + "</div>"; 

      $("body").append(tooltip);
      $("#tooltip")
          .css({                          // toolbar CSS 样式
            "position": "absolute",
            "border-style":"solid",
            "border-width":"2px",
            "top" : ( e.pageY + y ) + "px",
            "left": ( e.pageX + x ) + "px",
                "text-align":"center",
                "background-color":""
      }).show("fast");
    })
    .mouseout(function(){
      this.title = this.myTitle;
      $("#tooltip").remove();
    })
    .mousemove(function(e) {               //跟随鼠标移动的Toolbar.
    var x = 10 , y = 20;
    $("#tooltip")
          .css({
            "position": "absolute",
            "border-style":"solid",
            "border-width":"2px",
            "top" : ( e.pageY + y ) + "px",
            "left": ( e.pageX + x ) + "px"
      });     
    });
    });
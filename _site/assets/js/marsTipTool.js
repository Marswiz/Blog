//  tooltip 快速提示器
$(function(){

$(".tooltip-mars")
.mouseover(function(e) {
  this.myTitle = this.title;  //用myTitle 替代原来的 title ， 防止原提示干扰。
  this.title = "";
  var x = 10 , y = 20;        //防止遮盖原内容设置的偏移量

//用于文字提示器
var tooltip = "<div id='tooltip'><i class='fa fa-key'>&nbsp;:&nbsp;</i>" + this.myTitle + "</div>"; 
//文字提示end

  $("body").append(tooltip);
  $("#tooltip")
      .css({                          // toolbar CSS 样式
        "position": "absolute",
        "border-style":"dashed",
        "border-radius":"3px",
        "padding":"5px",
        "border-width":"0.1em",
        "border-color":"#bdb7b1",
        "color":"#bdb7b1",
        "top" : ( e.pageY + y ) + "px",
        "left": ( e.pageX + x ) + "px",
        "text-align":"left",
        "background-color":"white"
  }).show("fast");
})
.mouseout(function(){
  this.title = this.myTitle;
  $("#tooltip").remove();
})
.mousemove(function(e){               //跟随鼠标移动的Toolbar.
var x = 10 , y = 20;
console.log('chufa');
$("#tooltip")
      .css({
        "position": "absolute",
        "border-style":"dashed",
        "border-width":"1px",
        "top" : ( e.pageY + y ) + "px",
        "left": ( e.pageX + x ) + "px"
  });     
});
});
// tooltip 快速提示器 End
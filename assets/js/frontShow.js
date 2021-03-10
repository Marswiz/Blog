// 首页展示滚动Js
// 2019-07-25 MarsWiz
// 
// 功能：FrontShow时下滑滚轮可直接跳转到日志概览区；
// 从日志概览区上滑滚轮可直接到页首FrontShow区，避免处于两部分之间的尴尬区域。

// 兼容FireFox,统一wheelDelta值
	 let getWheelDelta = function(event) {
	    return event.wheelDelta || (-event.detail * 40);
	 }
// 兼容FireFox，改变滚轮事件名称
	let wheelEvent = function(){
		if (typeof window.onmousewheel == 'object'){
			return 'mousewheel';
		} else {
			return 'DOMMouseScroll';
		}
	}

// 跳转函数
	function topScroll(e){
				console.log(getWheelDelta(e))
;				// 监听鼠标滚轮向下滚动
				if((getWheelDelta(e) == -120 || getWheelDelta(e) == -150 || getWheelDelta(e) == -210) && window.innerWidth >= 768){
				// 跳转到frontContentBox
					e.preventDefault();			
					window.scrollTo(0,document.querySelector('#frontShow').offsetHeight);
				// 变换导航栏显示
				// 	$('#navFront').hide();
				// 	$('#navBlog').show();
					navToWhite();
					return window.removeEventListener(wheelEvent(),topScroll,passiveSupported ? { passive: false } : false);			
				}
	}

// 判断滚动位置并作出响应
	function frontScroll(){
		if (window.scrollY <= 10) {
			// e.preventDefault();
			window.addEventListener(wheelEvent(),topScroll,passiveSupported ? { passive: false } : false);
		} else if (window.scrollY > 10 && window.scrollY < document.querySelector('#frontShow').offsetHeight-50){
			window.scrollTo(0,0);
			// 变换导航栏显示			
			navToBlack();
			$('#frontPageInfo').hide();
			$('#tagBox').hide();
			$('#frontPageInfo').slideDown(1500);
			$('#tagBox').slideDown(500);
		}
	}

// 在存在FrontShow组件时加载
	if (document.querySelector('#frontShow')){
		// 页面加载后监听FrontScroll
		window.addEventListener('load',frontScroll,passiveSupported ? { passive: false } : false);
		// 滚动时监听FrontScroll
		window.addEventListener('scroll',frontScroll,passiveSupported ? { passive: false } : false);
	}

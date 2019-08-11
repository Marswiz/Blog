// 检测浏览器是否支持Passive Event Listener:
// Chrome 56+ 版本会默认把绑定在window、body、document等上的scroll mousewheel touchmove等默认设置为passive event listener以提高性能
// passive event listener中不能调用 preventDefault,  会被忽略并报错;
	let passiveSupported = false;

	try {
	  let options = Object.defineProperty({}, "passive", {
	    get: function() {
	      passiveSupported = true;
	    }
	  });

	  window.addEventListener("test", null, options);
	} catch(err) {}


// 阻止浏览器自带后退，防止夸克浏览器、安卓自带浏览器的右滑手势操作。
	history.pushState(null, null, document.URL);
	window.addEventListener('popstate', function () {
		history.pushState(null, null, document.URL);
	});
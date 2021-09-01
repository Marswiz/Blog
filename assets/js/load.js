if (window.innerWidth <= 768){
	window.addEventListener('load',loadDayNight,false);
}
window.addEventListener('load',navFunc,false);
window.addEventListener('load',postsFunc,false);
window.addEventListener('load',pagnaterFunc,false);

// 屏幕大小变化时候的调整
window.addEventListener('resize',(e)=>{
	// 手机横转竖的操作
	// and 把PC的导航栏去掉
	if (window.innerWidth <= 768){
		window.addEventListener('touchstart',getStartPoint,passiveSupported ? { passive: false } : false);
		window.addEventListener('touchend',getEndPoint,passiveSupported ? { passive: false } : false);
		window.addEventListener('gesturestart',gestureDetected,false);
		document.querySelector('#navBlog').style.display = 'none';
	} else {
		document.querySelector('#navBlog').style.display = 'block';
	}
});

let touchstartPosX = 0;
let touchendPosX = 0;

function navMoveFunc(e){	
	if ((touchendPosX-touchstartPosX) >= 0.2*window.innerWidth && touchstartPosX >= 0.1*window.innerWidth){
		let a = document.querySelectorAll('#navMobile,#navMobile #navBlur,#navMobile #navTrans');
		for (let i=0; i<a.length; i++){
			a[i].style.animation = 'navMove 0.5s ease-in forwards';
		}
		console.log('Go'); 
	} else if ((touchendPosX-touchstartPosX) <= -0.2*window.innerWidth){
		let a = document.querySelectorAll('#navMobile,#navMobile #navBlur,#navMobile #navTrans');
		for (let i=0; i<a.length; i++){
			a[i].style.animation = 'navMoveBack 0.5s ease-in forwards';
		}
		console.log('Back'); 
	}
	touchstartPosX = 0;
	touchendPosX = 0;
	console.log('Reset to Null'); 
}

function getStartPoint(e){
		if (e.touches.length == 1){
			touchstartPosX = e.touches[0].clientX;
			console.log(e);
			console.log('start point'+ touchstartPosX);
		}

		//添加触摸结束事件监听器
		document.body.addEventListener('touchend',navMoveFunc,false);
}

function gestureDetected(e){	
	console.log(e);
	console.log('手势检测到啦！');
	return document.body.removeEventListener('touchend',navMoveFunc,false);
}

function getEndPoint(e){
		if(e.changedTouches.length == 1){
			touchendPosX = e.changedTouches[0].clientX;
			console.log(e);
			console.log('end point' + touchendPosX);
		}
}

if (window.innerWidth <= 768){
	document.body.addEventListener('touchstart',getStartPoint,false);
	document.body.addEventListener('touchend',getEndPoint,false);
	document.body.addEventListener('gesturestart',gestureDetected,false);
}
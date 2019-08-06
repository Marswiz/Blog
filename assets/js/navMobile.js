let touchstartPosX = 0;
let touchendPosX = 0;

function getStartPoint(e){
		if (e.touches.length == 1){
			touchstartPosX = e.touches[0].clientX;
			console.log(e);
			console.log('start point'+ touchstartPosX);
		}
}

function getEndPoint(e){
		if(e.changedTouches.length == 1){
			touchendPosX = e.changedTouches[0].clientX;
			console.log(e);
			console.log('end point' + touchendPosX);
		}
}

function navMoveFunc(e){	
	if ((touchendPosX-touchstartPosX) >= 0.2*window.innerWidth && e.changedTouches.length == 1){
		let a = document.querySelectorAll('#navMobile,#navMobile #navBlur,#navMobile #navTrans');
		for (let i=0; i<a.length; i++){
			a[i].style.animation = 'navMove 0.5s ease-in forwards';
		}
		console.log('Go'); 
	} else if ((touchendPosX-touchstartPosX) <= -0.2*window.innerWidth && e.changedTouches.length == 1){
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

if (window.innerWidth <= 768){
	document.body.addEventListener('touchstart',getStartPoint,false);
	// window.addEventListener('touchmove',navMobileFunc,false);
	document.body.addEventListener('touchend',getEndPoint,false);
	document.body.addEventListener('touchend',navMoveFunc,false);
}
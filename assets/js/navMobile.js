let touchstartPosX,touchendPosX = -100;

function navMobileFunc(e){
	if (window.innerWidth <= 768){
		if (e.type == 'touchstart'){
			touchstartPosX = e.changedTouches[0].clientX; 
		} else if (e.type == 'touchend'){
			touchendPosX = e.changedTouches[0].clientX;
		}

		if ((touchendPosX-touchstartPosX) >= 0.2*window.innerWidth){
			let a = document.querySelectorAll('#navMobile,#navMobile #navBlur,#navMobile #navTrans');
			for (let i=0; i<a.length; i++){
				a[i].style.animation = 'navMove 0.5s ease-in forwards';
			}
		}

		if ((touchendPosX-touchstartPosX) <= -0.2*window.innerWidth && touchendPosX > 0){
			let a = document.querySelectorAll('#navMobile,#navMobile #navBlur,#navMobile #navTrans');
			for (let i=0; i<a.length; i++){
				a[i].style.animation = 'navMoveBack 0.5s ease-in forwards';
			}
		}
		
		touchstartPosX,touchendPosX = -100;		
	}
}

if (window.innerWidth <= 768){
	window.addEventListener('touchstart',navMobileFunc,false);
	window.addEventListener('touchend',navMobileFunc,false);
}
// navBlog 选择变色
function blackToBlue(e){
	let a = e.target.src.replace(/Black/,'Blue');
	e.target.src = a;
}

function blueToBlack(e){
	let a = e.target.src.replace(/Blue/,'Black');
	e.target.src = a;
}

// logo变色
function blackToWhite(e){
	let a = e.target.src.replace(/Black/,'White');
	e.target.src = a;
}

function whiteToBlack(e){
	let a = e.target.src.replace(/White/,'Black');
	e.target.src = a;
}

// nav toggle func
function navToWhite(){
	document.querySelector('#navBlog').classList.remove('navHidden');
	document.querySelector('#navFront').classList.remove('navShown');
	document.querySelector('#navFront').classList.add('navHidden');
	document.querySelector('#navBlog').classList.add('navShown');
}
function navToBlack(){
	document.querySelector('#navFront').classList.remove('navHidden');
	document.querySelector('#navBlog').classList.remove('navShown');
	document.querySelector('#navBlog').classList.add('navHidden');
	document.querySelector('#navFront').classList.add('navShown');
}

function navFunc(){
	if (window.innerWidth >= 768){
		// 在日志页刷新后防止导航栏切换回渐变
		if (document.querySelector('#frontShow')){
			if(window.scrollY >= document.querySelector('#frontShow').clientHeight-2){
				navToWhite();
				console.log('nav.js 变白');
			} else {
				navToBlack();
				$('#frontPageInfo').slideDown(1500);
				$('#tagBox').slideDown(500);
				console.log('nav.js 变黑');
			}
		} else {
			document.querySelector('#navBlog').classList.remove('navHidden');
			document.querySelector('#navBlog').classList.add('navShown');
			console.log('nav.js 变白');
		}
	}
}


// 改变颜色
	document.querySelector('#blogBtn img').addEventListener('mouseover',blackToBlue,false);
	document.querySelector('#tagBtn img').addEventListener('mouseover',blackToBlue,false);
	document.querySelector('#aboutMeBtn img').addEventListener('mouseover',blackToBlue,false);
	document.querySelector('#searchBtn img').addEventListener('mouseover',blackToBlue,false);
	document.querySelector('#blogBtn img').addEventListener('mouseout',blueToBlack,false);
	document.querySelector('#tagBtn img').addEventListener('mouseout',blueToBlack,false);
	document.querySelector('#aboutMeBtn img').addEventListener('mouseout',blueToBlack,false);
	document.querySelector('#searchBtn img').addEventListener('mouseout',blueToBlack,false);

// logo改变颜色
	document.querySelector('#logo #blogLogo').addEventListener('mouseover',blackToWhite,false);
	document.querySelector('#logo #blogLogo').addEventListener('mouseout',whiteToBlack,false);
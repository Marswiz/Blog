// navBlog 选择变色
function blackToBlue(e){
	let a = e.target.src.replace(/Black/,'Blue');
	e.target.src = a;
}

function blueToBlack(e){
	let a = e.target.src.replace(/Blue/,'Black');
	e.target.src = a;
}

function navFunc(){
	// 在日志页刷新后防止导航栏切换回渐变
	if (document.querySelector('#frontShow')){
		if(window.scrollY >= document.querySelector('#frontShow').clientHeight-2){
			document.querySelector('#navBlog').style.display = 'block';
			document.querySelector('#navFront').style.display = 'none';
			console.log('nav.js 变白');
		} else {
			document.querySelector('#navBlog').style.display = 'none';
			document.querySelector('#navFront').style.display = 'block';
			console.log('nav.js 变黑');
		}
	} else {
			document.querySelector('#navBlog').style.display = 'block';
			document.querySelector('#navFront').style.display = 'none';
			console.log('nav.js 变白');
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

function postsFunc(){

// 为所有链接加前缀
	let link = document.querySelectorAll('#postContent a');
	for (let i=0;i<link.length;i++) {
		link[i].innerHTML = link[i].innerHTML.replace(/^/g,'&nbsp;<i class="fa fa-hand-pointer-o"></i>&nbsp;');
	}

// 为所有tooltip-mars加前缀
	let tooltip = document.querySelectorAll('.tooltip-mars');
	for (let i=0;i<tooltip.length;i++) {
		tooltip[i].innerHTML = tooltip[i].innerHTML.replace(/^/g,'<i class="fa fa-eye">&nbsp;</i>');
	}

// 段落缩进识别
	let para = document.querySelectorAll('#postBox p');
	let pIndentifier = document.querySelector('#pIdentifier').innerHTML;
	if (pIndentifier == '英文缩进'){
		for (let i=0;i<para.length;i++) {
			para[i].classList.add('eng');
		}
		let blockquotePara = document.querySelectorAll('#postBox blockquote p');
		for (let i=0;i<blockquotePara.length;i++) {
			blockquotePara[i].classList.add('noIndent');
		}
	} else if(pIndentifier == '中文缩进'){
		let blockquotePara = document.querySelectorAll('#postBox blockquote p');
		let p = document.querySelectorAll('#postBox p');
		for (let i=0;i<blockquotePara.length;i++) {
			blockquotePara[i].classList.add('noIndent');
		}

		// 移动端Code显示优化 ：取消缩进，左对齐
		if(window.innerWidth <= 768){
			for(let i=0;i<p.length;i++){
				if(p[i].childNodes.length == 1 && p[i].childNodes[0].tagName == 'CODE'){
					p[i].style.textIndent = '0';
					p[i].style.textAlign = 'left';
					p[i].style.wordWrap = 'break-word';
				}
			}
		}
	} else if (pIndentifier == '无缩进'){
		for (let i=0;i<para.length;i++) {
			para[i].classList.add('noIndent');
		}
	} else if (pIndentifier == '全缩进'){
		for (let i=0;i<para.length;i++) {
			para[i].classList.add('allIndent');
		}
		let blockquotePara = document.querySelectorAll('#postBox blockquote p');
		for (let i=0;i<blockquotePara.length;i++) {
			blockquotePara[i].classList.remove('allIndent');
			blockquotePara[i].classList.add('noIndent');
		}
	}

// 底部日志间切换按钮变色
	let a = document.querySelectorAll('#postPager img');
	for (let i=0;i<a.length;i++){
		a[i].addEventListener('mouseover',blackToBlue,false);
		a[i].addEventListener('mouseout',blueToBlack,false);
	}


// 图片居中
	let pics = document.querySelectorAll('#postBox img');
	for(let i=0;i<pics.length;i++){
		
		// 取消img的缩进
		pics[i].parentNode.style.textIndent = '0';

		// 单击图片转大图		
		// pics[i].onclick = function(){
		// 	location.href = pics[i].src;
		// }

		// 设定居中margin
		let a = pics[i].parentNode.offsetWidth;
		let b = pics[i].offsetWidth;		
			pics[i].style.marginLeft = 0.45*(a-b)+'px';
	}

// 点击关键词跳转
	function postTagNav(e){
		location.href = document.querySelector('#baseURLIdentifier').innerHTML + '/tags/#' + e.target.innerHTML;
	}
	let postTagBtn = document.querySelectorAll('#tagsBox #tags span');
	if (window.innerWidth > 768){
		for(let i=0;i<postTagBtn.length;i++){
			postTagBtn[i].addEventListener('mousedown',postTagNav,false);
		}
	} else {
		for(let i=0;i<postTagBtn.length;i++){
			postTagBtn[i].addEventListener('touchend',postTagNav,false);
		}
	}
}

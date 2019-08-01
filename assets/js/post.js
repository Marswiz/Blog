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
	} else if (pIndentifier == '无缩进'){
		for (let i=0;i<para.length;i++) {
			para[i].classList.add('noIndent');
		}
	} else if (pIndentifier == '全缩进'){
		for (let i=0;i<para.length;i++) {
			para[i].classList.add('allIndent');
		}
	}

// 底部日志间切换按钮变色
	let a = document.querySelectorAll('#postPager img');
	for (let i=0;i<a.length;i++){
		a[i].addEventListener('mouseover',blackToBlue,false);
		a[i].addEventListener('mouseout',blueToBlack,false);
	}
}

// 点击关键词跳转
	function postTagNav(e){
		location.href = document.querySelector('#baseURLIdentifier').innerHTML + '/tags/#' + e.target.innerHTML;
	}
	let postTagBtn = document.querySelectorAll('#tagsBox #tags span');
	for(let i=0;i<postTagBtn.length;i++){
		postTagBtn[i].addEventListener('mousedown',postTagNav,false);
	}

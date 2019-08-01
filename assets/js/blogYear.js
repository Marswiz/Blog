function blogYearFunc(){
	let a = document.querySelectorAll('.blogYear');
	function scrollDelta(e){
		window.scrollTo(0,e.target.offsetTop-document.querySelector('#navBlur').offsetHeight*1.2)
	}
	for(let i=0;i<a.length;i++){
		a[i].addEventListener('mousedown',scrollDelta,false);
	}
}
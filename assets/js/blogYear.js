function blogYearFunc(){
	let a = document.querySelectorAll('.blogYear,#postContent h1,#postContent h2,#postContent h3,#postContent h4,#postContent h5,#postContent h6');
	function scrollDelta(e){
		window.scrollTo(0,e.target.offsetTop-document.querySelector('#navBlur').offsetHeight*1.2)
	}
	for(let i=0;i<a.length;i++){
		a[i].addEventListener('mousedown',scrollDelta,false);
	}
}
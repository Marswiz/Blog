function pagnaterFunc(){
	let a = document.querySelectorAll('#frontPagenater img');
	for (let i=0;i<a.length;i++){
		a[i].addEventListener('mouseover',blackToBlue,false);
		a[i].addEventListener('mouseout',blueToBlack,false);
	}
}
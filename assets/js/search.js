function doSearch(){
	let searchText = document.querySelector('#searchBox input').value;
	let posts = document.querySelectorAll('#searchBlogBox');
	let totalContentPosts = document.querySelectorAll('#totalBlogBox');
	let reg = RegExp(searchText,'gi');
	console.log(reg);
	// 清除之前所有搜索结果
	document.querySelector('#noResultContent').style.display = 'none';
	for(let i=0 ; i<posts.length; i++){
		posts[i].style.display = 'none';
	}

	// 匹配并载入新结果
	let noResult = true;

	for(let i=0 ; i<posts.length; i++){
		let matchRes = totalContentPosts[i].innerText.match(reg);
		if (matchRes != null){			
			posts[i].style.display = 'block';
			noResult = false;
		}
	}

	if (noResult){
		document.querySelector('#noResultContent').style.display = 'flex';
	}
}

document.querySelector('#searchBeginBtn').addEventListener('mousedown',doSearch,false); 
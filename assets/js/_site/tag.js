function tagScrollDelta(e){
    location.href = e.target.textContent;
    window.scrollBy(0,-document.querySelector('#navBlur').offsetHeight*1.2);
}

// 给所有Tagcloud中的标签添加点击事件
let tags = document.querySelectorAll('#tagCloud a');
for (let i of tags){
    i.addEventListener('mousedown',tagScrollDelta,false);
}

// 给所有tag添加点击事件
let downTags = document.querySelectorAll('.tag');
for (let i of downTags){
    i.addEventListener('mousedown', (e)=>{
        location.href = `#${e.target.textContent.slice(1)}`;
        window.scrollBy(0,-document.querySelector('#navBlur').offsetHeight*1.2);
    });
}
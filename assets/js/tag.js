function tagBig(e){
      if (document.querySelector('#bigTag')){
        tagBigRemove();
      }
      let inner = e.target.innerHTML;
      let top1 = e.target.offsetTop;
      let left1 = e.target.offsetLeft;
      let bigTag = document.createElement('div');
      bigTag.id = 'bigTag';
      bigTag.innerHTML = inner;
      bigTag.style.position = 'absolute';
      bigTag.style.width = e.target.offsetWidth*3+'px';
      bigTag.style.height = e.target.offsetHeight*3+'px';
      bigTag.style.left = left1-0.5*e.target.offsetWidth+'px';
      bigTag.style.top = top1-0.5*e.target.offsetHeight+'px';
      document.querySelector('#tagCloud').appendChild(bigTag);      
      document.querySelector('#bigTag').addEventListener('mouseout',tagBigRemove,false);
      document.querySelector('#bigTag').addEventListener('mousedown',tagScrollDelta,false);
    }

    function tagScrollDelta(e){
      location.href = e.target.innerHTML;
      window.scrollBy(0,-document.querySelector('#navBlur').offsetHeight*1.2);
    }

    function tagBigRemove(e){
      let a = document.querySelectorAll('#bigTag');
      for(let i=0;i<a.length;i++){
        a[i].remove();
      }
    }

    let tag = document.querySelectorAll('.cloudTag');
    if (window.innerWidth > 768){
      for(let i=0; i<tag.length; i++){
        tag[i].addEventListener('mouseenter',tagBig,false);
      }
    }

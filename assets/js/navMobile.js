let touchstartPosX = 0;
let touchendPosX = 0;

function navMoveFunc(e) {
    if ((touchendPosX - touchstartPosX) >= 0.2 * window.innerWidth && touchstartPosX >= 0.1 * window.innerWidth) {
        let a = document.querySelectorAll('#navMobile,#navMobile #navBlur,#navMobile #navTrans');
        for (let i = 0; i < a.length; i++) {
            a[i].style.animation = 'navMove 0.5s ease-in forwards';
        }
    } else if ((touchendPosX - touchstartPosX) <= -0.2 * window.innerWidth) {
        let a = document.querySelectorAll('#navMobile,#navMobile #navBlur,#navMobile #navTrans');
        for (let i = 0; i < a.length; i++) {
            a[i].style.animation = 'navMoveBack 0.5s ease-in forwards';
        }
    }
    touchstartPosX = 0;
    touchendPosX = 0;
}

function getStartPoint(e) {
    if (e.touches.length == 1) {
        touchstartPosX = e.touches[0].clientX;
    }

    //添加触摸结束事件监听器
    window.addEventListener('touchend', navMoveFunc, false);
}

function gestureDetected(e) {
    return window.removeEventListener('touchend', navMoveFunc, false);
}

function getEndPoint(e) {
    if (e.changedTouches.length == 1) {
        touchendPosX = e.changedTouches[0].clientX;
    }
}

if (window.innerWidth <= 768) {
    window.addEventListener('touchstart', getStartPoint, false);
    window.addEventListener('touchend', getEndPoint, false);
    window.addEventListener('gesturestart', gestureDetected, false);
	// prevent code scroll from nav pop.
    document.querySelectorAll('pre').forEach(el => {
        el.addEventListener('touchend', (e) => {
            e.stopPropagation();
        }, true);
    });
}

// 切换移动端日夜显示效果
function changeImgColor(jqObject) {
    let a = jqObject.attr('src');
    let b = a.replace(/Black/g, 'White');
    jqObject.attr('src', b);
    return true;
}

function changeImgColorBack(jqObject) {
    let a = jqObject.attr('src');
    let b = a.replace(/White/g, 'Black');
    jqObject.attr('src', b);
    return true;
}

function changeDayNight() {
    if (window.innerWidth <= 768) {
        if (window.localStorage) {
            if (!window.localStorage.marswizBlogDayNight || window.localStorage.marswizBlogDayNight == 'Day') {
                window.localStorage.setItem('marswizBlogDayNight', 'Night');
            } else {
                window.localStorage.setItem('marswizBlogDayNight', 'Day');
            }
        } else {
            alert("Your Browser Doesn't Support Web Storage. The Function Cannot Be Used.");
        }
    }
}

function loadDayNight() {
    if (window.innerWidth <= 768) {
        if (window.localStorage.marswizBlogDayNight == 'Day' || !window.localStorage.marswizBlogDayNight) {
            $('body,.cloudTag,blockquote,#searchBox').css({
                'backgroundColor': ''
            });
            $('#blogBox #link,#blogs a,.blogYear,.tag,.cloudTag,#tagBlogs a,#aboutMeBox,#aboutMeTitle,#searchBox span,#searchResultList div,#noResultContent p').css({
                'color': ''
            });
            $('p#frontPostTagsMobile,.cloudTag').css({
                'borderColor': ''
            });
            $('#pageNumBox,#changeDayNight').css({
                'color': ''
            });
            $('div#socialBall').css({
                'backgroundColor': ''
            });
            $('div#navBlur').css({
                'backgroundColor': '',
                'boxShadow': ''
            });
            let a = document.querySelectorAll('#pageNumBox,#changeDayNight,#postBox,.leancloud-visitors,.vat,.vcontent p,.vcontent a,.vwrap,input,textarea,.vinfo,.vinfo .vnum,.vlist,.vcount,div.vctrl,div.vctrl span');
            for (let i = 0; i < a.length; i++) {
                a[i].style.color = '';
            }
            $('#webInfo,.power a').css('color', '');
            $('path').attr('fill', '');
            $('#changeDayNight').attr('class', 'fa fa-lightbulb-o');
            for (let i = 0; i < $('img').length; i++) {
                changeImgColorBack($($('img')[i]));
            }
            $('pre').css('backgroundColor', '');
        } else {
            $('body,.cloudTag,blockquote,#searchBox').css({
                'backgroundColor': '#506060'
            });
            $('#blogBox #link,#blogs a,.blogYear,.tag,.cloudTag,#tagBlogs a,#aboutMeBox,#aboutMeTitle,#searchBox span,#searchResultList div,#noResultContent p').css({
                'color': 'white'
            });
            $('p#frontPostTagsMobile,.cloudTag').css({
                'borderColor': 'white'
            });

            let a = document.querySelectorAll('#pageNumBox,#changeDayNight,#postBox,.leancloud-visitors,.vat,.vcontent p,.vcontent a,.vwrap,input,textarea,.vinfo,.vinfo .vnum,.vlist,.vcount,div.vctrl,div.vctrl span');
            for (let i = 0; i < a.length; i++) {
                a[i].style.color = 'white';
            }

            $('#webInfo,.power a').css('color', '#999');
            $('path').attr('fill', 'white');
            $('div#socialBall').css({
                'backgroundColor': '#bdb7b1'
            });
            $('div#navBlur').css({
                'backgroundColor': '#506060',
                'boxShadow': '0 0 3px #6cd1ef'
            });
            $('#changeDayNight').attr('class', 'fa fa-moon-o');
            for (let i = 0; i < $('img').length; i++) {
                changeImgColor($($('img')[i]));
            }
            $('pre').css('backgroundColor', '#999');

        }
    }
}

$('#changeDayNight').click(changeDayNight);
$('#changeDayNight').click(loadDayNight);
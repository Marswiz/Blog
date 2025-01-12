window.addEventListener('load', () => {
    let links = document.querySelectorAll('a');
    for (let l of links) {
        if (l.href && l.href.indexOf('marswiz') === -1 && l.href.indexOf('localhost') === -1) {
            l.target = "_blank";
        }
    }
});
// -> general.js
// 检测浏览器是否支持Passive Event Listener:
// Chrome 56+ 版本会默认把绑定在window、body、document等上的scroll mousewheel touchmove等默认设置为passive event listener以提高性能
// passive event listener中不能调用 preventDefault,  会被忽略并报错;
let passiveSupported = false;

try {
    let options = Object.defineProperty({}, "passive", {
        get: function() {
            passiveSupported = true;
        }
    });

    window.addEventListener("test", null, options);
} catch (err) {}


// debounce func.

function debounce(fn, delay) {
    let timer = null;
    return function(...args) {
        if (timer === null) {
            timer = setTimeout(() => {
                fn(...args);
                timer = null;
            }, delay * 1000);
        } else {
            clearTimeout(timer);
            timer = setTimeout(() => {
                fn(...args);
                timer = null;
            }, delay * 1000);
        }
    };
}

// throttle func.
function throttle(fn, delay) {
    let prev = 0;
    return function(...args) {
        let now = Date.now();
        if (now - prev >= delay * 1000) {
            fn(...args);
            prev = now;
        }
    }
}

// -> nav.js
// navBlog 选择变色
function blackToBlue(e) {
    let a = e.target.src.replace(/Black/, 'Blue');
    e.target.src = a;
}

function blueToBlack(e) {
    let a = e.target.src.replace(/Blue/, 'Black');
    e.target.src = a;
}

// logo变色
function blackToWhite(e) {
    let a = e.target.src.replace(/Black/, 'White');
    e.target.src = a;
}

function whiteToBlack(e) {
    let a = e.target.src.replace(/White/, 'Black');
    e.target.src = a;
}

// nav toggle func
function navToWhite() {
    document.querySelector('#navBlog').classList.remove('navHidden');
    document.querySelector('#navFront').classList.remove('navShown');
    document.querySelector('#navFront').classList.add('navHidden');
    document.querySelector('#navBlog').classList.add('navShown');
}

function navToBlack() {
    document.querySelector('#navFront').classList.remove('navHidden');
    document.querySelector('#navBlog').classList.remove('navShown');
    document.querySelector('#navBlog').classList.add('navHidden');
    document.querySelector('#navFront').classList.add('navShown');
}

function navFunc() {
    if (window.innerWidth >= 768) {
        // 在日志页刷新后防止导航栏切换回渐变
        if (document.querySelector('#frontShow')) {
            if (window.scrollY >= document.querySelector('#frontShow').clientHeight - 2) {
                navToWhite();
            } else {
                navToBlack();
                $('#frontPageInfo').slideDown(1500);
                $('#tagBox').slideDown(500);
            }
        } else {
            document.querySelector('#navBlog').classList.remove('navHidden');
            document.querySelector('#navBlog').classList.add('navShown');
        }
    }
}


// 改变颜色
document.querySelector('#blogBtn img').addEventListener('mouseover', blackToBlue, false);
document.querySelector('#tagBtn img').addEventListener('mouseover', blackToBlue, false);
document.querySelector('#aboutMeBtn img').addEventListener('mouseover', blackToBlue, false);
document.querySelector('#searchBtn img').addEventListener('mouseover', blackToBlue, false);
document.querySelector('#blogBtn img').addEventListener('mouseout', blueToBlack, false);
document.querySelector('#tagBtn img').addEventListener('mouseout', blueToBlack, false);
document.querySelector('#aboutMeBtn img').addEventListener('mouseout', blueToBlack, false);
document.querySelector('#searchBtn img').addEventListener('mouseout', blueToBlack, false);

// logo改变颜色
document.querySelector('#logo #blogLogo').addEventListener('mouseover', blackToWhite, false);
document.querySelector('#logo #blogLogo').addEventListener('mouseout', whiteToBlack, false);

// -> frontShow.js

// 首页展示滚动Js
// 2019-07-25 MarsWiz
// 
// 功能：FrontShow时下滑滚轮可直接跳转到日志概览区；
// 从日志概览区上滑滚轮可直接到页首FrontShow区，避免处于两部分之间的尴尬区域。

// 判断移动设备
function isMobile() {
    if (navigator.userAgent.match(/Android/i) ||
        navigator.userAgent.match(/webOS/i) ||
        navigator.userAgent.match(/iPhone/i) ||
        navigator.userAgent.match(/iPad/i) ||
        navigator.userAgent.match(/iPod/i) ||
        navigator.userAgent.match(/BlackBerry/i) ||
        navigator.userAgent.match(/Windows Phone/i)
    ) return true;
    return false;
}

// 兼容FireFox,统一wheelDelta值
let getWheelDelta = function(event) {
    return event.wheelDelta || (-event.detail * 40);
}
// 兼容FireFox，改变滚轮事件名称
let wheelEvent = function() {
    if (isMobile()) {
        return 'touchmove';
    } else if (typeof window.onmousewheel == 'object') {
        return 'mousewheel';
    } else {
        return 'DOMMouseScroll';
    }
}

// 跳转函数
function topScroll(e) {
    // 监听鼠标滚轮向下滚动
    if (((getWheelDelta(e) == -120 || getWheelDelta(e) == -150 || getWheelDelta(e) == -210) || isMobile()) && window.innerWidth >= 768) {
        // 跳转到frontContentBox
        e.preventDefault();
        window.scrollTo(0, document.querySelector('#frontShow').offsetHeight);
        // 变换导航栏显示
        navToWhite();
        return window.removeEventListener(wheelEvent(), topScroll, passiveSupported ? {
            passive: false
        } : false);
    }
}

// 判断滚动位置并作出响应
function frontScroll() {
    if (window.scrollY <= 10) {
        // e.preventDefault();
        window.addEventListener(wheelEvent(), topScroll, passiveSupported ? {
            passive: false
        } : false);
    } else if (window.scrollY > 10 && window.scrollY < document.querySelector('#frontShow').offsetHeight - 30) {
        window.scrollTo(0, 0);
        // 变换导航栏显示			
        navToBlack();
        $('#frontPageInfo').hide();
        $('#tagBox').hide();
        $('#frontPageInfo').slideDown(1500);
        $('#tagBox').slideDown(500);
    }
}

// 在存在FrontShow组件时加载
if (document.querySelector('#frontShow')) {
    // 页面加载后监听FrontScroll
    window.addEventListener('load', throttle(frontScroll, 0), passiveSupported ? {
        passive: false
    } : false);
    // 滚动时监听FrontScroll
    window.addEventListener('scroll', throttle(frontScroll, 0), passiveSupported ? {
        passive: false
    } : false);
}

// -> post.js
function postsFunc() {

    // 为所有链接加前缀
    let link = document.querySelectorAll('#postContent a');
    for (let i = 0; i < link.length; i++) {
        link[i].innerHTML = link[i].innerHTML.replace(/^/g, '&nbsp;<i class="fa fa-hand-pointer-o"></i>&nbsp;');
    }

    // 给h1-h6前面加上#锚点
    let hElements = document.querySelectorAll('#postContent h1,#postContent h2,#postContent h3,#postContent h4,#postContent h5,#postContent h6');
    for (let hElement of hElements) {
        let anchor = `<span class="link hidden">#</span>`;
        if (window.innerWidth > 768) {
            hElement.innerHTML = anchor + hElement.innerHTML;
        }

        // 锚点在鼠标悬停在标题上时显示
        hElement.addEventListener('mouseover', (e) => {
            hElement.firstElementChild.classList.remove('hidden');
        });

        hElement.addEventListener('mouseout', (e) => {
            hElement.firstElementChild.classList.add('hidden');
        });

    }

    // 为所有tooltip-mars加前缀
    let tooltip = document.querySelectorAll('.tooltip-mars');
    for (let i = 0; i < tooltip.length; i++) {
        tooltip[i].innerHTML = tooltip[i].innerHTML.replace(/^/g, '<i class="fa fa-eye">&nbsp;</i>');
    }

    // 段落缩进识别
    let para = document.querySelectorAll('#postBox p');
    let pIndentifier = document.querySelector('#pIdentifier') ? document.querySelector('#pIdentifier').innerHTML : null;
    if (pIndentifier == '英文缩进') {
        for (let i = 0; i < para.length; i++) {
            para[i].classList.add('eng');
        }
        let blockquotePara = document.querySelectorAll('#postBox blockquote p');
        for (let i = 0; i < blockquotePara.length; i++) {
            blockquotePara[i].classList.add('noIndent');
        }
    } else if (pIndentifier == '中文缩进') {
        let blockquotePara = document.querySelectorAll('#postBox blockquote p');
        let p = document.querySelectorAll('#postBox p');
        for (let i = 0; i < blockquotePara.length; i++) {
            blockquotePara[i].classList.add('noIndent');
        }

        // 移动端Code显示优化 ：取消缩进，左对齐
        if (window.innerWidth <= 768) {
            for (let i = 0; i < p.length; i++) {
                if (p[i].childNodes.length == 1 && p[i].childNodes[0].tagName == 'CODE') {
                    p[i].style.textIndent = '0';
                    p[i].style.textAlign = 'left';
                    p[i].style.wordWrap = 'break-word';
                }
            }
        }
    } else if (pIndentifier == '无缩进') {
        for (let i = 0; i < para.length; i++) {
            para[i].classList.add('noIndent');
        }
    } else if (pIndentifier == '全缩进') {
        for (let i = 0; i < para.length; i++) {
            para[i].classList.add('allIndent');
        }
        let blockquotePara = document.querySelectorAll('#postBox blockquote p');
        for (let i = 0; i < blockquotePara.length; i++) {
            blockquotePara[i].classList.remove('allIndent');
            blockquotePara[i].classList.add('noIndent');
        }
    }

    // 底部日志间切换按钮变色
    let a = document.querySelectorAll('#postPager img');
    for (let i = 0; i < a.length; i++) {
        a[i].addEventListener('mouseover', blackToBlue, false);
        a[i].addEventListener('mouseout', blueToBlack, false);
    }


    // 图片居中
    let pics = document.querySelectorAll('#postBox img');
    for (let i = 0; i < pics.length; i++) {

        // 取消img的缩进
        pics[i].parentNode.style.textIndent = '0';

        // 单击图片转大图		
        // pics[i].onclick = function(){
        // 	location.href = pics[i].src;
        // }

        // 设定居中margin
        let a = pics[i].parentNode.offsetWidth;
        let b = pics[i].offsetWidth;
        pics[i].style.marginLeft = 0.45 * (a - b) + 'px';
    }

    // 点击关键词跳转
    function postTagNav(e) {
        location.href = document.querySelector('#baseURLIdentifier').innerHTML + '/tags/#' + e.target.innerHTML;
    }
    let postTagBtn = document.querySelectorAll('#tagsBox #tags span');
    if (window.innerWidth > 768) {
        for (let i = 0; i < postTagBtn.length; i++) {
            postTagBtn[i].addEventListener('mousedown', postTagNav, false);
        }
    } else {
        for (let i = 0; i < postTagBtn.length; i++) {
            postTagBtn[i].addEventListener('touchend', postTagNav, false);
        }
    }
}

window.addEventListener('load', postsFunc, false);
if (window.innerWidth <= 768) {
    window.addEventListener('load', loadDayNight, false);
    $(document).one('touchstart', loadDayNight);
}

// tooltip 快速提示器 End

// -> blogyear.js
function blogYearFunc() {
    let a = document.querySelectorAll('.blogYear,#postContent h1,#postContent h2,#postContent h3,#postContent h4,#postContent h5,#postContent h6');

    function scrollDelta(e) {
        window.scrollTo(0, e.target.offsetTop - document.querySelector('#navBlur').offsetHeight * 1.2)
    }
    for (let i = 0; i < a.length; i++) {
        a[i].addEventListener('mousedown', scrollDelta, false);
    }
}

blogYearFunc();
if (window.innerWidth >= 769) {
    document.querySelector('#navBlog').style.display = 'block';
}

window.addEventListener('resize', debounce(resize, 0.5));

// -> navMobile.js
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

// -> load.js
if (window.innerWidth <= 768) {
    window.addEventListener('load', loadDayNight, false);
}
window.addEventListener('load', navFunc, false);
window.addEventListener('load', postsFunc, false);
// if (pagnaterFunc !== undefined) window.addEventListener('load',pagnaterFunc,false);


function resize() {
    // 手机横转竖的操作
    // and 把PC的导航栏去掉
    if (window.innerWidth <= 768) {
        window.addEventListener('touchstart', getStartPoint, passiveSupported ? {
            passive: false
        } : false);
        window.addEventListener('touchend', getEndPoint, passiveSupported ? {
            passive: false
        } : false);
        window.addEventListener('gesturestart', gestureDetected, false);
        document.querySelector('#navBlog').style.display = 'none';
    } else {
        document.querySelector('#navBlog').style.display = 'block';
    }
}

// 屏幕大小变化时候的调整
window.addEventListener('resize', debounce(resize, 0.5));

window.addEventListener('keydown', e => {
    let bannedKeys = ['s', 'p'];
    if (e.ctrlKey && bannedKeys.indexOf(e.key) !== -1) e.preventDefault();
});

// headerIndex.js 日志导航 -- 2021.10.11
(() => {
    "use strict";
    new class {
        constructor(e = "body", t = "#headerIndexContainer") {
            this.isStr(t) && (t = document.querySelector(t)), this.isStr(e) && (e = document.querySelector(e)), this.container = t, t.classList.add("headerIndexContainer"), this.base = e, this.frag = document.createDocumentFragment(), this.headers = [], this.tags = [0, 0, 0, 0, 0, 0], this.refreshHeaders()
        }
        isStr(e) {
            return "string" == typeof e
        }
        getHeaders(e = document, t = 1) {
            return this.isStr(e) && (e = document.querySelector(e)), e.querySelectorAll(`h${t}`)
        }
        refreshHeaders() {
            let e = this.base.querySelectorAll("h1,h2,h3,h4,h5,h6");
            this.headers.length = 0;
            for (let t of e) this.headers.push({
                id: t.id,
                content: t.innerText,
                level: +t.tagName.slice(1)
            });
            this.refreshContainerElement()
        }
        refreshContainerElement() {
            let e = document.createElement("div");
            e.classList.add("headerIndexInnerContainer");
            let t = document.createDocumentFragment();
            for (let e of this.headers) this.addIndexLinkElement(e, t);
            this.frag = t, e.appendChild(t), this.container.innerHTML = "", this.container.appendChild(e)
        }
        addIndexLinkElement(e, t = this.frag) {
            let {
                level: n,
                content: r,
                id: s
            } = e, a = document.createElement("a");
            a.classList.add(`headerIndex_level_${n}`), this.tags[n - 1] += 1;
            for (let e = n; e < this.tags.length; e++) this.tags[e] = 0;
            let d = this.tags.slice(0, n).join("."),
                i = document.createElement("span");
            i.innerText = `${d}  `, i.classList.add("headerIndexTag");
            let h = document.createElement("span");
            r = r.replace(/(\d+\.)+\d?\s?/, ""), r = r.replace(/\S+、\s/, ""), h.innerText = r, a.appendChild(i), a.appendChild(h), a.href = `#${s}`, t.appendChild(a)
        }
    }("#postContent", "#headerIndex")
})();
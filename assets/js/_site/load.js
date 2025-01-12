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
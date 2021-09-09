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
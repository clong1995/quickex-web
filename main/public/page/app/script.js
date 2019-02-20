class App {
    //初始化函数
    init() {
        //shim.zoom(coo.windowSize());
        this.PageResize;

    }

    PageResize() {
        (function GetSize() {
            var width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
            width > 1920 ? width = width : null;
            width < 320 ? width = 320 : null;
            document.documentElement.style.fontSize = (width * (100 / 375)) + "px";
            if (!window.onresize) {
                window.onresize = function () {
                    onFooEndFunc(GetSize);
                }
            }
        })();
        //延迟运行计算
        var executionTimer;
        var onFooEndFunc = function (fn) {
            // 根据实际情况可调整延时时间
            var delay = 300;
            if (!!executionTimer) {
                clearTimeout(executionTimer);
            }
            //这里延时执行你的函数
            executionTimer = setTimeout(function () {
                fn();
            }, delay);
        };
    }

    //添加事件
    addEvent() {
    }
}
class Module {
    //构造
    constructor(app, domain) {
        this.app = app;
        this.domain = domain;
        this.ipcRenderer = shim.elc.ipcRenderer;
        this.ws = null;
        this.wsTimeout = null;
        if (!this.ipcRenderer) {
            coo.addClass(coo.query('.control', this.domain), 'noControl');
        }

        this.menu = JSON.parse(sessionStorage.getItem('menu')) || [];
        this.queryDom();


        this.init();


        //绑定事件
        this.addEvent();
        this.userInfo();
    }

    init() {
        this.initMenu();
        this.heart();
    }

    //TODO 临时写在这里，检测
    heart() {
        //检测跟外网的
        this.ws = new WebSocket(CONFIG.webWssUrl + ':' + CONFIG.webWssPort);

        this.ws.onopen = () => {
            console.log('ws onopen');
            //注册自己
            //ws.send('from client: hello');
            this.heartConn();
        };

        this.ws.onmessage = e => {
            console.log('from server: ' + e.data);
        };

        this.ws.onclose = e => this.heartError();

        /*this.ws.onerror = e => {
            console.log("error");
            this.heartError();
        }*/
    }

    heartConn() {
        coo.hide(this.connBlankDom);
        clearTimeout(this.wsTimeout);
        coo.removeClass(this.stateDom, 'off');
        coo.removeClass(this.stateDom, 're');
    }

    heartError() {
        coo.hasClass(this.connBlankDom, 'hide') && coo.show(this.connBlankDom);
        console.error("close");
        clearTimeout(this.wsTimeout);
        coo.addClass(this.stateDom, 'off');
        coo.removeClass(this.stateDom, 're');
        this.ws.close();
        this.ws = null;
        this.wsTimeout = setTimeout(() => {
            console.warn("re conn");
            coo.removeClass(this.stateDom, 'off');
            coo.addClass(this.stateDom, 're');
            this.heart();
            //this.ws.open();
        }, 2000);
    }

    queryDom() {
        this.userDom = coo.query('.user', this.domain);
        this.usernameDom = coo.query('.username', this.userDom);
        this.bigDom = coo.query('.big', this.domain);
        this.normalDom = coo.query('.normal', this.domain);
        this.stateDom = coo.query('.state', this.domain);
        this.connBlankDom = coo.query('.connBlank', this.domain);
    }


    userInfo() {
        let user = JSON.parse(sessionStorage.getItem('user'));
        if (!user) coo.link('/login');
        coo.text(this.usernameDom, user.username)
    }

    // 初始化菜单
    initMenu() {
        //生成菜单
        let menuHtml = '';
        let currMenu = window.location.pathname;
        this.menu.forEach(v => menuHtml += `<div class="item ${v.link === currMenu ? 'selected' : ''}" data-id="${v.id}">${v.name}</div>`);
        this.menuDom = coo.query('.menu', this.domain);
        coo.html(this.menuDom, menuHtml);
        //绑定事件
        coo.on('.item', this.menuDom, 'click', t => this.link(t));

        //TODO 测试headers
        /*shim.ajaxJWT(CONFIG.webApi('/api/control/setVolume'), {
            data:{
                id: "QDXLKC-20190209-QKV1",
                level: 50,
                master: "QDXLKC-20190209-QKV1"
            },
            success: res => {
                console.log(res);
            }
        });*/

    }

    //#=>添加事件
    addEvent() {
        coo.on('.close', this.domain, 'click', () => this.close());
        coo.on('.min', this.domain, 'click', () => this.min());
        coo.on('.big', this.domain, 'click', t => this.big(t));
        coo.on('.normal', this.domain, 'click', t => this.normal(t));
        //退出
        coo.on('.logout', this.userDom, 'click', () => this.logout());
    }

    close() {
        this.ipcRenderer.send('window-all-closed');
    }

    min() {
        this.ipcRenderer.send('hide-window');
    }

    big(target) {
        this.ipcRenderer.send('big-window');
        coo.hide(target);
        coo.show(this.normalDom);
    }

    normal(target) {
        this.ipcRenderer.send('normal-window');
        coo.hide(target);
        coo.show(this.bigDom);
    }

    link(target) {
        let id = parseInt(coo.attr(target, 'data-id'));
        //寻找link
        this.menu.some(v => {
            if (v.id === id) {
                //去掉其他选中
                coo.removeClass(coo.query('.selected', this.menuDom), 'selected');
                //选中
                coo.addClass(target, 'selected');
                //跳转
                //this.app.getModule('main').loadPage(v.link);
                coo.link(v.link);
                return true;
            }
        });
    }

    logout() {
        shim.ajaxJWT(CONFIG.javaApi('/auth/logout'), {
            success: res => {
                if (res.code === 0) {
                    //清楚记录
                    sessionStorage.clear();
                    coo.link('/login');
                } else {
                    console.error(res.data)
                }
            }
        });
    }
}
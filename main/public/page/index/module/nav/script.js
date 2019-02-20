class Module {
    //构造
    constructor(app, domain) {
        this.app = app;
        this.domain = domain;
        this.ipcRenderer = shim.elc.ipcRenderer;
        if(!this.ipcRenderer) {
            coo.addClass(coo.query('.control',this.domain),'noControl');
        }


        this.queryDom();

        this.initMenu();

        //绑定事件
        this.addEvent();
        this.userInfo();
    }

    queryDom() {
        this.userDom = coo.query('.user', this.domain);
        this.usernameDom = coo.query('.username', this.userDom);
        this.bigDom = coo.query('.big', this.domain);
        this.normalDom = coo.query('.normal', this.domain);
    }


    userInfo() {
        let user = JSON.parse(sessionStorage.getItem('user'));
        if(!user) coo.link('/login');
        coo.text(this.usernameDom, user.username)
    }

    // 初始化菜单
    initMenu() {
        shim.ajaxJWT(CONFIG.javaApi('/menu/all'), {
            success: res => {
                if (res.code === 0) {
                    let data = res.data;
                    this.menu = res.data;
                    //生成菜单
                    let menuHtml = '';
                    let index = 0;
                    data.forEach((v, i) => menuHtml += `<div class="item ${i === index ? 'selected' : ''}" data-id="${v.id}">${v.name}</div>`);
                    this.menuDom = coo.query('.menu', this.domain);
                    coo.html(this.menuDom, menuHtml);
                    //绑定事件
                    coo.on('.item', this.menuDom, 'click', t => this.link(t));
                    //默认打开第一个菜单
                    this.app.getModule('main').loadPage(this.menu[index].link);
                } else {
                    console.error(res.data)
                }
            }
        });
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
                this.app.getModule('main').loadPage(v.link);
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
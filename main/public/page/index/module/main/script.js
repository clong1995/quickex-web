class Module {
    //构造
    constructor(app, domain) {
        this.app = app;
        this.domain = domain;
        this.ifrDom = coo.query('.ifr', this.domain);
    }

    //加载页面
    loadPage(url = null) {
        //卸载旧的页面
        //加载新的页面
        this.ifrDom.src = url;
        //this.ifrDom.src = '/story?id=2';
    }
}
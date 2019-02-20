class Module {
    //构造
    constructor(app, domain) {
        this.app = app;
        this.domain = domain;
        this.ipcRenderer = shim.elc.ipcRenderer;
        if (!this.ipcRenderer)
            coo.addClass(coo.query('.close', this.domain), 'noClose');
        //绑定事件
        this.addEvent();
    }


    //#=>添加事件
    addEvent() {
        coo.on('.close', this.domain, 'click', t => this.close());
    }

    close() {
        this.ipcRenderer.send('window-all-closed');
    }
}
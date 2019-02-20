class Module {
    //构造
    constructor(app, domain) {
        this.app = app;
        this.domain = domain;

        this.init();

        this.queryDom();
        //绑定事件
        this.addEvent();
    }

    queryDom() {
        //TODO
        this.ifrDom = coo.query('.tempIfr', this.domain);
        this.mainIfrDom = coo.query('.ifr');
    }

    addEvent() {
        coo.on('.close', this.domain, 'click', t => this.close());
        // coo.on('.close', this.domain, 'click', t => this.hideStory());
    }

    init() {
        this.initList();
    }

    initList() {

    }

    close() {
        let win = this.ifrDom.contentWindow;
        //发送数据
        win.postMessage(JSON.stringify({type: 'save'}), "*");
        //监听子页面发送的数据
        window.onmessage = e => {
            let data = JSON.parse(e.data);

            if (data.type === 'close') {
                let value = data.value;
                shim.ajaxJWT(CONFIG.javaApi('/section/updateSectionContent'), {
                    data: {
                        basic: JSON.stringify(value.basic),
                        content: JSON.stringify(value.content),
                        snapshot: value.snapshot,
                        id: value.id
                    },
                    success: res => {
                        if (res.code === 0) {
                            document.querySelector('#nav').removeAttribute('style');
                            this.ifrDom.src = '';
                            coo.hide(this.domain);
                            //TODO 调用子页面的方法更新截图
                            let child = this.mainIfrDom.contentWindow;
                            child.updateImg(value.id,value.snapshot);
                        } else {
                            console.error(res.data)
                        }
                    }
                });
            }
        }
    }
}
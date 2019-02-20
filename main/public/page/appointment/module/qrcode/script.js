class Module {
    //构造
    constructor(app, domain) {
        this.app = app;
        this.domain = domain;
        this.init();
        this.queryDom();
        this.addEvent();
    }

    queryDom() {
        // this.addContentDom = coo.query('.addContent', this.domain);
    }

    addEvent() {
        // coo.on('.addBtn', this.domain, 'click', t => this.showStory());
        // coo.on('.close', this.domain, 'click', t => this.hideStory());
    }

    init() {
        this.initQrcode();
    }

    initQrcode() {
        let size = coo.domSize(this.domain);
        let url = CONFIG.webApi('/app?e=12&b=1&f=1');
        console.log(url);
        $(this.domain).qrcode({
            width: size.width,
            height: size.height,
            text: url
        });
    }

}
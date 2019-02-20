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
        this.initList();
    }

    initList() {

    }

}
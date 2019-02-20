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
        // this.addContentDom = coo.query('.addContent', this.domain);
    }

    addEvent() {
        // coo.on('.addBtn', this.domain, 'click', t => this.showStory());
        // coo.on('.close', this.domain, 'click', t => this.hideStory());

        coo.on('.menu-item', this.domain, 'click', (t1, t2) => this.menuItemClick(t1, t2));
    }

    init() {
        this.initList();
    }

    initList() {

    }

    showStory() {
        coo.show(this.addContentDom);
    }

    menuItemClick(t1, t2) {
        coo.removeClass(coo.query('.active', this.domain), 'active');
        coo.addClass(t1, 'active');

        let type = coo.attr(t1, 'data-type');
        if (type == '1') {
            this.app.getModule('data').hide();
            this.app.getModule('func').show();
        } else if (type == '2') {
            this.app.getModule('func').hide();
            this.app.getModule('data').show();
        }
    }
}
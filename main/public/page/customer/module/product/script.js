class Module {
    //构造
    constructor(app, domain) {
        this.app = app;
        this.domain = domain;
        //查询dom
        this.queryDom();
        //绑定事件
        this.addEvent();
    }

    //查询dom
    queryDom() {
        //this.usernameDom = coo.query('.username', this.domain);
    }

    //添加事件
    addEvent() {
        // coo.on('.close', this.domain, 'click', t => this.close());
    }

    hide() {
        coo.hide(this.domain);
    }

    show(id) {
        coo.show(this.domain);
        this.currCompanyId = id;

        //TODO 这里写获取数据的逻辑
        console.log('当前左侧选中的公司ID是：',this.currCompanyId);
        console.log('当前在== 产品库 ==模块：');

    }

}
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
        this.i_select = coo.query('.i_select', this.domain, true);

    }

    //添加事件
    addEvent() {
        // coo.on('.close', this.domain, 'click', t => this.close());

        //选择列表
        coo.on('.i_select', this.domain, "click", t => this.selectClick(t));
        //下拉列表
        coo.on('.i_toggle', this.domain, "click", (t,t2) => this.toggleClick(t,t2));
    }

    hide() {
        coo.hide(this.domain);
    }

    show(id) {
        coo.show(this.domain);
        this.currCompanyId = id;

        //TODO 这里写获取数据的逻辑
        console.log('当前左侧选中的公司ID是：',this.currCompanyId);
        console.log('当前在== 成功案例 ==模块：');

    }

    selectClick(target) {
        coo.toggleClass(target, "active");
    }
    toggleClick(target,target2) {
        const
            item = coo.parent(target, ".item"),
            itemBody = coo.query('.item_body', item);

        console.log(target,target2)
        coo.toggleClass(itemBody, "hide");
        coo.toggleClass(target, "active");
    }


}
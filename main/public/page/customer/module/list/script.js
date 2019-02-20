class Module {
    //构造
    constructor(app, domain) {
        this.app = app;
        this.domain = domain;

        this.init();

        //查询dom
        this.queryDom();
        //绑定事件
        this.addEvent();

    }

    init(){
        this.currCompanyId = 1;
    }

    //查询dom
    queryDom() {
        this.listDom = coo.query('.list', this.domain);
    }

    //添加事件
    addEvent() {
        coo.on('.title', this.listDom, 'click', t => this.select(t));
        coo.on('.li', this.listDom, 'click', t => this.selectChild(t));
    }

    select(target) {

        if (coo.hasClass(target, 'active')) return;

        //去掉所有激活
        coo.query('.active', this.listDom, true).forEach(v => coo.removeClass(v, 'active'));
        coo.addClass(target, 'active');
        let parent = target.parentNode;
        let ul = coo.query('.ul', parent);
        //切换到基本信息模块
        this.selectedInfoModule();
        if (!ul) return;
        coo.addClass(ul, 'active');
        let parentDom = target.parentNode;
        this.currCompanyId = coo.attr(parentDom,'data-id');
    }

    selectChild(target){
        let parentDom = target.parentNode;
        //去掉激活
        coo.removeClass(coo.query('.active',parentDom),'active');
        coo.addClass(target,'active');
        this.currCompanyId = coo.attr(target,'data-id');

        //切换到基本信息模块
        this.selectedInfoModule()
    }

    selectedInfoModule(){

        this.app.getModule('menu').showTip('info');
    }

    selectedCompany(){
        return this.currCompanyId;
    }
}
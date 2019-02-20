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

    //查询dom
    queryDom() {

    }

    //添加事件
    addEvent() {
        coo.on('.li', this.domain, 'click', t => this.select(t));
    }

    init() {
        this.initMenu();
    }

    initMenu() {
        //初始化菜单
        this.menu = [
            {id: 'info', name: '基本信息'},
            {id: 'history', name: '发展历程'},
            {id: 'organization', name: '组织架构'},
            {id: 'group', name: '核心团队'},
            {id: 'park', name: '园区规划'},
            {id: 'success', name: '成功案例'},
            {id: 'product', name: '产品库'},
            {id: 'data', name: '资料库'}
        ];
        let selected = 0;
        let menuHtml = '';
        this.menu.forEach((v, i) => menuHtml += `<div class="li ${v.id} ${i === selected ? 'active' : ''}" data-id="${v.id}">${v.name}</div>`);
        coo.html(this.domain, menuHtml);
        //打开第一个标签
        //模拟请求时间
        setTimeout(() => {
            this.showTip(this.menu[selected].id);
        }, 50);
    }

    showTip(id) {
        coo.removeClass(coo.query('.active', this.domain), 'active');
        this.menu.forEach(v => {
            if(id !== v.id) {
                //隐藏其他
                this.app.getModule(v.id).hide();
            }else{
                let currCompanyId = this.app.getModule('list').selectedCompany();
                this.app.getModule(v.id).show(currCompanyId);
                coo.addClass(coo.query('.'+id,this.domain), 'active');
            }
        });
    }

    select(target) {
        if (coo.hasClass(target, 'active')) return;
        //获取id
        let id = coo.attr(target, 'data-id');
        this.showTip(id);
    }
}
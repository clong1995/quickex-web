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
        this.table_th = coo.query('.table_th', this.domain, true);
        this.select_btn = coo.query('.select_btn', this.domain);
        this.table_body = coo.query('.table_body', this.domain);

        this.table_th_select=coo.query('.select_btn', this.table_body,true);


        // this.siblings=coo.siblings( this.select_btn);
        // console.log(this.siblings);
    }

    //添加事件
    addEvent() {
        // coo.on('.close', this.domain, 'click', t => this.close());
        coo.on('.table_th', this.domain, 'click', (t1, t2) => this.table_th_click(t1, t2));

        //全部选择
        coo.on('.table_head', this.domain, 'click', (t1, t2) => this.select_th_all(t1, t2));

    }

    hide() {
        coo.hide(this.domain);
    }

    show(id) {
        coo.show(this.domain);
        this.currCompanyId = id;

        //TODO 这里写获取数据的逻辑
        console.log('当前左侧选中的公司ID是：',this.currCompanyId);
        console.log('当前在== 资料库 ==模块：');
    }

    table_th_click(t1, t2) {
        const select_btn = coo.query('.select_btn', t1);
        coo.toggleClass(select_btn, 'active')
    }

    select_th_all(t1, t2) {

        if (coo.hasClass(t2, "select_btn")) {

            if(coo.hasClass(t2,"active")){
                coo.removeClasses( this.table_th_select,'active');
            }else{
                coo.addClasses( this.table_th_select,'active');
            }


            coo.toggleClass(t2, 'active');



           //coo.toggleClass( this.table_th_select, 'active',"active");

        }

    }

}
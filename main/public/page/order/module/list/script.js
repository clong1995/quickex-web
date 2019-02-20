class Module {
    //构造
    constructor(app, domain) {
        this.app = app;
        this.domain = domain;
        //查询dom
        this.queryDom();
        //绑定事件
        this.addEvent();

        this.selectNum = 0;
    }

    //查询dom
    queryDom() {
        //this.usernameDom = coo.query('.username', this.domain);
        this.table_th = coo.query('.table_th', this.domain, true);
        this.select_btn = coo.query('.select_btn', this.domain);
        this.table_body = coo.query('.table_body', this.domain);

        this.table_th_select = coo.query('.select_btn', this.table_body, true);

        this.table_tips_text = coo.query('.table_tips_text', this.domain);


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

    show() {
        coo.show(this.domain);
    }

    table_th_click(t1, t2) {
        const select_btn = coo.query('.select_btn', t1);
        coo.toggleClass(select_btn, 'active');

        console.log(t2);
        if (coo.hasClass(select_btn, 'active')) {
            this.selectNum++;
        } else {
            this.selectNum--;
        }
        this.handle_order_num(this.selectNum);

    }

    select_th_all(t1, t2) {
        if (coo.hasClass(t2, "select_btn")) {

            if (coo.hasClass(t2, "active")) {
                coo.removeClasses(this.table_th_select, 'active');
                this.selectNum = 0;

            } else {
                coo.addClasses(this.table_th_select, 'active');
                this.selectNum = 16;
            }
            this.handle_order_num(this.selectNum);
            coo.toggleClass(t2, 'active');

        }
    }

    //订单个数的改变

    handle_order_num(selectNum) {
        selectNum = selectNum > 0 ? selectNum : 0;
        coo.text(this.table_tips_text, selectNum + "个");
    }


}
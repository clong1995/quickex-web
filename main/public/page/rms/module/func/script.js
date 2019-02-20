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
        coo.on('.role-title', this.domain, 'click', (t1, t2) => this.pickingRoleTitle(t1, t2));
        coo.on('.role-btn', this.domain, 'click', (t1, t2) => this.roleClick(t1, t2));
    }

    init() {
        this.initList();
    }

    initList() {

    }

    showStory() {
        coo.show(this.addContentDom);
    }

    show() {
        coo.show(this.domain);
    }

    hide() {
        coo.hide(this.domain);
    }


    // 选中与取消
    pickingRoleTitle(t1, t2) {
        // let active = coo.hasClass(t2, 'active');
        // if (active) {
        //     coo.removeClass(t2, 'active');
        // } else if (!active) {
        //     coo.addClass(t2, 'active');
        // }
        let active = $(t2).hasClass('active');
        if (active) {
            $(t2).removeClass('active');
            $(t2).parent().parent().removeClass('active');
        } else if (!active) {
            $(t2).addClass('active');
            $(t2).parent().parent().addClass('active');
        }
    }

    roleClick(t1, t2) {
        let btnNum = $(t1).attr('data-id');
        if (btnNum == 1) {
            this.selectList2(btnNum);
        } else if (btnNum == 2) {
            this.selectList2(btnNum);
        } else if (btnNum == 3) {
            this.selectList2(btnNum);
        } else if (btnNum == 4) {
            this.selectList2(btnNum);
        } else if (btnNum == 5) {
            this.selectList2(btnNum);
        } else if (btnNum == 6) {
            this.selectList2(btnNum);
        } else if (btnNum == 7) {
            this.selectList1();
        }

        $('.role-btn', this.domain).removeClass('active');
        $(t1).addClass('active');
    }

    selectList1() {
        // 按钮
        let btnList = `<div class='btn all'>全选</div>
                        <div class='btn start'>授权</div>
                        <div class='btn clear'>停用</div>
                        <div class='add'>创建自定义模板</div>`;

        $('.func-content').empty();
        $('.func-content').html(btnList);

        // 权限列表
        let list = `<div class='role-select-content'>
                        <div class='role-title'><span class='txt'>内容管理功能</span><span class='icon'></span></div>
                        <div class='role-item-content'>
                            <div class='role-item'><span class='txt'>故事流</span></div>
                            <div class='role-item'><span class='txt'>DI编辑器</span></div>
                            <div class='role-item'><span class='txt'>三维模型编辑器</span></div>
                            <div class='role-item'><span class='txt'>UE4编辑器</span></div>
                        </div>
                    </div>`;
        $('.select-content').empty();
        $('.select-content').html(list);
    }

    selectList2(btnNum) {
        // 按钮
        let btnList = `<div class='btn start'>授权</div>
                        <div class='btn clear'>停用</div>`;

        $('.func-content', this.domain).empty();
        $('.func-content', this.domain).html(btnList);

        // 权限列表
        let list = `<div class='role-select-content active'>
                        <div class='role-title'><span class='txt'>内容管理功能${btnNum}</span></div>
                        <div class='role-item-content'>
                            <div class='role-item'><span class='txt'>故事流</span></div>
                            <div class='role-item'><span class='txt'>DI编辑器</span></div>
                            <div class='role-item'><span class='txt'>三维模型编辑器</span></div>
                            <div class='role-item'><span class='txt'>UE4编辑器</span></div>
                        </div>
                    </div>`;
        $('.select-content', this.domain).empty();
        $('.select-content', this.domain).html(list);
    }

}
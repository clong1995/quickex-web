class App {
    //初始化函数
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
        this.addExhibition = $(".list_model>.add_btn", this.domain);
    }

    //添加事件
    addEvent() {

        this.addExhibition.on("click", (e) => {
            // 添加展厅 弹框
            this.app.toggleModule(this.app.indexObj["base-window"]);
        });
    }




}
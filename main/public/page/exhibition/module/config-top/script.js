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
        this.btn = $('.btn', this.domain);


        // this.nameEle = this.app.getModule("config-left").nameEle;
        // this.floorEle = this.info.eq(1).find('input');
        // this.peopleEle = this.info.eq(2).find('input');
        // this.sceneEle = this.info.eq(3).find('input');
        // this.plan = this.info.eq(4).find('img');
        //
        // this.imgMax=$('.main_center>.img_block>img');
        console.log(this.nameEle);
    }

    //添加事件
    addEvent() {
        this.btn.on('click', (e) => this.btn_click(e));
    }

    btn_click(e) {
        const
            {
                $that,
                $this
            } = this.app.get_this_that(e);

        const LEFT = this.app.getModule("config-left");

        const data = {
            name: LEFT.nameEle.val(),
            "building": 1,
            id:LEFT.id,
            floor: parseInt(LEFT.floorEle.val()) || 1,
            people: parseInt(LEFT.peopleEle.val()) || 1,
            scene: LEFT.sceneEle.val(),
            plan: LEFT.plan.attr('src')
        };


        shim.ajaxJWT(CONFIG.javaApi("/exhibition/updateExhibition"), {
            data: data,
            success: res => {
                if (res.code === 0) {// 添加成功
                    console.log(data);
                    this.app.toggleModule(this.app.indexObj['base']);
                    this.app.getMoudle("base").initData();
                } else {
                    alert(res.msg);
                    console.log(res.msg);
                }
            }
        });


    }
}
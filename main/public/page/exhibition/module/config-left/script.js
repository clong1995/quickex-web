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

        this.info = $(".info", this.domain);
        this.nameEle = this.info.eq(0).find('input');
        this.floorEle = this.info.eq(1).find('input');
        this.peopleEle = this.info.eq(2).find('input');
        this.sceneEle = this.info.eq(3).find('input');
        this.plan = this.info.eq(4).find('img');

        this.imgMax=$('.main_center>.img_block>img');
    }

    //添加事件
    addEvent() {

        this.addExhibition.on("click", (e) => {
            // 添加展厅 弹框
            this.app.toggleModule(this.app.indexObj["base-window"]);
        });
    }

    initData(id) {

        this.id=id;

        shim.ajaxJWT(CONFIG.javaApi("/exhibition/getExhibitionById"), {
            data: {
                "id": id
            },
            success: res => {
                if (res.code === 0) {//
                    console.log(res);
                    this.updateInfo(res.data[0]);

                } else {
                    alert(res.msg);
                    console.log(res.msg);
                }
            }
        });
    }

    updateInfo(d) {
        this.nameEle.val(d.name);
        this.floorEle.val(d.floor);
        this.peopleEle.val(d.people);
        this.sceneEle.val(d.scene);
        this.plan.attr("src", d.plan);
        this.imgMax.attr("src", d.plan);
    }


    getAllEle(){
        //获取所有的ele元素
        return this;
    }

}
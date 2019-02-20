class App {
    //初始化函数
    constructor(app, domain) {
        this.app = app;
        this.domain = domain;
        this.tabIndex = 0;
        this.isSubmit = true;
        //查询dom
        this.queryDom();
        //绑定事件
        this.addEvent();

    }

    //查询dom
    queryDom() {
        //保存展厅弹框
        this.save_btn = $('.save_btn', this.domain);
        this.reset_btn = $('.reset_btn', this.domain);

        //弹框 整体
        this.window_main = $('.window_main', this.domain);

        this.inputEle = this.window_main.find(".info input");
        this.imgEle = this.window_main.find(".img_block>img");
        this.nameEle = this.inputEle.eq(0);
        this.floorEle = this.inputEle.eq(1);
        // this.floorEle = this.inputEle.eq(1);
        this.peopleEle = this.inputEle.eq(2);
        this.sceneEle = this.inputEle.eq(3);
        this.plan = this.imgEle.attr("src");

        //this.resetStatus();

    }

    //添加事件
    addEvent() {
        this.save_btn.on('click', (e) => {
            this.save_btn_click(this.makeData());
        });
        this.reset_btn.on('click', (e) => {
            this.reset_btn_click(e);
        });
        this.inputEle.on("blur focus input", (e) => {
            this.checkInput(e);
        });

    }

    save_btn_click(_data) {

        if (this.isSubmit) {
            shim.ajaxJWT(CONFIG.javaApi("/exhibition/addExhibition"), {
                data: _data,
                success: res => {
                    if (res.code === 0) {// 添加成功
                        this.app.toggleModule(this.app.indexObj["base"]);
                        this.app.getModule("base").toggleStyle().initData();
                        // todo 添加新的数据
                        this.addList();
                        this.resetStatus();

                        //重新刷新页面

                    } else {
                        alert(res.msg);
                        console.log(res.msg);
                    }
                }
            });
        }
    }

    addList() {
        // todo 展厅数据添加
    }

    reset_btn_click(e) {
        // 取消
        this.resetStatus();
        this.app.toggleModule(this.app.indexObj["base"]);
    }

    makeData(e) {
        // todo 拼接数据
        this.window_main.find(".area").each((i, item) => {
            console.log("i:" + i);
            if ($(item).find("input").val() === "" && i !== 4) {
                if (i !== 5) {
                    this.isSubmit = false;
                    $(item).addClass("error");
                }
            } else {

            }
        });

        return {
            name: this.nameEle.val(),
            floor: parseInt(this.floorEle.val()) || 1,
            people: parseInt(this.peopleEle.val()) || 1,
            scene: this.sceneEle.val(),
            plan: this.plan
        }
    }

    checkInput(e) {
        const
            {
                $this,
                $that
            } = this.app.get_this_that(e),
            index = $this.parents(".info").index();

        if (index === 0 || index === 1 || index === 2 || index === 3) {
            console.log('0000000000');
            if (e.type === "blur") {
                if ($this.val() === "") {
                    this.isSubmit = false;
                    $this.parent().addClass("error");
                }
            } else if (e.type === "focus") {

            } else if (e.type === "input") {
                if ($this.val() !== "") {
                    $this.parent().removeClass("error");
                    this.isSubmit = true;
                }
            }
        }
    }

    resetStatus(e) {
        this.inputEle.val("");
        this.inputEle.parent().removeClass("error");
        //this.nameEle.focus();
    }


}
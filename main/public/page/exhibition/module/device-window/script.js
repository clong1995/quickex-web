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
        //保存设备弹框
        this.save_btn = $('.save_btn', this.domain);
        this.reset_btn = $('.reset_btn', this.domain);

        this.type_text = $('.type_text', this.domain);
        this.type = $('.type', this.domain);

        // 设备信息
        this.info = $('.info', this.domain);
        console.log(this.info);
        this.typeEle = this.info.eq(0).find('.area input');
        this.nameEle = this.info.eq(1).find('.area input');

        this.macEle = this.info.eq(2).find('.area input');
        this.ipEle = this.info.eq(3).find('.area input');
        this.remakeEle = this.info.eq(4).find('.area textarea');
    }

    //添加事件
    addEvent() {
        this.save_btn.on('click', (e) => {
            this.save_btn_click(e);
        });
        this.reset_btn.on('click', (e) => {
            this.reset_btn_click(e);
        });

        this.type.on("click", (e) => {
            this.type_click(e)
        });

        this.type_text.on("click", (e) => {
            this.down_click(e)
        });

    }

    save_btn_click(e) {
        // todo 添加新的数据
        this.addList();
    }

    addList() {
        // todo 设备数据添加

        const _data = {
            "category": this.typeEle.attr("data-id") || 1,
            "exhibition": this.exhibitionId,
            "ip": this.ipEle.val(),
            "mac": this.macEle.val(),
            "name": this.nameEle.val(),
            "remark": this.remakeEle.val()
        };
        const data = {
            "category": 1,
            "exhibition": this.exhibitionId,
            "ip": "127.0.0.1",
            "mac": "0e:15:c2:d9:31:a6",
            "name": "成龙量子计算机",
            "remark": "简介"
        };

        shim.ajaxJWT(CONFIG.javaApi("/device/addDevice"), {
            data: _data,
            success: res => {
                if (res.code === 0) {// 获取消息成功
                    if (this.windowType === 0) { //设备列表弹框

                        this.app.toggleModule(this.app.indexObj["device"]);
                        this.app.getModule("device").initData();

                    } else if (this.windowType === 1) {//展厅配置的设备列表弹框
                        this.app.toggleModule(this.app.indexObj["config"]);
                    }
                } else {
                    alert(res.msg);
                    console.log(res.msg);
                }
            }
        });

    }

    reset_btn_click(e) {
        // 取消
        if (this.windowType === 0) { //设备列表弹框
            this.app.toggleModule(this.app.indexObj["device"]);
        } else if (this.windowType === 1) {//展厅配置的设备列表弹框
            this.app.toggleModule(this.app.indexObj["config"]);
        }
    }

    down_click(e) {
        const
            {
                $this,
                $that
            } = this.app.get_this_that(e);

        $this.toggleClass("active");
        this.type.toggleClass("hide");
    }

    type_click(e) {
        const
            {
                $this,
                $that
            } = this.app.get_this_that(e),
            index = $this.index();

        this.type_text.text($this.text());
    }

    setWindowType(type = 0) {
        // type == > 0设备列表的弹窗
        // ==>1 展厅详情的设备
        this.windowType = type;
    }

    initData() {
        //展厅 id
        this.exhibitionId = this.app.getModule("device").exhibitionId;
    }


}
class App {

    //初始化函数
    constructor(app, domain) {
        this.app = app;
        this.domain = domain;
        this.queryDom();
        this.addEvent();
    }

    queryDom() {
        this.closeBtn = $(".closeBtn", this.domain);
        this.addBtn = $(".addBtn", this.domain);

        //表格内容
        this.table_th_main = $(".table_th_main", this.domain);
        this.table_no_data = $(".table_no_data", this.domain);
        this.pagination = $(".pagination", this.domain);
        this.del = $('.del', this.domain);
    }

    //添加事件
    addEvent() {
        this.closeBtn.on("click", (e) => this.closeBtn_click(e));
        this.addBtn.on("click", (e) => this.addBtn_click(e));
        coo.on('.del', this.domain, "click", (t1, t2) => {
            this.delData(t1, t2);
        })

    }

    closeBtn_click(e) {
        $(this.domain).addClass("fadeOutRight").removeClass("fadeInRight");
        setTimeout(() => {
            this.app.toggleModule(this.app.indexObj["base"]);
            $(this.domain).addClass("fadeInRight").removeClass('fadeOutRight');
        }, 2000);
    }

    addBtn_click(e) {
        //传递展厅id
        this.app.getModule("device-window").initData();

        $(this.domain).addClass("fadeInRight").removeClass("fadeOutRight");
        this.app.toggleModule(this.app.indexObj["device-window"]);
        this.app.getModule("device-window").setWindowType(0);
    }

    setBaseInfo(exhibitionId, exhibitionName) {
        this.exhibitionId = exhibitionId;
        this.exhibitionName = exhibitionName;
        //初始化页面数据
        this.initData();
    }

    initData(pageNum = 1, pageSize = 5) {
        // todo 初始化页面数据

        shim.ajaxJWT(CONFIG.javaApi("/device/getDeviceByExhibition"), {
            data: {
                exhibition: this.exhibitionId,
                pageNum,
                pageSize
            },
            success: res => {
                if (res.code === 0) {// 获取消息成功
                    console.log(res);

                    this.makeDom(res.data);
                } else {
                    alert(res.msg);
                    console.log(res.msg);
                }
            }
        });
    }

    makeDom(d) {
        // todo 构建设备列表dom结构

        const list=d.list;

        let html = ``;
        if (d && list.length === 0) {
            this.table_no_data.removeClass('hide').siblings().addClass('hide');
            this.pagination.addClass("hide");
        } else {
            list.forEach((item, i) => {
                console.log(item);
                html += `<div class="table_th" data-id="` + item.id + `">
                    <div class="table_item table_item_detail">
                        <img src="computer.png" alt="">
                        <div class="text">
                            <div class="text_1">` + this.exhibitionName + `</div>
                            <div class="text_2">` + item.name + `</div>
                        </div>
                        <div class="do_main">
                            <ul class="do_ul">
                                <li class="edit"></li>
                                <li class="del"></li>
                                <li class="info"></li>
                            </ul>
                            <div class="text_info">
                                <div class="text_info_1">` + this.exhibitionName + `</div>
                                <div class="text_info_2">` + item.name + `</div>
                            </div>
                        </div>
                    </div>
                </div>`;
            });
            this.table_th_main.removeClass('hide').siblings().addClass('hide');
            this.pagination.removeClass("hide");
            this.table_th_main.html(html);
        }
    }

    delData(t1, t2) {
        //todo 删除一条设备数据


    }

}
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
        //表格内容
        this.table_th_main = $(".table_th_main", this.domain);
        this.table_no_data = $(".table_no_data", this.domain);
        this.pagination = $(".pagination", this.domain);

    }

    //添加事件
    addEvent() {
        this.initData();
        this.table_th_main.on('click', (e) => {
            this.table_th_click(e);
        });
        this.pagination.on("click", (e) => {
            this.handlePagination(e);
        });

    }

    showDom($dom, className = "hide") {
        $dom.addClass(className);
    }

    hideDom($dom, className = "hide") {
        $dom.removeClass(className);
    }

    table_th_click(e) {
        // todo 处理每条表单的点击事件
        const
            {
                $this
            } = this.app.get_this_that(e),

            table_th = $this.parents(".table_th"),
            id = parseInt(table_th.attr("data-id")),
            exhibition=table_th.attr("data-name");

        table_th.addClass('active');

        if ($this.hasClass("device")) { //设备列表
            // 设备

            this.app.getModule("device").setBaseInfo(id,exhibition);

            this.app.toggleModule(this.app.indexObj["device"]);

        } else if ($this.hasClass("config")) { //配置
            // 配置
            this.app.toggleModule(this.app.indexObj["config"]);

            this.app.getModule("config-left").initData(id);

            //展厅信息
            this.app.getModule("config-right").setBaseInfo(id,exhibition);

        } else if ($this.hasClass("del")) { // 删除
            // 删除
            this.delData(id);
        }
    }

    delData(id) {
        // todo 删除一条表单数据
        shim.ajaxJWT(CONFIG.javaApi("/exhibition/delExhibition"), {
            data: {
                id
            },
            success: res => {
                if (res.code === 0) {// 获取消息成功
                    console.log(res.data);
                    this.initData();
                } else {
                    alert(res.msg);
                    console.log(res.msg);
                }
            }
        });


    }


    // 有无数据的切换
    toggleStyle(hasData = true) {

        if (hasData) {
            this.table_no_data.addClass("hide");
            this.table_th_main.removeClass("hide");
            this.pagination.removeClass("hide");
        } else {
            this.table_no_data.removeClass("hide");
            this.table_th_main.addClass("hide");
            this.pagination.addClass("hide");
        }
        return this;
    }


    initData(pageNum = 1, pageSize = 15) {
        // todo 初始化页面数据
        shim.ajaxJWT(CONFIG.javaApi("/exhibition/getExhibitionByPage"), {
            data: {
                "pageNum": pageNum,
                "pageSize": pageSize
            },
            success: res => {
                if (res.code === 0) {// 获取消息成功
                    console.log(res.data);
                    this.makeTableData(res.data);
                } else {
                    alert(res.msg);
                    console.log(res.msg);
                }
            }
        });
    }

    makeTableData(d) {
        // todo 拼接表单DOM结构
        this.toggleStyle();
        let html = "";
        d.list.forEach((item, i) => {
            html += `<div class="table_th" data-id="` + item.id + `" data-name="`+item.exhibition+`">
                    <div class="table_item id">` + (i + 1) + `</div>
                    <div class="table_item floorId">` + item.building + `</div>              
                    <div class="table_item name">` + item.exhibition + `</div>
                    <div class="table_item"><span class="device">` + item.deviceCount + `</span></div>
                    <div class="table_item useStatus">不可见</div>
                    <div class="table_item postStatus">带发布</div>
                    <div class="table_item table_item_detail do">
                        <ul class="do_ul">
                            <li class="config">配置</li>
                            <li class="del">删除</li>
                        </ul>
                    </div>
                </div>`;
        });
        this.table_th_main.html(html);

        let pagination = `<li class="prev"><</li>`;
        d.navigatepageNums.forEach(num => {
            if (d.pageNum === num) {
                pagination += `<li class="pageNum active">` + num + `</li>`;
            } else {
                pagination += `<li class="pageNum">` + num + `</li>`;
            }
        });
        pagination += `<li class="next">></li>`;

        this.pagination.html(pagination);
    }

    handlePagination(e) {
        // todo 处理切页操作
        const
            {
                $this,
                $that
            } = this.app.get_this_that(e);

        if ($this.hasClass('pageNum')) {
            this.initData(parseInt($this.text()));
        } else if ($this.hasClass("prev")) {

            const
                activeEle = $this.siblings('.active'),
                siblingsEle = activeEle.prev('.prev'),
                activeIndex = parseInt(activeEle.text());

            let index;

            if (siblingsEle.length === 0) {
                index = activeIndex - 1;
                this.initData(index);
            } else {
                index = activeIndex;
            }

        } else if ($this.hasClass("next")) {

            const
                activeEle = $this.siblings('.active'),
                siblingsEle = activeEle.prev('.next'),
                activeIndex = parseInt(activeEle.text());

            let index;

            if (siblingsEle.length === 0) {
                index = activeIndex + 1;
                this.initData(index);
            } else {
                index = activeIndex;
            }

        }
    }
}
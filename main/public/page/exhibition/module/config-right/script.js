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
        this.add = $(".add", this.domain);

        //表格内容
        this.table_th_main = $(".table_th_main", this.domain);
        this.table_no_data = $(".table_no_data", this.domain);
        this.pagination = $(".pagination", this.domain);
    }

    //添加事件
    addEvent() {
        this.add.on("click", (e) => {
            // 添加设备弹框
            this.app.toggleModule(this.app.indexObj["device-window"]);

            this.app.getModule("device-window").setWindowType(1);
        });
    }
    setBaseInfo(exhibitionId,exhibitionName){
        this.exhibitionId=exhibitionId;
        this.exhibitionName=exhibitionName;
        //初始化页面数据
        this.initData();
    }

    initData(d){


        let html=``;
        if(d&&d.length===0){
            this.table_no_data.removeClass('hide').siblings().addClass('hide');
            this.pagination.addClass("hide");
        }else{
            d.forEach((item,i)=>{
                console.log(item);
                html+=`<div class="table_th">
                    <div class="table_item table_item_detail">
                        <img src="computer.png" alt="">
                        <div class="text">
                            <div class="text_1">`+this.exhibitionName+`</div>
                            <div class="text_2">`+item.name+`</div>
                        </div>
                        <div class="do_main">
                            <ul class="do_ul">
                                <li class="edit"></li>
                                <li class="del"></li>
                                <li class="info"></li>
                            </ul>
                            <div class="text_info">
                                <div class="text_info_1">`+this.exhibitionName+`</div>
                                <div class="text_info_2">`+item.name+`</div>
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

}
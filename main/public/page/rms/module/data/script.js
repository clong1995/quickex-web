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
        this.tableHead = coo.query('.table_head', this.domain);
        this.tableBody = coo.query('.table_body', this.domain);
        this.tableBodySelect = coo.query('.select_btn', this.tableBody, true);

        this.userWrap = coo.query('#user-wrap', this.domain);
        this.ziliaoWrap = coo.query('#ziliao-wrap', this.domain);
    }

    addEvent() {
        coo.on('.select_btn', this.tableHead, 'click', t => this.selectHeadBtn(t));
        coo.on('.select_btn', this.tableBody, 'click', t => this.selectBtn(t));


        coo.on('.pageNum', this.domain, 'click', t => this.FYpage(t)); //翻页
        coo.on('.prev', this.domain, 'click', t => this.leftPage(t));  //上一页
        coo.on('.next', this.domain, 'click', t => this.rightPage(t)); //下一页

        coo.on('.ok', this.domain, 'click', t => this.QYData(t));// 批量启用
        coo.on('.no', this.domain, 'click', t => this.TYData(t));// 批量停用

        coo.on('.start', this.domain, 'click', t => this.start(t));// 单个启用
        coo.on('.clear', this.domain, 'click', t => this.clear(t));// 单个停用


        coo.on('#search', this.domain, 'click', t => this.search(t));// 搜索

    }

    init() {
        this.initList();
        this.listAjax(1);
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

    // 全选
    selectHeadBtn(t) {
        let classActive = coo.hasClass(t, 'active');
        this.tableBodySelect = coo.query('.select_btn', this.tableBody, true);
        if (classActive) {
            coo.removeClass(t, 'active');
            for (let i = 0; i < this.tableBodySelect.length; i++) {
                coo.removeClass(this.tableBodySelect[i], 'active');
                coo.removeClass(this.tableBodySelect[i].parentNode, 'active');
            }

            $('.num', this.domain).html('0个')

        } else if (!classActive) {
            coo.addClass(t, 'active');
            for (let i = 0; i < this.tableBodySelect.length; i++) {
                coo.addClass(this.tableBodySelect[i], 'active');
                coo.addClass(this.tableBodySelect[i].parentNode, 'active');
            }

            let selectNum = $('.select_btn.active', this.domain).length;
            $('.num', this.domain).html(selectNum + '个')
        }
    }


    // 单选
    selectBtn(t) {
        let classActive = coo.hasClass(t, 'active');
        if (classActive) {
            coo.removeClass(t.parentNode, 'active');
            coo.removeClass(t, 'active');

            coo.removeClass(coo.query('.select_btn', this.tableHead), 'active');
        } else if (!classActive) {
            coo.addClass(t.parentNode, 'active');
            coo.addClass(t, 'active');
        }

        let selectNum = $('.select_btn.active', this.domain).length;
        $('.num', this.domain).html(selectNum + '个');
        if (selectNum == 16) {
            coo.addClass(coo.query('.select_btn', this.tableHead), 'active');
        }
    }


    listAjax(pageNum) {
        //let pageNum = pageNum;页数
        let pageSize = 5;//每页条数
        let search = $('.search-content .search', this.domain).val(); //搜索字段
        let userid = $('.search-content .search', this.domain).attr('userid');//用户id
        let user = userid ? userid : '';
        shim.ajaxJWT(CONFIG.javaApi('/customer/getAggCustomerList'), {
            data: {
                pageNum: pageNum,
                pageSize: pageSize,
                search: search,
                user: user
            },
            success: res => {
                if (res.code == 0) {

                    // 加载列表
                    let listdata = res.data.list;
                    let list = '';
                    $('.table_body', this.domain).empty();
                    for (let i = 0; i < listdata.length; i++) {
                        list += `
                        <div class="table_th ${(listdata[i].relation ? "active" : "")}">
                            <div class="select_btn ${(listdata[i].relation ? "active" : "")}"></div>
                            <div class="table_item fileName">${listdata[i].name}</div>
                            <div class="table_item uploadTime">${listdata[i].updateTime}</div>
                            <div class="table_item userName">${listdata[i].story}</div>
                            <div class="table_item fileType">${listdata[i].chapter}</div>
                            <div class="table_item size">${listdata[i].user}</div>
                            <div class="table_item table_item_detail do">
                                <ul class="do_ul">
                                    <li class='start ${(listdata[i].usable == 0 ? "" : "active")}'>启动</li>
                                    <li class='clear ${(listdata[i].usable == 0 ? "active" : "")}'>停用</li>
                                </ul>
                            </div>
                        </div>`;
                    }
                    $('.table_body', this.domain).append(list);


                    // 翻页加载
                    let pageNumData = res.data.navigatepageNums;
                    let pagenum = '<li class="prev">&lt;</li>';
                    for (let i = 0; i < pageNumData.length; i++) {
                        if (pageNum == i + 1) {
                            pagenum += `<li class="pageNum xuanzhong">${pageNumData[i]}</li>`;
                        } else if (i == pageNumData.length - 1) {
                            pagenum += `<li class="pageNum max">${pageNumData[i]}</li>`;
                        } else {
                            pagenum += `<li class="pageNum">${pageNumData[i]}</li>`;
                        }
                    }
                    pagenum += '<li class="next">&gt;</li>';


                    $('.pagination', this.domain).empty();
                    $('.pagination', this.domain).append(pagenum);

                }
            }
        });
    }

    FYpage(t) {
        let pageNum = $(t).html();
        this.listAjax(pageNum);
    }


    leftPage() {
        let pageNum = $('.xuanzhong', this.domain).html();
        if (pageNum > 1) {
            pageNum--;
        }
        this.listAjax(pageNum);
    }

    rightPage() {
        let pageNum = $('.xuanzhong', this.domain).html();
        let max = $('.max', this.domain).html();
        if (pageNum < max) {
            pageNum++;
        }
        this.listAjax(pageNum);
    }

    setUserId(userid) {
        $('.search-content .search', this.domain).attr('userid', userid);
    }


    setQYuserId(userid) {
        $('.btn-content .ok', this.domain).attr('userid', userid);
        $('.btn-content .no', this.domain).attr('userid', userid);
    }

    // 启用
    QYData() {
        let user = $('.btn-content .ok', this.domain).attr('userid');
        let customerList = $('.select_btn.active', this.domain);
        let customer = '';


        if (customerList.length > 0) {
            for (let i = 0; i < customerList.length; i++) {
                customer += $(customerList[i]).attr('data-id') + ',';
            }
        }

        if (user == '') {
            //未选择用户提示
            coo.show(this.userWrap);
            setTimeout(() => {
                coo.hide(this.userWrap);
            }, 2000)
        } else if (customer == '') {
            //未选择资料提示
            coo.show(this.ziliaoWrap);
            setTimeout(() => {
                coo.hide(this.ziliaoWrap);
            }, 2000)
        } else {
            shim.ajaxJWT(CONFIG.javaApi('/customer/accreditCustomerToUser'), {
                data: {
                    customer: customer,
                    user: user,
                    usable: 1
                },
                success: res => {
                    if (res.code == 0) {
                        let pageNum = $('.xuanzhong', this.domain).html();
                        this.listAjax(pageNum);
                    }
                }
            });
        }

    }

    //停用
    TYData() {
        let user = $('.btn-content .no', this.domain).attr('userid');
        let customerList = $('.select_btn.active', this.domain);
        let customer = '';

        for (let i = 0; i < customerList.length; i++) {
            customer += $(customerList[i]).attr('data-id') + ',';
        }

        if (user == '') {
            //未选择用户提示
            coo.show(this.userWrap);
            setTimeout(() => {
                coo.hide(this.userWrap);
            }, 2000)
        } else if (customer == '') {
            //未选择资料提示
            coo.show(this.ziliaoWrap);
            setTimeout(() => {
                coo.hide(this.ziliaoWrap);
            }, 2000)
        } else {
            shim.ajaxJWT(CONFIG.javaApi('/customer/accreditCustomerToUser'), {
                data: {
                    customer: customer,
                    user: user,
                    usable: 0
                },
                success: res => {
                    if (res.code == 0) {
                        let pageNum = $('.xuanzhong', this.domain).html();
                        this.listAjax(pageNum);
                    }
                }
            });
        }
    }

    //单个启用
    start(t) {
        if (!$(t).hasClass('active')) {
            let user = $('.btn-content .no', this.domain).attr('userid');
            let customer = $(t).attr('data-id');
            shim.ajaxJWT(CONFIG.javaApi('/customer/accreditCustomerToUser'), {
                data: {
                    customer: customer,
                    user: user,
                    usable: 1
                },
                success: res => {
                    if (res.code == 0) {
                        let pageNum = $('.xuanzhong', this.domain).html();
                        this.listAjax(pageNum);
                    }
                }
            });
        }
    }

    // 单个停用
    clear(t) {
        let user = $('.btn-content .no', this.domain).attr('userid');
        let customer = $(t).attr('data-id');
        shim.ajaxJWT(CONFIG.javaApi('/customer/accreditCustomerToUser'), {
            data: {
                customer: customer,
                user: user,
                usable: 0
            },
            success: res => {
                if (res.code == 0) {
                    let pageNum = $('.xuanzhong', this.domain).html();
                    this.listAjax(pageNum);
                }
            }
        });
    }

    search() {
        this.listAjax(1);
    }
}
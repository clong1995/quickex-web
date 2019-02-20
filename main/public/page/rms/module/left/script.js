class Module {
    //构造
    constructor(app, domain) {
        this.app = app;
        this.domain = domain;

        this.init();

        this.queryDom();
        //绑定事件
        this.addEvent();

        this.leftList();
    }


    queryDom() {
        console.log("====");
        console.log(window);
        console.log(jQuery);
        console.log(jQuery.fn.jquery);
        console.log($);

        this.searchBox = coo.query('.searchBox', this.domain);

        this.title = coo.query('.title', this.domain);
        this.listContent = coo.query('.list-content', this.domain);

        this.adduser = coo.query('.title', this.domain);
        this.addWrap = coo.query('.add-wrap', this.domain);
        this.bottomDom = coo.query('.bottom', this.domain);

        this.resPasswordDom = coo.query('.res-wrap', this.domain)// 重置密码弹框dom
        this.delUserDom = coo.query('.del-user', this.domain)// 删除用户弹框dom
        this.stopWarrentDom = coo.query('.stop-warrant', this.domain)//停用用户弹出框dom


        this.success = coo.query('.success', this.domain); //添加用户成功
        this.failed = coo.query('.failed', this.domain); //添加用户失败

    }

    addEvent() {
        coo.on('.btn', this.searchBox, 'click', (t1, t2) => this.leftList(t1, t2))// 搜索

        coo.on('.select-btn', this.title, 'click', (t1, t2) => this.listSelectAll(t1, t2))//菜单列表全选
        coo.on('.select-btn', this.listContent, 'click', (t1, t2) => this.listClick(t1, t2))//菜单列表单选

        // coo.on('.txt', this.listContent, 'click', (t1, t2) => this.dbclick(t1, t2))// 列表双击编辑
        coo.on('.txt', this.listContent, 'click', (t1, t2) => this.txtclick(t1, t2))// 列表双击编辑
        coo.on('.txtSelect', this.listContent, 'click', (t1, t2) => this.dbclick(t1, t2))// 列表双击编辑


        coo.on('.add', this.adduser, 'click', (t1, t2) => this.showAddUser(t1, t2))  //添加按钮点击

        coo.on('.cancel', this.addWrap, 'click', (t1, t2) => this.hideAddUser(t1, t2)) //添加界面取消按钮
        coo.on('.sure', this.addWrap, 'click', (t1, t2) => this.AddUser(t1, t2)) //添加界面确定按钮

        coo.on('.res', this.bottomDom, 'click', (t1, t2) => this.showpPassword(t1, t2)) //重置密码
        coo.on('.btn', this.resPasswordDom, 'click', (t1, t2) => this.hidePassword(t1, t2)) //重置密码界面知道了点击

        coo.on('.del', this.bottomDom, 'click', (t1, t2) => this.delUser(t1, t2)) //批量删除用户
        coo.on('.cancel', this.delUserDom, 'click', (t1, t2) => this.hideDelUser(t1, t2))//删除用户取消点击
        coo.on('.icon', this.listContent, 'click', (t1, t2) => this.delUser(t1, t2)) //单个删除用户
        coo.on('.sure', this.delUserDom, 'click', (t1, t2) => this.delAjaxUser(t1, t2))//删除用户取消点击


        coo.on('.stop', this.bottomDom, 'click', (t1, t2) => this.stopUser(t1, t2)) //停用用户
        coo.on('.cancel', this.stopWarrentDom, 'click', (t1, t2) => this.hideStopUser(t1, t2))//停用取消用户


        //编辑回车事件
        $('.list-content', this.domain).keydown(event => {
            if (event.keyCode == 13) {
                let userid = $('.input-txt', this.domain).siblings('.select-btn').attr('data-id');
                let nickname = $('.input-txt', this.domain).val().trim();

                if (nickname != '') {
                    shim.ajaxJWT(CONFIG.javaApi('/user/updateEmployeeNickname'), {
                        data: {id: userid, nickname: nickname},
                        success: res => {
                            if (res.code == 0) {
                                this.leftList(); //重新加载列表

                            } else {
                                coo.show(this.failed); //显示错误提示框

                                setTimeout(() => {
                                    coo.hide(this.failed); //隐藏错误提示框
                                }, 2000)
                            }
                        }
                    });
                } else {
                    coo.show(this.failed); //显示错误提示框

                    setTimeout(() => {
                        coo.hide(this.failed); //隐藏错误提示框
                    }, 2000)
                }
            }
        })

    }


    test(e) {
        console.log(e);
    }

    init() {
        this.initList();
    }

    initList() {


    }

    showStory() {
        coo.show(this.addContentDom);
    }


    // 全选
    listSelectAll(t1) {
        let active = $(t1).hasClass('active');
        if (active) {
            $(t1).removeClass('active');
            $('.select-btn', this.listContent).removeClass('active');
            $('.txt', this.listContent).removeClass('active');
            $('.icon', this.listContent).removeClass('active');
        } else if (!active) {
            $(t1).addClass('active');
            $('.select-btn', this.listContent).addClass('active');
            $('.txt', this.listContent).addClass('active');
            $('.icon', this.listContent).addClass('active');
        }


        // 加载空data空列表
        this.app.getModule('data').setUserId('');
        this.app.getModule('data').listAjax(1);
    }


    //单选
    listClick(t1, t2) {

        let active = $(t1).hasClass('active');
        if (active) {
            $(t1).removeClass('active');
            $(t1).siblings('.txt').removeClass('active');
            $(t1).siblings('.icon').removeClass('active');
        } else if (!active) {
            $(t1).addClass('active');
            $(t1).siblings('.txt').addClass('active');
            $(t1).siblings('.icon').addClass('active');
        }

        let AllNum = $('.select-btn', this.listContent).length;
        let activeNum = $('.select-btn.active', this.listContent).length;
        if (AllNum == activeNum) {
            $('.select-btn', this.title).addClass('active');
        } else if (AllNum > activeNum) {
            $('.select-btn', this.title).removeClass('active');
        }

        //传递选择的用户id
        let userId = '';
        let userList = $('.select-btn.active', this.listContent);
        for (let i = 0; i < userList.length; i++) {
            userId += $(userList[i]).attr('data-id') + ',';
        }
        this.app.getModule('data').setQYuserId(userId);

        // 加载空data空列表
        this.app.getModule('data').setUserId('');
        this.app.getModule('data').listAjax(1);
    }

    showAddUser() {
        coo.show(this.addWrap);
    }

    hideAddUser() {
        coo.hide(this.addWrap);
    }

    AddUser() {
        let username = $('.input .username', this.addWrap).val().trim();
        let extEmail = /\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/;

        if (extEmail.test(username)) {
            shim.ajaxJWT(CONFIG.javaApi('/user/addEmployee'), {
                data: {email: username},
                success: res => {
                    if (res.code == 0) {

                        coo.show(this.success);//显示成功提示框

                        coo.hide(this.addWrap); //隐藏添加界面

                        $('.input .username', this.addWrap).val(''); //清空数据框


                        setTimeout(() => {
                            coo.hide(this.success);//隐藏成功提示框
                        }, 2000)

                        this.leftList(); //重新加载列表

                    } else {
                        coo.show(this.failed);//显示错误提示框

                        setTimeout(() => {
                            coo.hide(this.failed);//隐藏错误提示框
                        }, 2000)
                    }
                }
            });
        } else {
            coo.show(this.failed); //显示错误提示框

            setTimeout(() => {
                coo.hide(this.failed); //隐藏错误提示框
            }, 2000)
        }
    }

    //显示重置密码弹框
    showpPassword() {
        let idList = '';
        let selectList = $('.select-btn.active', this.listContent);
        if (selectList.length > 0) {
            for (let i = 0; i < selectList.length; i++) {
                idList += $(selectList[i]).attr('data-id') + ','
            }


            shim.ajaxJWT(CONFIG.javaApi('/user/restEmployeePassword'), {
                data: {idList: idList},
                success: res => {
                    if (res.code == 0) {
                        coo.show($('.res-wrap', this.domain)[0]);
                    }
                }
            });
        }
    }

    //隐藏重置密码弹框
    hidePassword() {
        coo.hide($('.res-wrap', this.domain)[0]);
    }

    //删除用户
    delUser(t1, t2) {
        coo.show(this.delUserDom);

        let delDom = $(t1);
        if (delDom.hasClass('icon')) {
            $('.sure', this.delUserDom).attr('data-id', delDom.siblings('.select-btn').attr('data-id'));
        } else if (delDom.hasClass('del')) {
            let allDElId = '';
            let selectList = $('.select-btn.active', this.listContent);
            console.log(selectList);
            for (let i = 0; i < selectList.length; i++) {
                allDElId += $(selectList[i]).attr('data-id') + ','
            }
            $('.sure', this.delUserDom).attr('data-id', allDElId);
        }
    }


    delAjaxUser(t1, t2) {
        let employeeList = $(t1).attr('data-id');
        shim.ajaxJWT(CONFIG.javaApi('/user/delEmployeeByIdList'), {
            data: {employeeList: employeeList},
            success: res => {
                if (res.code == 0) {
                    console.log('删除成功')
                    this.leftList(); //重新加载列表

                    coo.hide(this.delUserDom);
                } else {
                    console.log('删除失败')
                }
            }
        });

    }

    //删除用户取消
    hideDelUser() {
        coo.hide(this.delUserDom);
    }

    //停用用户
    stopUser() {
        coo.show(this.stopWarrentDom);
    }

    hideStopUser() {
        coo.hide(this.stopWarrentDom);
    }

    // 列表加载
    leftList() {
        let likeName = $('.search', this.searchBox).val().trim();
        shim.ajaxJWT(CONFIG.javaApi('/user/getEmployeeList'), {
            data: {likeName: likeName},
            success: res => {
                if (res.code == 0) {
                    let list = '';
                    let listData = res.data
                    for (let i = 0; i < listData.length; i++) {
                        list += `<li class='list'>
                                   <div class='list-title'>
                                        <span class='select-btn' data-id='${listData[i].id}'></span><span data-id='${listData[i].id}' class='txt'>${(listData[i].nickname ? listData[i].nickname : listData[i].username)}</span><span class='icon'></span>
                                   </div>
                               </li>`;


                        $('.list-content', this.domain).empty();
                        $('.list-content', this.domain).append(list);
                    }
                }
            }
        });
    }

    //点击变背景色
    txtclick(t1, t2) {
        $('.list', this.domain).removeClass('list-bg');
        $('.txt', this.domain).removeClass('txtSelect');

        $(t1).addClass('txtSelect');
        $(t1).parent().parent().addClass('list-bg');


        let inputTxt = $('.input-txt', this.domain)
        if (inputTxt.length > 0) {
            for (let i = 0; i < inputTxt.length; i++) {
                this.inputSpan(inputTxt[0]);
            }
        }

        // 加载单个用户  data列表
        let userid = $(t1).attr('data-id');
        let activeNum = $('.select-btn.active', this.listContent).length;
        if (activeNum == 0) {
            this.app.getModule('data').setUserId(userid);
            this.app.getModule('data').listAjax(1);

            this.app.getModule('data').setQYuserId(userid);
        }
    }

    //双击span变input
    dbclick(t1, t2) {
        var Newobj = document.createElement('input');
        Newobj.value = t1.innerText;
        Newobj.setAttribute("type", "text");
        Newobj.setAttribute("checked", "checked");
        Newobj.setAttribute("class", "input-txt");
        Newobj.setAttribute("name", t1.innerText);
        //插入替换后的Input
        t1.parentNode.appendChild(Newobj);
        //删除表单原控件
        //obj.removeNode();
        t1.parentNode.removeChild(t1);
    }

    //input替换成span
    inputSpan(t1) {
        var Newobj = document.createElement('span');
        // Newobj.innerText = t1.value;
        Newobj.innerText = t1.getAttribute('name');
        Newobj.setAttribute("class", "txt");
        //插入替换后的Input
        t1.parentNode.appendChild(Newobj);
        //删除表单原控件
        //obj.removeNode();
        t1.parentNode.removeChild(t1);
    }
}

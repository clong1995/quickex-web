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
        this.devListDom = coo.query('.devList', this.domain);
    }

    addEvent() {
        coo.on('.devTitle', this.devListDom, 'click', t => this.showDevList(t));
        //点击展项总控
        coo.on('.allBtn', this.devListDom, 'click', t => this.itemAllCrl(t));
        //展项分空
        coo.on('.itemBtn', this.devListDom, 'click', t => this.itemCrl(t));
    }

    itemAllCrl(target) {
        let parent = coo.parent(target, '.devItem');
        //let id = coo.attr(parent, 'data-id');
        let ids = [];
        //TODO 这个应该从数据库查，不应该从界面获取
        coo.query('.item',parent,true).forEach(v=>ids.push(coo.attr(v,'data-id')));


        //开启或者关闭整个展项
        //通知master服务
        if (coo.hasClass(target, 'active')) {
            //关闭
            shim.ajaxJWT(CONFIG.webApi('/api/control/shutdownAllItem'), {
                data: {
                    ids: ids.join(),
                    master:this.app.getModule('menu').getCurrMaster()
                },
                success: res => {
                    if (res.code === 0) {
                        //关闭
                        coo.removeClass(target, 'active');
                        //关闭所有子项目
                        coo.query('.itemBtn', parent, true).forEach(v => coo.removeClass(v, 'active'))
                    } else {
                        alert(res.msg);
                    }
                }
            });
        } else {
            shim.ajaxJWT(CONFIG.webApi('/api/control/startAllItem'), {
                data: {
                    ids: ids.join(),
                    master:this.app.getModule('menu').getCurrMaster()
                },
                success: res => {
                    if (res.code === 0) {
                        //开启
                        coo.addClass(target, 'active');
                        //开启所有子项目
                        coo.query('.itemBtn', parent, true).forEach(v => {
                            coo.addClass(v, 'active');
                        })
                    } else {
                        alert(res.msg);
                    }
                }
            });
        }
    }

    itemCrl(target) {

    }

    init() {

    }

    initList(id) {
        shim.ajaxJWT(CONFIG.javaApi('/device/getDeviceByExhibition'), {
            data: {
                exhibition: id
            },
            success: res => {
                if (!res.code) {
                    let data = res.data;
                    let listMap = new Map();
                    data.forEach(v => {
                        let itemId = v.itemId;
                        listMap.has(itemId) ? listMap.get(itemId).push(v) : listMap.set(itemId, [v]);
                    });
                    //生成列表
                    let html = '';
                    let index = 0;
                    listMap.forEach((v, k) => {
                        html += `
                            <div class="devItem ${index ? '' : 'active'}" data-id="${k}">
                                <div class="devTitle">
                                    <div class="text">${v[0].itemName}</div>
                                    <div class="btn allBtn"></div>
                                </div>
                                <div class="list">`;
                        v.forEach(v1 => {
                            if (
                                v1.category === 1 || //台式主机
                                v1.category === 2 || //一体机
                                v1.category === 12  //幻柜
                            ) {//音量
                                html += `<div class="item" data-id="${v1.id}">
                                    <div class="title">${v1.name}</div>
                                    <div class="btn itemBtn"></div>
                                    <input type="range" min="0" max="10" step="1" value="0" />
                                    <img class="icon" src="/resource/img/voice.png"/>
                                </div>`;
                            } else {
                                html += `<div class="item" data-id="${v1.id}">
                                    <div class="title">${v1.name}</div>
                                    <div class="btn itemBtn"></div>
                                </div>`;
                            }
                        });

                        html += `</div>
                            </div>`;
                        index++;
                    });
                    coo.html(this.devListDom, html);
                } else {
                    console.error(res.data);
                }
            }
        });
    }

    showDevList(target, com = false) {
        let devItemDom = target.parentNode;
        if (coo.hasClass(devItemDom, 'active'))
            return;
        coo.query('.devItem', this.devListDom, true).forEach(v =>
            coo.hasClass(v, 'active') && coo.removeClass(v, 'active'));
        coo.addClass(devItemDom, 'active');
        //联动
        !com && this.app.getModule('main').boxActiveId(coo.attr(devItemDom, 'data-id'));
    }

    showDevListId(id) {
        coo.query('.devItem', this.devListDom, true).forEach(v =>
            coo.attr(v, 'data-id') === id && this.showDevList(coo.query('.devTitle', v), true))
    }
}
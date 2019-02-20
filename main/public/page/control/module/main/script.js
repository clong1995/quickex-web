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
        this.mapDom = coo.query('.map', this.domain);
    }

    addEvent() {
        coo.on('.box', this.domain, 'click', t => this.boxActive(t));
        // coo.on('.close', this.domain, 'click', t => this.hideStory());
    }

    boxActive(target,com=false){
        //去掉其他激活
        coo.removeClass(coo.query('.active',this.domain),'active');
        coo.addClass(target,'active');
        //联动
        !com && this.app.getModule('list').showDevListId(coo.attr(target,'data-id'));
    }

    boxActiveId(id){
        coo.query('.box',this.domain,true).forEach(v=>
            coo.attr(v,'data-id')===id && this.boxActive(v,true))
    }

    init() {

    }

    initList(id) {
        shim.ajaxJWT(CONFIG.javaApi('/item/getItemByExhibition'), {
            data: {
                exhibition: id
            },
            success: res => {
                if (!res.code) {
                    let data = res.data;
                    //console.log(data);
                    let html = '';
                    data.forEach(v => {
                        let pos = v.position ? v.position.split(',') : [0, 0, 0];
                        html += `<dvi data-id="${v.id}" class="box centerWrap ${v.position?'':'hide'}" style="
                                        top: ${pos[0]}px;
                                        left: ${pos[1]}px;
                                        width: ${pos[2]}px;
                                        height: ${pos[2]}px;">
                                <div class="list">
                                    <div class="row title">
                                        ${v.name}
                                    </div>
                                    <div class="row stat">
                                        状态：<span class="offline">离线</span>
                                    </div>
                                    <div class="row into ${v.url?'':'hide'}" data-url="${v.url}">
                                        进入展项
                                    </div>
                                </div>
                            </dvi>`;
                    });
                    coo.html(this.mapDom, html);
                } else {
                    console.error(res.data);
                }
            }
        })
    }

    showStory() {
        coo.show(this.addContentDom);
    }
}
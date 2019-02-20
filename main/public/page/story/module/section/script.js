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
        this.listDom = coo.query('.list', this.domain);
        this.roolDom = coo.query('.roll', this.listDom);
    }

    addEvent() {
        coo.on('.right', this.domain, 'click', () => this.moveRoll(0));
        coo.on('.left', this.domain, 'click', () => this.moveRoll(1));
        //添加节
        coo.on('.add', this.domain, 'click', () => this.addSecrion());
        //删除
        coo.on('.del', this.roolDom, 'click', t => this.delSection(t));
        //选中篇章
        coo.on('.item', this.roolDom, 'click', t => this.showBig(t));
    }
    init(){
        this.currSectionId = 0;
        this.roll = 0;
    }

    getSectionId() {
        return this.currSectionId;
    }

    //滚动和滑动函数
    moveRoll(direction) {
        this.roll = this.listDom.scrollLeft;
        if (!direction) {
            let wrapWidth = coo.domSize(this.listDom).width;
            let rollWidth = coo.domSize(this.roolDom).width;
            let max = rollWidth - wrapWidth;
            this.roll += 15;
            if (this.roll >= max) this.roll = max;
        } else {
            this.roll -= 15;
            if (this.roll <= 0) this.roll = 0;
        }
        this.listDom.scrollTo(this.roll, 0);
    }


    diImg(imgId,imgClassId){
        coo.ajax(CONFIG.gcDIApi('/api/blob/getData'), {
            data: {
                id: imgId,
            },
            success: res => {
                let img = res.data.data;

                if(img){
                    let imgDom = coo.query('.'+imgClassId,this.roolDom);
                    imgDom.src = img;
                }
            }
        })
    }



    /**
     * 根据篇章获取章节
     * @param chapterId
     */
    allSection(chapterId) {
        shim.ajaxJWT(CONFIG.javaApi('/section/all'), {
            data: {
                chapter: chapterId
            },
            success: res => {
                if (res.code === 0) {
                    let data = res.data;
                    let html = '';
                    let active = '';
                    data.forEach((v, i) => {
                        active = '';
                        if (!i) {
                            this.currSectionId = v.id;
                            active = 'active';
                        }

                        html += `<div class="item ${active}" data-id="${v.id}">
                                    <div class="del">✕</div>
                                    <img class="litimg litimg${v.id}" src="#" alt="">
                                    <div class="text">${v.name}</div>
                                </div>`;

                        this.diImg(v.snapshot,'litimg'+v.id);
                    });
                    coo.html(this.roolDom, html);
                    //显示最前三个章节
                    this.app.getModule('screen').initList(data, 0);
                    this.app.getModule('timeline').update();
                } else {
                    console.error(res.data)
                }
            }
        });
    }

    /**
     * 添加章节
     */
    addSecrion() {
        let chapterId = this.app.getModule('head').getCurrChapterId();
        //默认添加当前的篇章
        shim.ajaxJWT(CONFIG.javaApi('/section/add'), {
            data: {
                chapter: chapterId
            },
            success: res => {
                if (res.code === 0) {
                    //刷新列表
                    this.allSection(chapterId);
                } else {
                    console.error(res.data)
                }
            }
        });
    }

    delSection(target) {
        let id = coo.attr(coo.parent(target, '.item'), 'data-id');
        shim.ajaxJWT(CONFIG.javaApi('/section/delById'), {
            data: {
                id: id
            },
            success: res => {
                if (res.code === 0) {
                    let chapterId = this.app.getModule('head').getCurrChapterId();
                    this.allSection(chapterId);
                } else {
                    console.error(res.data)
                }
            }
        });
    }

    showBig(target) {
        this.currSectionId = coo.attr(target, 'data-id');
        coo.removeClass(coo.query('.active', this.roolDom), 'active');
        coo.addClass(target, 'active');
        let index = coo.domIndex(target);
        this.app.getModule('screen').select(index);
        //修改时间线
        this.app.getModule('timeline').update();
    }

    changeName(id, name) {
        [...coo.query('.item', this.roolDom, true)].some(v => {
            if (coo.attr(v, 'data-id') === id) {
                coo.text(coo.query('.text', v), name);
                return true;
            }
        })
    }
}
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
        this.itemDom = coo.query('.items', this.domain);
        this.roolDom = coo.query('.roll', this.itemDom);
        this.storyDom = coo.query('.story', this.domain);
        this.selectedDom = coo.query('.selected', this.storyDom);
        this.listWrapDom = coo.query('.listWrap', this.storyDom);
        this.storyListDom = coo.query('.list', this.listWrapDom);
    }

    addEvent() {
        //
        coo.on('.addChapter', this.domain, 'click', () => this.showAddChapter());
        coo.on('.back', this.domain, 'click', () => this.back());

        //左右移动
        coo.on('.right', this.domain, 'click', () => this.moveRoll(0));
        coo.on('.left', this.domain, 'click', () => this.moveRoll(1));

        //put away the story drop-down list
        coo.on('.listWrap', this.storyDom, 'click', (t, et) => this.storyListHide(t, et));

        //故事下拉菜单
        coo.on('.selected', this.storyDom, 'click', () => this.storyListShow());

        //删除
        coo.on('.del', this.roolDom, 'click', t => this.delChapter(t));

        //点击菜单
        coo.on('.item', this.roolDom, 'click', t => this.selectChapter(t));

        //修改篇章名
        coo.on('.name', this.roolDom, 'blur', t => this.updateChapterName(t));


        //点击菜单
        coo.on('.item', this.storyListDom, 'click', t => this.changeStory(t));

    }

    init() {
        this.roll = 0;
        this.currChapterId = null;
        this.storyId = parseInt(coo.getQueryVar().id);
        this.initList();
        //获取故事选择列表
        this.initStoryList();
    }

    changeStory(target){
        let id = coo.attr(target,'data-id');
        coo.link('/story?id='+id);
    }

    initStoryList() {
        shim.ajaxJWT(CONFIG.javaApi('/story/all'), {
            success: res => {
                if (res.code === 0) {
                    let data = res.data;
                    let html = '';
                    data.forEach(v => {
                        if (v.id === this.storyId)
                            coo.text(this.selectedDom, v.name);

                        html += `<div class="item" data-id="${v.id}">${v.name}</div>`;
                    });
                    coo.html(this.storyListDom, html);
                    //关闭添加窗口
                    this.hideStory();
                } else {
                    console.error(res.data)
                }
            }
        });
    }

    updateChapterName(target) {
        let name = target.value;
        coo.attr(target, {
            disabled: true
        });
        coo.removeClass(target, 'edit');
        if (name === '') {
            name = '未命名篇章';
            target.value = name;
        }
        let id = coo.attr(target.parentNode, 'data-id');
        shim.ajaxJWT(CONFIG.javaApi('/chapter/updateChapterName'), {
            data: {
                id: id,
                name: name
            },
            success: res => {
                if (res.code === 0) {

                } else {
                    console.error(res.data)
                }
            }
        });
    }


    storyListHide(target, eventTarget) {
        if (target === eventTarget) {
            coo.hide(this.listWrapDom);
        }
    }

    storyListShow() {
        coo.show(this.listWrapDom);
    }

    getStoryId() {
        return this.storyId;
    }

    initList() {
        shim.ajaxJWT(CONFIG.javaApi('/chapter/all'), {
            data: {
                story: this.storyId
            },
            success: res => {
                if (res.code === 0) {
                    let data = res.data;
                    let html = '';
                    let active = '';
                    this.currChapterId = 0;
                    data.forEach((v, i) => {
                        if (!i) {
                            active = 'active';
                            this.currChapterId = v.id;
                        } else {
                            active = '';
                        }
                        html += `<div class="item ${active}" data-id="${v.id}">
                                <input class="name ellipsis" disabled value="${v.name}">
                                <div class="del p_icons"></div>
                            </div>`;
                    });
                    coo.html(this.roolDom, html);
                    //所有节
                    this.app.getModule('section').allSection(this.currChapterId);
                } else {
                    console.error(res.data)
                }
            }
        });
    }

    selectChapter(target) {
        /*//选中
        if (coo.hasClass(target, 'active')) {
            let name = coo.query('.name', target);
            coo.attr(name, {
                disabled: null
            });
            //coo.addClass(name, 'edit');
        }else{
            //关闭
            let activeDom = coo.query('.active', this.roolDom);
            coo.removeClass(activeDom, 'active');
            let nameDom = coo.query('.name', activeDom);
            coo.attr(nameDom, {
                disabled: true
            });
        }*/

        if (coo.hasClass(target, 'active')) {
            let name = coo.query('.name', target);
            coo.attr(name, {
                disabled: null
            });
            coo.addClass(name, 'edit');
        } else {
            let activeDom = coo.query('.active', this.roolDom);
            coo.removeClass(activeDom, 'active');

            coo.addClass(target, 'active');
            let id = coo.attr(target, 'data-id');
            this.currChapterId = id;
            //所有节
            this.app.getModule('section').allSection(id);
        }
    }

    showAddChapter() {
        this.app.getModule('chapter').show();
    }

    showStory() {
        coo.show(this.addContentDom);
    }

    back() {
        coo.link('/content')
    }

    //滚动和滑动函数
    moveRoll(direction) {
        this.roll = this.itemDom.scrollLeft;
        if (!direction) {
            let wrapWidth = coo.domSize(this.itemDom).width;
            let rollWidth = coo.domSize(this.roolDom).width;
            let max = rollWidth - wrapWidth;
            this.roll += 15;
            if (this.roll >= max) this.roll = max;
        } else {
            this.roll -= 15;
            if (this.roll <= 0) this.roll = 0;
        }
        this.itemDom.scrollTo(this.roll, 0);
    }

    getCurrChapterId() {
        return this.currChapterId;
    }

    delChapter(target) {
        let id = coo.attr(coo.parent(target, '.item'), 'data-id');
        shim.ajaxJWT(CONFIG.javaApi('/chapter/delById'), {
            data: {
                id: id
            },
            success: res => {
                if (res.code === 0) {
                    this.initList();
                } else {
                    console.error(res.data)
                }
            }
        });
    }
}
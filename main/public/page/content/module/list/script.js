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
        this.addContentDom = coo.query('.addContent', this.domain);
        this.storyNameDom = coo.query('.name',this.addContentDom);
        this.listDom = coo.query('.list', this.domain);
    }

    addEvent() {
        coo.on('.addBtn', this.domain, 'click', () => this.showStory());
        coo.on('.close', this.domain, 'click', () => this.hideStory());
        coo.on('.confirm', this.domain, 'click', () => this.createStory());
        coo.on('.into', this.listDom, 'click', t => this.intoChapter(t));
        //删除
        coo.on('.del', this.listDom, 'click', t => this.delStroy(t));
    }

    init() {
        this.initList();
    }

    delStroy(target){
        let parent = coo.parent(target,'.item');
        let id = coo.attr(parent,'data-id');
        shim.ajaxJWT(CONFIG.javaApi('/story/delStoryById'), {
            data:{
                id:id
            },
            success: res => {
                if (res.code === 0) {
                    coo.remove(parent);
                } else {
                    console.error(res.data)
                }
            }
        });
    }


    initList() {
        shim.ajaxJWT(CONFIG.javaApi('/story/all'), {
            success: res => {
                if (res.code === 0) {
                    let data = res.data;
                    let html = '';
                    data.forEach((v, i) => {
                        html += `<div class="item" data-id="${v.id}">
                        <div class="num">
                            ${++i}
                            <div class="option">
                                <div class="opt p_icons copy"></div>
                                <div class="opt p_icons del"></div>
                                <div class="opt p_icons into"></div>
                            </div>
                        </div>
                        <div class="title ellipsis">
                            ${v.name}
                        </div>
                    </div>`;
                    });
                    coo.html(this.listDom, html);
                    //关闭添加窗口
                    this.hideStory();
                } else {
                    console.error(res.data)
                }
            }
        });
    }


    intoChapter(target){
        let id = coo.attr(coo.parent(target,'.item'),'data-id');
        coo.link('/story?id='+id);
    }

    showStory() {
        coo.show(this.addContentDom);
    }

    hideStory() {
        coo.hide(this.addContentDom);
    }

    createStory() {
        let name = this.storyNameDom.value;
        shim.ajaxJWT(CONFIG.javaApi('/story/add'), {
            data:{
                name:name
            },
            success: res => {
                if (res.code === 0) {
                    //获取新的列表
                    this.initList();
                } else {
                    console.error(res.data)
                }
            }
        });
    }
}
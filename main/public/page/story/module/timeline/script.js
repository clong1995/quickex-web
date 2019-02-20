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
        this.innerDom = coo.query('.inner', this.domain);
        this.startTimeDom = coo.query('.startTime', this.innerDom);
        this.endTimeDom = coo.query('.endTime', this.innerDom);
    }

    addEvent() {
        // coo.on('.addBtn', this.domain, 'click', t => this.showStory());
        // coo.on('.close', this.domain, 'click', t => this.hideStory());
    }

    init() {
        this.initList();
    }

    initList() {

    }

    showStory() {
        //coo.show(this.addContentDom);
    }

    update() {
        let section = this.app.getModule('section').getSectionId(),
            chapter = this.app.getModule('head').getCurrChapterId();

        shim.ajaxJWT(CONFIG.javaApi('/section/getAllDuration'), {
            data: {
                chapter: chapter
            },
            success: res => {
                if (res.code === 0) {
                    let total = 0;
                    let prev = 0;
                    let curr = 0;
                    let flag = true;
                    res.data.forEach(v => {
                        if (v.id === parseInt(section)) {
                            curr = v.duration;
                            flag = false;
                        }
                        if (flag)
                            prev += v.duration;

                        total += v.duration
                    });
                    let per = curr / total;
                    let prevPer = prev / total;

                    let start = coo.secToTime(prev);
                    let end = coo.secToTime(prev+curr);

                    coo.text(this.startTimeDom,start);
                    coo.text(this.endTimeDom,end);

                    coo.css(this.innerDom, {
                        width: per * 100 + '%',
                        marginLeft: prevPer * 100 + '%'
                    });
                } else {
                    console.error(res.data)
                }
            }
        });
    }
}
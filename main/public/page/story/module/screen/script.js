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

    init() {
        this.coverImage = '/resource/img/chapterCover.jpg';
        this.sectionListData = null;
    }

    queryDom() {
        this.prevDom = coo.query('.prev', this.domain);
        this.mainDom = coo.query('.main', this.domain);
        this.nextDom = coo.query('.next', this.domain);
    }

    addEvent() {
        coo.on('.edit', this.mainDom, 'change', t => this.updateSection(t));
        coo.on('.wrap', this.mainDom, 'click', t => this.edit(t));
    }

    edit(target) {
        let parent = coo.parent(target, '.main');
        let sid = coo.attr(parent, 'data-id');
        let n = coo.query('.name', parent).value;
        let wh = coo.text(coo.query('.ratioValue', parent)).split('*');
        coo.query('.gcDIifr').src = CONFIG.gcDIApi('/modules/editerHome/index.html?w=' + wh[0] + '&h=' + wh[1] + '&n=' + n + '&sid=' + sid);
        coo.show(coo.query('.gcDIifr'));
        coo.show(coo.query('.gcDIBack'));
    }

    updateSection(target) {
        let sectionId = coo.attr(this.mainDom, 'data-id');
        let data = {
            id: sectionId
        };
        let cb = null;
        if (coo.hasClass(target, 'name')) {
            data['name'] = target.value;
            //修改section的名称
            cb = () => this.app.getModule('section').changeName(sectionId, data['name']);
        } else if (coo.hasClass(target, 'foot')) {
            data['comment'] = target.value;
        } else if (coo.hasClass(target, 'input')) {
            //获取所有时间
            let duration = 0;
            coo.query('.input', this.mainDom, true).forEach((v, i) =>
                duration += parseInt(v.value) * Math.pow(60, 2 - i));
            data['duration'] = duration;

            //修改时间线
            this.app.getModule('timeline').update();
        }

        shim.ajaxJWT(CONFIG.javaApi('/section/updateSection'), {
            data: data,
            success: res => {
                if (res.code === 0) {
                    cb && cb();
                } else {
                    console.error(res.data)
                }
            }
        });

    }

    initList(list, index = 0) {
        if (!list.length) {
            coo.hide(this.prevDom);
            coo.hide(this.mainDom);
            coo.hide(this.nextDom);
            return;
        }
        this.sectionListData = list;
        if (index === 0) {//第一个
            this.prevSection();
            list[index] && this.mainSection(list[index].id);
            list[index + 1] ? this.nextSection(list[index + 1].id) : this.nextSection();
        } else if (index > 0 && index < list.length - 1) { //中间的
            this.prevSection(list[index - 1].id);
            list[index] && this.mainSection(list[index].id);
            list[index + 1] && this.nextSection(list[index + 1].id);
        } else if (index === list.length - 1) {//最后的
            list[index - 1] && this.prevSection(list[index - 1].id);
            list[index] && this.mainSection(list[index].id);
            this.nextSection();
        }
    }

    select(index) {
        this.initList(this.sectionListData, index);
    }

    showStory() {
        coo.show(this.addContentDom);
    }

    prevSection(id = '') {
        if (id === '') {
            coo.hide(this.prevDom);
            coo.attr(this.prevDom, {
                'data-id': ''
            });
            return;
        }
        this.getSection(id, data => {
            coo.attr(this.prevDom, {
                'data-id': data.id
            });
            coo.show(this.prevDom);

            //TODO 获取底图片
            if (data.snapshot)
                this.diImg(data.snapshot, this.prevDom);

            coo.html(this.prevDom, `<div class="head">
                    <div class="name ellipsis">${data.name}</div>
                    <div class="time">
                        <span class="title">演播时间：</span>
                        <span class="value">
                            ${coo.secToTime(data.duration)}
                        </span>
                    </div>
                    <div class="ratio">
                        <span class="title">分辨率：</span>
                        <div class="value">1920*1080</div>
                    </div>
                </div>
                <img class="wrap wrap${data.id}" src="${this.coverImage}" alt=""/>
                <div class="foot ellipsis">${data.comment}</div>`);
        });
    }

    diImg(imgId, sectionBigDom) {
        coo.ajax(CONFIG.gcDIApi('/api/blob/getData'), {
            data: {
                id: imgId,
            },
            success: res => {
                let img = res.data.data;

                if (img) {
                    let imgDom = coo.query('.wrap', sectionBigDom);
                    imgDom.src = img;
                }
            }
        })
    }


    mainSection(id) {
        this.getSection(id, data => {
            let timeArr = coo.secToTime(data.duration).split(':');
            coo.attr(this.mainDom, {
                'data-id': data.id
            });
            coo.show(this.mainDom);

            //TODO 获取底图片
            if (data.snapshot)
                this.diImg(data.snapshot, this.mainDom);

            coo.html(this.mainDom, `<div class="head">
            <input type="text" class="name ellipsis edit" value="${data.name}"/>
            <div class="time">
                <span class="title">演播时间：</span>
                <div class="value">
                    <input type="text" name="time" class="input edit" value="${timeArr[0]}">:
                    <input type="text" name="time" class="input edit" value="${timeArr[1]}">:
                    <input type="text" name="time" class="input edit" value="${timeArr[2]}">
                </div>
            </div>
            <div class="ratio">
                <span class="title">分辨率：</span>
                <div class="value ratioValue">1920*1080</div>
            </div>
        </div>
        <img class="wrap wrap${data.id}" src="${this.coverImage}"/>
        <textarea class="foot ellipsis edit">${data.comment}</textarea>`);
        });
    }

    nextSection(id = '') {
        if (id === '') {
            coo.hide(this.nextDom);
            coo.attr(this.nextDom, {
                'data-id': ''
            });
            return;
        }
        this.getSection(id, data => {
            coo.attr(this.nextDom, {
                'data-id': data.id
            });
            coo.show(this.nextDom);
            //TODO 获取底图片
            if (data.snapshot)
                this.diImg(data.snapshot, this.nextDom);
            coo.html(this.nextDom, `<div class="head">
                <div class="name ellipsis">${data.name}</div>
                <div class="time">
                    <span class="title">演播时间：</span>
                    <span class="value">
                        ${coo.secToTime(data.duration)}
                    </span>
                </div>
                <div class="ratio">
                    <span class="title">分辨率：</span>
                    <div class="value">1920*1080</div>
                </div>
            </div>
            <img class="wrap wrap${data.id}" src="${this.coverImage}"/>
            <div class="foot ellipsis">${data.comment}</div>`);
        });
    }

    getSection(id, cb) {
        shim.ajaxJWT(CONFIG.javaApi('/section/byId'), {
            data: {
                id: id
            },
            success: res => {
                if (res.code === 0) {
                    let data = res.data[0];
                    cb(data);
                } else {
                    console.error(res.data)
                }
            }
        });
    }
}
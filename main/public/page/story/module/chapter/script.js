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
        this.rightDom = coo.query('.right', this.domain);
        this.leftDom = coo.query('.left', this.domain);
        this.nameDom = coo.query('.nameInput', this.rightDom);
        this.widthDom = coo.query('.widthInput', this.rightDom);
        this.heightDom = coo.query('.heightInput', this.rightDom);
        this.directionDom = coo.query('.direction', this.rightDom);
        this.sizeDom = coo.query('.size', this.rightDom);
    }

    addEvent() {
        coo.on('.close', this.rightDom, 'click', () => this.hide());
        coo.on('.confirm', this.domain, 'click', () => this.addChapter());
        //选中预设
        coo.on('.item', this.leftDom, 'click', t => this.selectDev(t));

        coo.on('.updown', this.rightDom, 'click', (t1, t2) => this.updownSet(t1, t2));

        coo.on('.direction', this.rightDom, 'click', (t1, t2) => this.selectDirect(t1, t2));
    }

    selectDirect(target1, target2){
        coo.removeClass(coo.query('.active',target1),'active');
        coo.addClass(target2,'active');
    }

    updownSet(target1, target2) {
        let size = coo.text(this.sizeDom);
        coo.hasClass(target2, 'up') ? ++size : --size;
        if (size < 1) size = 1;
        coo.text(this.sizeDom,size);
    }

    selectDev(target) {
        coo.removeClass(coo.query('.active', this.leftDom), 'active');
        coo.addClass(target, 'active');
        //设置标题和尺寸
        let name = coo.text(coo.query('.name', target));
        console.log(name);
        let size = coo.text(coo.query('.size', target)).split('*');

        this.nameDom.value = name;
        this.widthDom.value = parseInt(size[0]);
        this.heightDom.value = parseInt(size[1]);
    }

    init() {
        //gets a list of chapters

        //gets a list of sections

        //gets a list of stories
        this.initList();
    }

    initList() {

    }

    show() {
        coo.show(this.domain);
    }

    hide() {
        coo.hide(this.domain);
    }

    addChapter() {
        //id
        let id = this.app.getModule('head').getStoryId();
        //名称
        let name = this.nameDom.value;
        if (!name) {
            alert('标题不得为空');
            return;
        }
        //宽度
        let width = parseInt(this.widthDom.value);
        if (!width) {
            alert('宽度不得为空');
            return;
        }
        //高度
        let height = parseInt(this.heightDom.value);
        if (!height) {
            alert('高度不得为空');
            return;
        }

        //方向
        let direction = parseInt(coo.attr(coo.query('.active', this.directionDom), 'data-dirc'));
        //节数
        let num = parseInt(coo.text(this.sizeDom));

        shim.ajaxJWT(CONFIG.javaApi('/chapter/add'), {
            data: {
                story: id,
                name: name,
                width: width,
                height: height,
                direction: direction,
                num: num
            },
            success: res => {
                if (res.code === 0) {
                    //更新章滚动列表
                    this.app.getModule('head').initList();
                    coo.hide(this.domain);
                } else {
                    console.error(res.data)
                }
            }
        });
    }
}
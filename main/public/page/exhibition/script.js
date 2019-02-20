class App {
    //初始化函数
    init(app, domain) {
        this.app = app;
        this.domain = domain;
        this.showTab = false;
        this.queryDom();
        this.addEvent();
        this.indexObj = this.getTabIndex();
    }

    queryDom() {
        this.tab = $(".tab", this.domain);
        this.right = $('.right', this.domain);
    }

    initDom() {
        if (this.showTab) {
            this.toggleModule(this.getTabIndex()[this.showTab]);
        }

    }

    //添加事件
    addEvent() {
        this.initDom();
    }

    getKey(obj, value) {

        for (let i in obj) {
            console.log(obj[i]);
            if (value === obj[i]) return i;
        }
    }

    toggleModule(index, className = "hide") {
        // todo 切换模块显隐

        console.log(this.tab.eq(index));

        this.tab.eq(index).removeClass(className).siblings(".tab").addClass(className);
    }

    getTabIndex() {
        let indexObj = {};
        this.tab.each((i, ele) => {
            // ele.id => 元素的id 对应class
            indexObj[ele.id] = parseInt($(".right>." + ele.id, this.domain).index());
        });
        return indexObj;
    }

    get_this_that(e) {
        return {
            $this: $(e.target),
            $that: $(e.currentTarget)
        }
    }


}
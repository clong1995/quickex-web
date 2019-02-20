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
        // this.addContentDom = coo.query('.addContent', this.domain);
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

    //对外开放的方法

    //TODO 跳转到指定日期
    jumpData(data="2018-10"){

    }

    //TODO 下一月
    nextMonth(){

    }

    //TODO 上一月
    prevMonth(){

    }

    //TODO 下一年
    nextYear(){

    }

    //TODO 上一年
    prevYear(){

    }

    //TODO 标注某天为某色
    /*{
        '2019-01-02':'red',
        '2019-01-03':'#fff',
        '2019-01-04':"rgba(24,25,26,.5)"
    }*/
    pointDayColor(dayColors){

    }

}
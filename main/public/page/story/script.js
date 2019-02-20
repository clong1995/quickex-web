class App {
    //初始化函数
    init() {
        this.queryDom();
        this.addEvent();
    }

    queryDom() {
        this.gcDIifrDom = coo.query('.gcDIifr');
    }

    //添加事件
    addEvent() {
        coo.on('.gcDIBack', 'click', t => this.gcDIClose(t));
    }

    gcDIClose(target) {
        this.gcDIifrDom.src = '';
        coo.hide(target);
        coo.hide(this.gcDIifrDom);
    }
}
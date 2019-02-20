class Module {
    //构造
    constructor(app, domain) {
        this.app = app;
        this.domain = domain;
        this.masterMap = new Map();
        this.currMaster = null;
        this.queryDom();
        this.init();
        this.addEvent();
    }

    queryDom() {
        this.listDom = coo.query('.list', this.domain);

    }

    init() {
        this.loadMenu();
    }

    loadMenu() {
        //TODO 这里有模块加载顺序的bug

        shim.ajaxJWT(CONFIG.javaApi('/exhibition/getExhibition'), {
            success: res => {
                if(!res.code){
                    let data = res.data;
                    let html = '';
                    data.forEach((v, i) => {
                        let active = '';
                        if(!i){
                            this.app.getModule('list').initList(v.id);
                            this.app.getModule('main').initList(v.id);
                            active = 'active';
                            this.currMaster = v.master;
                        }
                        html += `<div class="item ${active}" data-id="${v.id}">${v.name}</div>`;
                        this.masterMap.set(v.id,v.master);
                    });
                    coo.html(this.listDom,html);
                }else{
                    alert('异常');
                }
            }
        });
    }

    addEvent() {
        coo.on('.item', this.listDom, 'click', t => this.selectedItem(t));
    }

    selectedItem(target) {
        let id = coo.attr(target,'data-id');
        coo.removeClass(coo.query('.active', this.listDom), 'active');
        coo.addClass(target, 'active');
        this.currMaster = this.masterUUID.get(id);
        this.app.getModule('list').initList(id);
    }

    getCurrMaster(){
        return this.currMaster;
    }
}
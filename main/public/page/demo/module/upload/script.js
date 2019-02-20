class Module {
    //构造
    constructor(app, domain) {
        this.app = app;
        this.domain = domain;

        this.queryDom();

        this.addEvent();
    }

    queryDom() {
        this.speedDom = coo.query('#speed', this.domain);
        this.completeDom = coo.query('#complete', this.domain);
        this.errorDom = coo.query('#error', this.domain);
        this.imgDom = coo.query('#img', this.domain);
    }

    addEvent() {
        coo.on('#submit', this.domain, 'click', t => this.upload());
    }

    upload() {
        let fileDom = coo.query('#file', this.domain);
        let file = fileDom.files[0];
        shim.upload(file, {
            speed: s => {
                coo.text(this.speedDom, '时时速度：' + s);
            },
            complete: c => {
                coo.text(this.completeDom, '时时进度：' + c);
            },
            success: s => {
                let imgObj = new Image();
                imgObj.src = CONFIG.qiniuDownload('/' + s.key);
                coo.empty(this.imgDom);
                coo.append(this.imgDom, imgObj);
            },
            error: e => {
                coo.text(this.errorDom, '失败：' + e);
            },

        });
    }

}
const CONFIG = new class {
    //定义相关数据
    constructor() {
        //本机程序服务
        this.webUrl = 'http://127.0.0.1';
        this.webPort = 8003;

        //java服务
        //this.javaUrl = 'http://192.168.20.157';
        //this.javaUrl = 'http://192.168.20.165';
        this.javaUrl = 'http://quickex.com.cn';
        //this.javaUrl = 'http://127.0.0.1';
        this.javaPort = 8002;

        //老DI服务
        //this.diUrl = '192.168.20.175';
        this.diUrl = 'http://quickex.com.cn';
        //this.diUrl = 'http://127.0.0.1';
        this.diPort = 8005;

        //七牛云存储服务，华北地区
        this.qiniuUploadUrl = "http://upload-z1.qiniup.com";
        this.qiniuDownloadUrl = "http://pmydjb2pq.bkt.clouddn.com";

        //本机websocket服务
        this.webWssUrl = 'ws://127.0.0.1';
        this.webWssPort = 8004;

        //郭超的di服务
        this.gcDIUrl = 'http://127.0.0.1';
        this.gcDIPort = 6070;
    }

    //web服务api
    webApi(path = '/'){
        return this.webUrl + ':' + this.webPort + path
    }

    //java服务的api
    javaApi(path = '/') {
        //TODO 这里可以做过滤等操作
        return this.javaUrl + ':' + this.javaPort + path
    }

    //七牛云储存服务
    qiniuDownload(path = '/'){
        return this.qiniuDownloadUrl + path
    }

    token() {
        return 'Bearer ' + sessionStorage.getItem('token');
    }

    diApi(path = '/'){
        return this.diUrl + ':' + this.diPort + path
    }

    gcDIApi(path = '/'){
        return this.gcDIUrl + ':' + this.gcDIPort + path
    }
};
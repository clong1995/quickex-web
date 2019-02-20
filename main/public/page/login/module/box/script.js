class Module {
    //构造
    constructor(app, domain) {
        this.app = app;
        this.domain = domain;

        //查询dom
        this.queryDom();
        //绑定事件
        this.addEvent();

        this.init();
    }

    queryDom() {
        //注册
        this.loginBoxDom = coo.query('.loginBox', this.domain);
        this.loginUsernameDom = coo.query('.username', this.loginBoxDom);
        this.loginPasswordDom = coo.query('.password', this.loginBoxDom);
        this.downloadDom = coo.query('.download', this.loginBoxDom);
    }

    //#=>添加事件
    addEvent() {
        //登录
        coo.on('.submit', this.loginBoxDom, 'click', t => this.loginSubmit(t));
        //coo.on('.item', this.downloadDom, 'click', t => this.download(t));
        //键盘
        this.loginPasswordDom.onkeyup = event=> event.key === 'Enter' && this.loginSubmit();
    }

    init(){
        if(shim.elc){
            coo.hide(this.downloadDom);
        }
    }
/*
    download(target){
        let src = '/resource/blob/quickex.';
        if(coo.hasClass(target,'win'))
            coo.link(src+"exe",{

            });

        if(coo.hasClass(target,'mac'))
            coo.link(src+"zip");
    }*/

    //执行登录
    loginSubmit() {
        let username = this.loginUsernameDom.value;
        let password = this.loginPasswordDom.value;

        if (!username || !password) {
            alert('不得为空');
            return;
        }
        this.doLogin(username, password);
    }

    doLogin(username, password) {
        coo.ajax(CONFIG.javaApi('/auth/login'), {
            data: {
                username: username,
                password: password
            },
            success: res => {
                if (res.code) {
                    alert(res.msg);
                    return;
                }
                //保存token
                sessionStorage.setItem('token', res.data);
                //保存用户名
                sessionStorage.setItem('user', JSON.stringify({"username":username}));
                //查询用户信息
                this.getMenu();
            }
        })
    }

    //获取菜单，节约资源
    getMenu(){
        shim.ajaxJWT(CONFIG.javaApi('/menu/all'), {
            success: res => {
                if (res.code === 0) {
                    let data = res.data;
                    sessionStorage.setItem('menu', JSON.stringify(data));
                    //动画
                    coo.link('/bg');
                } else {
                    console.error(res.data)
                }
            }
        });
    }

    //获取用户信息
    /*userInfo() {
        shim.ajaxJWT(CONFIG.javaApi('/auth/user'), {
            success: res => {
                if (res.code === 0) {
                    let data = res.data;

                    //获取菜单
                    this.getMenu();
                } else {
                    console.error(res.data)
                }
            }
        })
    }*/
}
/**
 * 垫片函数
 * @type {{}}
 */
const shim = new class {
    constructor() {
        try {
            this.elc = require('electron');
        } catch (e) {
            this.elc = false;
        }

    }

    ajaxJWT(url, option) {
        //增加token令牌
        option['headers'] = {
            Authorization: "Bearer " + sessionStorage.getItem('token')
        };
        //拦截器，作用于结果
        option['interceptor'] = next => {
            //未认证
            if (
                next.code === 401 ||
                next.code === 403
            ) {
                console.error(next);
                //alert(next.msg);
                //coo.link('/login');

            }

            return next;
        };
        coo.ajax(url, option);
    }

    canShow(num) {
        let disable = JSON.parse(sessionStorage.getItem('disable'));
        return !disable.includes(num);
    }

    //兼容浏览器大小
    zoom() {
        if (!this.elc) {
            let ww = 1920,//854
                wh = 1080;//510
            let size = coo.innerSize();

            let isPad = false;

            if (size.ih <= 534 || size.iw <= 854) {
                //青岛展厅的平板尺寸
                isPad = true;
                wh = 1088;
            } else {
                //青岛展厅的平板不动态缩放
                window.onresize = () => this.zoom({
                    ww: ww,
                    wh: wh
                });
            }


            //根据高度缩放
            let scale = size.ih / wh;
            let diffW = (size.iw - ww * scale) / (2 * scale);
            coo.setSheet('BODY', {
                zoom: scale
            });
            coo.setSheet('#background', {
                transform: 'translateX(' + diffW + 'px)',
                display: isPad ? 'none' : 'block'
            });
        }
    }

    upload(file, {key = null, speed = null, complete = null, success = null, error = null} = {}) {
        let uploadUrl = CONFIG.qiniuUploadUrl;

        //获取token
        this.ajaxJWT(CONFIG.javaApi('/qiniu/auth'), {
            success: res => {
                if (res.code === 0) {
                    let token = res.data;
                    if (!token) {
                        console.error('token为空');
                        return;
                    }

                    if (!file) {
                        console.error('file为空');
                        return;
                    }
                    if (!key) {
                        key = new Date().getTime() + coo.randomChar();
                        console.warn('自动生成的key：' + key);
                    }

                    let startDate = new Date().getTime();
                    let formData = new FormData();
                    formData.append('key', key);
                    formData.append('token', token);
                    formData.append('file', file);

                    let xhr = new XMLHttpRequest();
                    xhr.open('POST', uploadUrl, true);
                    xhr.upload.addEventListener("progress", evt => {
                        if (evt.lengthComputable) {
                            let nowDate = new Date().getTime();
                            let taking = nowDate - startDate;
                            let x = (evt.loaded) / 1024;
                            let y = taking / 1000;
                            let uploadSpeed = (x / y);
                            let formatSpeed = 0;
                            if (uploadSpeed > 1024) {
                                formatSpeed = (uploadSpeed / 1024).toFixed(2) + "Mb\/s";
                            } else {
                                formatSpeed = uploadSpeed.toFixed(2) + "Kb\/s";
                            }
                            let percentComplete = Math.round(evt.loaded * 100 / evt.total) + '%';

                            console.log(formatSpeed);
                            typeof speed === 'function' && speed(formatSpeed);

                            console.log(percentComplete);
                            typeof complete === 'function' && complete(percentComplete);
                        }
                    }, false);
                    xhr.onreadystatechange = response => {
                        if (xhr.readyState === 4 && xhr.status === 200 && xhr.responseText !== "") {
                            let blkRet = JSON.parse(xhr.responseText);
                            console.log(blkRet);
                            typeof success === 'function' && success(blkRet);
                        } else if (xhr.status !== 200 && xhr.responseText) {
                            let blkRet = JSON.parse(xhr.responseText);
                            typeof error === 'function' && error(blkRet);
                            console.log(blkRet);
                        }
                    };
                    xhr.send(formData);
                } else {
                    console.error(res.data)
                }
            }
        });
    }
};

//自动缩放
shim.zoom();
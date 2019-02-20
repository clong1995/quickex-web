const CONFIG = require('../../launcher/config');
const request = require('ajax-request');
const ws = require('cooperation/ws');


function getOnlineMasterWsc(master) {
    //检查上线的master
    let masterClients = ws.getClients();

    //查找当前的mastar
    let wsc = null;
    masterClients.forEach(v => {
        if (v.id === master)
            wsc = v;
    });
    return wsc;
}


/*data = {
    master: '1',//master id
    ids:'1,2,3'//设备id
}*/
/*function shutdownAllItem(data, cb) {
    //获取master的uuid
    request({
        url: CONFIG.javaApi('/device/getDeviceMasterByIds'),
        method: 'POST',
        data: {
            controlType: 0,
            master: data.master,
            idList: data.ids
        },
        json: true
    }, (err, res, body) => {
        if (!body.code) {
            let data = body.data;
            if (data.length) {
                //在线的master
                let mastarWsc = getOnlineMasterWsc(data[0].master);

                if (!mastarWsc) {
                    cb({
                        code: 500,
                        msg: 'master离线，请联系设备管理员！'
                    });
                    return;
                }

                let deviceMsg = [];
                data.forEach(v => {
                    deviceMsg.push({
                        device: v.device,
                        comType: v.comType,
                        com: v.com
                    })
                });

                //发送消息给master
                ws.serverSendToClient(mastarWsc, '/wsc/control/shutdown', {
                    data: deviceMsg
                });

                cb({
                    code: 0
                });
                return;
            }
            cb({
                code: 400,
                msg: 'master未注册，请联系设备管理员！'
            });
        } else {
            //失败
            cb(body);
        }
    });
}*/


/*data = {
    master: '1',//master id
    ids:'1,2,3'//设备id
}*/
function crlAllItem(data, type,fn, cb) {
    //获取master的uuid
    request({
        url: CONFIG.javaApi('/device/getDeviceMasterByIds'),
        method: 'POST',
        data: {
            controlType: type,
            master: data.master,
            idList: data.ids
        },
        json: true
    }, (err, res, body) => {
        if (!body.code) {
            let data = body.data;
            if (data.length) {
                //在线的master
                let mastarWsc = getOnlineMasterWsc(data[0].master);

                if (!mastarWsc) {
                    cb({
                        code: 500,
                        msg: 'master离线，请联系设备管理员！'
                    });
                    return;
                }

                let deviceMsg = [];
                data.forEach(v => {
                    deviceMsg.push({
                        device: v.device,
                        comType: v.comType,
                        com: v.com
                    })
                });

                //发送消息给master
                ws.serverSendToClient(mastarWsc, '/wsc/control/'+fn, {
                    data: deviceMsg
                });

                cb({
                    code: 0
                });
                return;
            }
            cb({
                code: 400,
                msg: 'master未注册，请联系设备管理员！'
            });
        } else {
            //失败
            cb(body);
        }
    });


}


function shutdownAllItem (data, cb){
    crlAllItem(data,0,'shutdown', cb);
}

function startAllItem(data, cb){
    crlAllItem(data,1,'wake', cb);
}

module.exports = {
    shutdownAllItem: shutdownAllItem,
    startAllItem: startAllItem
};
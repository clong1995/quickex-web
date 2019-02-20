const ws = require('cooperation/ws');
const control = require('../app/control');

/*function getOnlineWsc(data, cb) {
    //console.log('----')
    let master = data.master;
    if (!master) {
        cb(JSON.stringify({
            code: 400,
            data: '',
            msg: '主驱动编号为空'
        }));
        return;
    }
    //查询在线的master
    let wss = ws.getWss();
    let wsc = null;
    wss.clients.forEach(_wsc => {
        if (_wsc.id === master) wsc = _wsc;
    });

    if (wsc) {
        //删除多余字段
        delete data.master;
        //发送消息给主驱动
        ws.serverSendToClient(wsc, '/wsc/control/setVolume', data);
        cb(JSON.stringify({
            code: 0
        }));
        return;
    }

    cb(JSON.stringify({
        code: 400,
        data: '',
        msg: '主驱动未上线：' + data.master
    }));
}*/

module.exports = (key, data, callback) => ({
    /*setVolume: () => {
        //console.log(data);
        getOnlineWsc(data, msg => {
            callback(msg)
        })
    },
    shutdown: () => getOnlineWsc(data, msg => callback(msg)),
    restart: () => getOnlineWsc(data, msg => callback(msg)),
    wake: () => getOnlineWsc(data, msg => callback(msg)),*/




    //通知master关闭对应的设备
    shutdownAllItem: () =>{
        control.shutdownAllItem(data, res =>
            callback(JSON.stringify(res))
        )
    },

    //通知master开启对应的设备
    startAllItem: () =>{
        control.startAllItem(data, res =>
            callback(JSON.stringify(res))
        )
    }
}[key])();
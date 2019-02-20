const url = require('url');
const request = require('sync-request');
const http = require('cooperation/http');
const ws = require('cooperation/ws');
const config = require('./config');

//启动http服务
http({
    port: 8003,
    dev: true,
    cors: true,
    requestInterceptor: requestInterceptor
});

//启动webSocket
ws.server({
    port: 8004,
    clientConn: (wsc, ip) => {
        //console.log(wsc._socket.remoteAddress);
        //console.log(wsc.devCode);
    },
    clientClose: wsc => {
        //console.log(wsc);
    }
});

function requestInterceptor(req, QueryParams) {
    //let arr = url.parse(req.url).pathname.split('/');

    let pathname = '/web' + url.parse(req.url).pathname;
    let method = req.method.toUpperCase();
    let authorization = req.headers.authorization;
    let javaUrl = config.javaApi(pathname);
    //console.log(QueryParams);
    let res = request(method, javaUrl, {
        headers: {
            authorization: authorization
        },
        json: QueryParams
    });


    try {
        res = res.getBody('utf8');
    } catch (e) {
        return e.toString();
    }

    let json = JSON.parse(res);
    if (json.code === 0) {
        return false;
    }
    return res;
}
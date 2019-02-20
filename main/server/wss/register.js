module.exports = (key, data,wsc) => ({
    /**
     * 设置主驱动的编号
     */
    code: () => {
        wsc.id = data.code;
    },
    test: () =>{
        console.log('==>',wsc.devCode);
    }
}[key])();
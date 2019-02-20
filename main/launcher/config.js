const javaUrl = 'http://127.0.0.1',
    javaPort = 8002;

module.exports = {
    javaApi: (path = '/') => {
        return javaUrl + ':' + javaPort + path
    }
};
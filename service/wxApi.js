Promise.prototype.finally = function (callback) {
    let P = this.constructor;
    return this.then(
      value => P.resolve(callback()).then(() => value),
      reason => P.resolve(callback()).then(() => { throw reason })
    );
};

function wxPromisify(fn) {
    let promise = new Promise((resolve, reject) => {
        let obj = {}
        obj.success = function (res) {
            //成功
            resolve(res)
        }
        obj.fail = function (res) {
            //失败
            reject(res)
        }
        fn(obj)
    })
    return promise;
}

const wxLogin = () => {
    return wxPromisify(wx.login)
}

const getAccessToken = () => {
    let promise = new Promise((resolve, reject) => {
        wx.getStorage({
            key: 'token', 
            success: res => {
              resolve(res.data);
            },
            fail: res => {
                reject('获取本地AccessToken失败');
            }
          });
    })

    return promise;
}

module.exports = {  
    getAccessToken: getAccessToken,
    wxLogin: wxLogin
}
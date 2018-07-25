Promise.prototype.finally = function (callback) {
    let P = this.constructor;
    return this.then(
        value => P.resolve(callback()).then(() => value),
        reason => P.resolve(callback()).then(() => {
            throw reason
        })
    );
};

function wxPromisify(fn) {
    let promise = new Promise((resolve, reject) => {
        wx.showLoading({
            title: '加载中',
            mask: true
        });
        let obj = {}
        obj.success = function (res) {
            wx.hideLoading();
            resolve(res)
        }
        obj.fail = function (res) {
            wx.hideLoading();
            reject(res)
        }
        fn(obj)
    })
    return promise;
}

const wxLogin = () => {
    return wxPromisify(wx.login);
}

const wxGetUserInfo = () => {
    return wxPromisify(wx.getUserInfo);
}

const wxGetSetting = () => {
    return wxPromisify(wx.getSetting);
}

const wxAuthorize = scope => {
    let promise = new Promise((resolve, reject) => {
        wx.authorize({
            scope: scope,
            success() {
                console.log('授权成功');
                resolve();
            },
            fail() {
                console.log('授权失败');
                reject();
            }
        })
    })

    return pomise;
}

const wxSaveImageToPhotosAlbum = filePath => {
    let promise = new Promise((resolve, reject) => {
        wx.saveImageToPhotosAlbum({
            filePath: filePath,
            success: res => {
                resolve(res);
            },
            fail: res => {
                reject(res);
            }
          })
    })

    return promise;
}

const wxCanvasToTempFilePath = (canvasId) => {
    let promise = new Promise((resolve, reject) => {
        wx.canvasToTempFilePath({
            canvasId: canvasId,
            success: res => {
                resolve(res);
            },
            fail: function (res) {
                reject(res);
            }
        })
    });

    return promise;
}



const wxSetStorage = (key, data) => {
    let promise = new Promise((resolve, reject) => {
        wx.setStorage({
            key: key,
            data: data,
            success: res => {
                resolve(res);
            },
            fail: res => {
                reject(res);
            }
        })
    })
    return promise;
}

const wxGetStorage = key => {
    let promise = new Promise((resolve, reject) => {
        wx.getStorage({
            key: key,
            success: res => {
                resolve(res.data);
            },
            fail: res => {
                reject('获取本地信息失败');
            }
        });
    })

    return promise;
}

const wxDownloadFile = (url) => {
    let promise = new Promise((resolve, reject) => {
        wx.downloadFile({
            url: url,
            success: res => {
                resolve(res);
            },
            fail: res => {
                reject(res);
            }
        })
    })

    return promise;
}

const wxUploadFile = (accessToken, fileName, url, data, path) => {
    let promise = new Promise((resolve, reject) => {
        wx.uploadFile({
            url: url,
            header: {
                'access-token': accessToken
            },
            filePath: path,
            name: fileName,
            formData: data,
            success: res => {
                var res = JSON.parse(res.data);
                if (res['result_code'] === 10000) {
                    console.log('upload success');
                    resolve();
                } else {
                    reject('请求失败');
                }
            },
            fail: res => {
                console.error(res);
                reject();
            }
        })
    })

    return promise;
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
    wxLogin: wxLogin,
    wxUploadFile: wxUploadFile,
    wxDownloadFile: wxDownloadFile,
    wxSetStorage: wxSetStorage,
    wxGetUserInfo: wxGetUserInfo,
    wxGetStorage: wxGetStorage,
    wxCanvasToTempFilePath: wxCanvasToTempFilePath,
    wxGetSetting: wxGetSetting,
    wxAuthorize: wxAuthorize,
    wxSaveImageToPhotosAlbum: wxSaveImageToPhotosAlbum
}
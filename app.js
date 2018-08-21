//app.js
var http = require('service/http.js');
var wxApi = require('service/wxApi.js');
var merchant = require('service/merchant.js');

App({
  onLaunch: function () {
    console.log('app runing');
  },
  globalData: {
    user: {
      merchantInfo: {}
    },
    hasUserInfo: false,
    isLoggedIn: false
  },
  wxApi: {
    getAccessToken: wxApi.getAccessToken,
    wxLogin: wxApi.wxLogin,
    wxDownloadFile: wxApi.wxDownloadFile,
    wxSetStorage: wxApi.wxSetStorage,
    wxGetUserInfo: wxApi.wxGetUserInfo,
    wxGetStorage: wxApi.wxGetStorage,
    wxCanvasToTempFilePath: wxApi.wxCanvasToTempFilePath,
    wxGetSetting: wxApi.wxGetSetting,
    wxAuthorize: wxApi.wxAuthorize,
    wxSaveImageToPhotosAlbum: wxApi.wxSaveImageToPhotosAlbum
  },
  http: {
    post: http.post,
    get: http.get,
    domain: http.domain,
    uploadFiles: http.uploadFiles,
    promiseGet: http.promiseGet,
    promisePost: http.promisePost,
    promiseUploadFiles: http.promiseUploadFiles
  },
  merchant: {
    getDetail: merchant.getDetail
  },
  validate: function () {
    let promise = new Promise((resolve, reject) => {
      wxApi.wxLogin()
        .then(res => {
          return http.promisePost('/site/user/validate', {
            code: res.code
          });
        })
        .then(res => {
          this.globalData.isLoggedIn = true;
          let token = res.result.access_token;
          wx.setStorage({
            key: 'token',
            data: token
          });
          resolve(res);
        })
        .catch(error => {
          reject(error);
        })
    });

    return promise;
  },
  initUserInfo: function () {
    var user = {};
    let promise = new Promise((resolve, reject) => {
      http.promiseGet('/site/user/detail', {})
        .then(res => {
          if (res.result_code == 10000) {
            this.globalData.hasUserInfo = true;
            user.currentRole = res.result.last_login_role;
            user.isMerchant = res.result.has_merchant_id;
            user.merchantInfo = {};
            user.merchantInfo.storeName = res.result.store_name;
            user.merchantInfo.profileUrl = res.result.profile;
            user.merchantInfo.id = (user.isMerchant && user.currentRole === 1) ? res.result.merchant_id : -1;
            user.isOwner = false;
            wxApi.wxGetUserInfo()
              .then(res => {
                user.nickName = res.userInfo.nickName;
                user.avatarUrl = res.userInfo.avatarUrl;
                this.globalData.user = user;
                resolve(user);
              })
              .catch(error => {
                this.globalData.user = user;
                resolve(user);
              })
          } else {
            reject(res);
          }
        })
        .catch(error => {
          console.error(error);
        })
    })

    return promise;
  },
  merchantRole: 1,
  userRole: 2,
  toast: (text, showSuccess) => {
    let icon = showSuccess ? 'success' : 'none';
    wx.showToast({
      title: text,
      duration: 2500,
      icon: icon
    });
  }
})
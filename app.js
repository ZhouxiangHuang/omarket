//app.js
var http = require('service/http.js');
var wxApi = require('service/wxApi.js');

App({
  onLaunch: function () {
    console.log('app runing');
  },
  globalData: {
    user: {},
    hasUserInfo: false,
    isLoggedIn: false
  },
  wxApi: {
    getAccessToken: wxApi.getAccessToken,
    wxLogin: wxApi.wxLogin,
    wxDownloadFile: wxApi.wxDownloadFile,
    wxSetStorage: wxApi.wxSetStorage,
    wxGetUserInfo: wxApi.wxGetUserInfo
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
            return wxApi.wxGetUserInfo();
          } else {
            reject(res);
          }
        })
        .then(res => {
          user.nickName = res.userInfo.nickName;
          user.avatarUrl = res.userInfo.avatarUrl;
          this.globalData.user = user;
          resolve(user);
        })
        .catch(error => {
          reject(error);
        })
    })

    return promise;
  },
  getUserInfo: function (cb) {
    wx.showLoading({
      title: '加载中',
      mask: true
    });
    var user = {};
    wxApi.wxLogin()
      .then(res => {
        let code = res.code;
        wx.hideLoading();
        wx.getUserInfo({
          success: function (res) {
            user.nickName = res.userInfo.nickName;
            user.avatarUrl = res.userInfo.avatarUrl;
          }
        })

        return http.promisePost('/site/user/validate', {
          code: code
        });
      })
      .then(res => {
        this.globalData.hasUserInfo = true;
        this.globalData.isLoggedIn = true;
        user.currentRole = res.result.last_login_role;
        user.isMerchant = res.result.has_merchant_id;
        user.merchantInfo = {};
        user.merchantInfo.storeName = res.result.store_name;
        user.merchantInfo.profileUrl = res.result.profile;
        user.merchantInfo.id = (user.isMerchant && user.currentRole === 1) ? res.result.merchant_id : -1;
        user.isOwner = false;
        this.globalData.user = user;
        var token = res.result.access_token;
        wx.setStorage({
          key: 'token',
          data: token
        });
        if (cb) {
          cb();
        }
      })
      .catch(error => {
        console.error(error);
        wx.hideLoading();
        this.toast('系统错误, 请稍后重试');
      })
  },
  merchantRole: 1,
  userRole: 2,
  toast: text => {
    wx.showToast({
      title: text,
      duration: 2500,
      icon: 'none'
    });
  }
})
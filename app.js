//app.js
var http = require('service/http.js');
var wxApi = require('service/wxApi.js');

App({
  onLaunch: function () {
    console.log('app runing');

    this.getUserInfo(function() {
      wx.switchTab({
        url: '../merchant-list/merchant-list',  //注意switchTab只能跳转到带有tab的页面，不能跳转到不带tab的页面
      })
    });
  },
  globalData: {
    user: {},
    hasUserInfo: false
  },
  wxApi: {
    getAccessToken: wxApi.getAccessToken
  },
  http: {
    post: http.post,
    get: http.get,
    domain: http.domain,
    uploadFiles: http.uploadFiles,
    promiseGet: http.promiseGet
  },
  getUserInfo: function(cb) {
    wx.showLoading({title: '加载中',mask: true});
    wx.login({
      success: res => {
        wx.hideLoading();
        var code = res.code;
        var that = this;
        var user = {};

        wx.getUserInfo({  
          success: function (res) {  
            user.nickName = res.userInfo.nickName;
            user.avatarUrl = res.userInfo.avatarUrl;
          }  
        })  
        http.post('/site/user/validate',{code: code},function(res){ 
          if(res.result_code === 10000) {            
            that.globalData.hasUserInfo = true;

            user.currentRole = res.result.last_login_role;
            user.isMerchant = res.result.has_merchant_id;
            user.merchantInfo = {};
            user.merchantInfo.storeName = res.result.store_name;
            user.merchantInfo.profileUrl = res.result.profile;
            user.merchantInfo.id = (user.isMerchant && user.currentRole === 1) ? res.result.merchant_id : -1;
            user.isOwner = false;
            that.globalData.user = user;

            var token = res.result.access_token;
            wx.setStorage({key:'token', data: token})

            if(cb) {
              cb();
            }
          } 
        });  
      },
      fail: res => {
        wx.hideLoading();
        this.toast('系统错误, 请稍后重试');
        console.log(res);
        return false;
      }
    })
  },
  merchantRole : 1,
  userRole: 2,
  toast: function(text) {
    wx.showToast({
      title: text,
      duration: 3000,
      icon: 'none'
    });
  }
})
//app.js
var http = require('service/http.js')  
App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    // logs.unshift(Date.now())
    // wx.setStorageSync('logs', logs)
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })

    wx.login({
      // success: res => {
      //   var code = res.code;
      //   var that = this;
      //   http.post('/site/user/validate',{code: code},function(res){ 
      //     if(res.result_code === 10000) {
      //       var token = res.result.access_token;
      //       if(res.result.is_merchant) {
      //         that.globalData.merchantId = res.result.merchant_id;
      //         that.globalData.isMerchant = res.result.is_merchant;
      //         that.globalData.userRole = 1;              
      //       } else {
      //         that.globalData.userRole = 2;              
      //       }
      //       wx.setStorage({key: 'token',data: token})
      //       wx.switchTab({
      //         url: '../merchant-list/merchant-list',  //注意switchTab只能跳转到带有tab的页面，不能跳转到不带tab的页面
      //       })
      //     } 
      //   });  
      // }
    })
  },
  globalData: {
    userInfo: null,
    userRole: null,
    merchantId: null
  },
  http: {
    post: http.post,
    get: http.get,
    domain: http.domain
  }
})
//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    hasUserInfo: false,
    user: {},
    merchant: {}
  },
  onShow: function () {
    app.wxApi.wxGetUserInfo()
      .then(res => {
        app.globalData.user.nickName = res.userInfo.nickName;
        app.globalData.user.avatarUrl = res.userInfo.avatarUrl;
        this.setData({
          user: app.globalData.user,
          hasUserInfo: true
        })
        console.log(this.data.user);
      })
      .catch(error => {
        this.setData({
          user: app.globalData.user,
          hasUserInfo: true
        })
        console.error('获取用户信息失败');
      })

    if(this.data.user.currentRole === app.merchantRole) {
      app.http.promiseGet('/site/merchant/detail', {merchant_id: this.data.user.merchantInfo.id})
        .then(res => {
          this.setData({
            merchant: res.result
          });
        })
    }
  },
  logout: function() {
      wx.redirectTo({
        url: '../login/login?redirect=1&logout=1'
      })
  },
  getCollections: function() {
    wx.navigateTo({
      url: '../collections/collections'
    })
  },
  myStore: function() {
    wx.navigateTo({
      url: '../product-list/product-list?merchantId=' + this.data.user.merchantInfo.id,
      fail: function(e) {
          console.log(e);
      }
    })
  },
  posterGenerate: function() {
    wx.navigateTo({
      url: '../poster-generate/poster-generate?merchant_name=' + this.data.merchant.store_name,
      fail: function(e) {
          console.log(e);
      }
    })
  }
 
})

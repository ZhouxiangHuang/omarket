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
    if(app.globalData.hasUserInfo) {
      this.setData({
        user: app.globalData.user,
        hasUserInfo: true
      })
    } else {
      app.toast('获取用户信息失败');
    }

    if(this.data.user.currentRole === app.merchantRole) {
      var that = this;
      app.http.get('/site/merchant/detail', {merchant_id: this.data.user.merchantInfo.id}, function(res) {
        that.setData({
          merchant: res.result
        });
      })
    }
  },
  logout: function() {
      wx.redirectTo({
        url: '../login/login'
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
  }
 
})

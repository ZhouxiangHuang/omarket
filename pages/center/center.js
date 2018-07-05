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

    console.log(this.data.user);

    if(this.data.user.currentRole === app.merchantRole) {
      var that = this;
      app.http.promiseGet('/site/merchant/detail', {merchant_id: this.data.user.merchantInfo.id})
        .then(res => {
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
  },
  posterGenerate: function() {
    wx.navigateTo({
      url: '../poster-generate/poster-generate',
      fail: function(e) {
          console.log(e);
      }
    })
  }
 
})

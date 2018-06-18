//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    userInfo: {},
  },
  onLoad: function() {
    wx.getUserInfo({
      success: res => {
        app.globalData.userInfo = res.userInfo
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      },
      fail: res => {
        console.log(res);
      }
    })
  },
  onShow: function () {
    this.setData({
      isMerchant: app.globalData.isMerchant,
      userInfo: app.globalData.userInfo
    })

    if(this.data.isMerchant) {
      var merchantId = app.globalData.merchantId;
      var that = this;
      app.http.get('/site/merchant/detail', {merchant_id: merchantId}, function(res) {
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
    var merchantId = app.globalData.merchantId;
    wx.navigateTo({
      url: '../product-list/product-list?merchantId=' + merchantId,
      fail: function(e) {
          console.log(e);
      }
    })
  }
 
})

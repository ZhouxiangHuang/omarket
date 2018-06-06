//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    motto: 'Hello',
    userInfo: {},
    categories: [],
    newCategory: ''
  },

  onLoad: function () {
    var merchantId = 1;
    app.http.get('/site/merchant/detail', {merchant_id: merchantId}, function(res) {
      that.setData({
        merchant: res.result
      });
    })
  },
  logout: function() {
      wx.redirectTo({
        url: '../login/login'
      })
  }
})

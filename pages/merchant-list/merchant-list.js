//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    merchants: [],
  },
  onLoad: function () {
  },
  onShow: function () {
    var that = this;
    app.http.get('/site/merchant/list', {}, function(res) {
      that.setData({
        merchants: res.result
      });    
    })
  },
  selectStore: function (e) {
    var merchantId = e.currentTarget.dataset.merchant;
    wx.navigateTo({
      url: '../product-list/product-list?merchantId=' + merchantId,
      fail: function(e) {
          console.log(e);
      }
    })
  },
})

//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    merchants: [],
    filterCountries: [],
    countryIndex: null
  },
  onLoad: function () {
    var that = this;
    app.http.get('/site/merchant/registered-countries', {}, function(res) {
      if(res.result_code === 10000) {
        that.setData({
          filterCountries: res.result
        })
      }
    })
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
  onPullDownRefresh: function(){
    var that = this;
    app.http.get('/site/merchant/list', {}, function(res) {
      that.setData({
        merchants: res.result
      });    
      wx.stopPullDownRefresh();
    })
  },
  filterCountry: function(e) {
    this.setData({
      countryIndex: e.detail.value
    })
  }
})

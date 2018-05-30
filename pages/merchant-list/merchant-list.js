//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('ton.open-type.getUserInfo'),
  },
  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    var that = this;
    app.http.get('/site/merchant/list', {}, function(res) {
      that.setData({
        merchants: res.result
      });    
    })

  },
  onShow: function() {
    // console.log(app.globalData.userRole);
  },
  selectCategory: function (event) {
    var category = event.currentTarget.dataset.no.name;

    //change color
    this.data.categories.map(element => {
        if(element.name === category) {
          element.color = 'white';
        } else {
          element.color = '#F8F8F8';
        }
    });

    this.setData({
      productList: this.data.products[category],
      categories: this.data.categories
    });
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

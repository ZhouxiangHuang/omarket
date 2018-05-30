//index.js
//获取应用实例
const app = getApp()

Page({
  toBeDeleted: null,
  data: {
    collections: [],
    hiddenModal: true
  },
  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    var that = this;
    app.http.get('/site/product/collections', {}, function(res) {
      that.setData({
        collections: res.result
      })
    })
  },
  selectStore: function (e) {
    var merchantId = e.currentTarget.dataset.merchant;
    wx.navigateTo({
      url: '../product-list/product-list?merchantId=' + merchantId
    })
  },
  productListSwitch(e) {
    var merchantId = e.currentTarget.dataset.merchant;

  },
  doDelete() {
      var productId = this.toBeDeleted;
      var that = this;
      app.http.post('/site/product/discard', {product_id: productId}, function(res) {
        that.setData({hiddenModal: true});
      })
  },
  delete(e) {
    this.toBeDeleted = e.currentTarget.dataset.productid;
    this.setData({
      hiddenModal: false
    });
  },
  hideModal() {
    this.setData({
      hiddenModal: true
    });
  }
})

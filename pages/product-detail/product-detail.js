//index.js
//获取应用实例
const app = getApp()

Page({
  curIndex: 0,
  scroll: 0,
  data: {
    userInfo: {},
    productImages: [],
    productInfo: {},
    collectionCount: 0,
    isOwner: false
  },
  onLoad: function (options) {
    // var isOwner = app.globalData.merchantId.toString() == option.merchantId;
    this.setData({isOwner: true});
    // var productId = options.product_id;
    var productId = 1;

    var that = this;
    app.http.get('/site/product/detail',{product_id: productId}, function(res){
        that.setData({
          productInfo: res.result,
          productImages: res.result.images
        })
    })

    app.http.get('/site/product/collections', {}, function(res) {
      that.setData({
        collectionCount: that.data.collectionCount + 1 
      })
    })
  },
  collect: function(e) {
    var productId = this.data.productInfo.id;
    app.http.post('/site/product/collect', {product_id: productId}, function(res) {
      wx.showToast({
        title: '收藏成功',
        icon: 'succes',
        duration: 1000,
        mask:true
      })
    })
  },
  checkCollections: function(e) {
    wx.navigateTo({
      url: '../collections/collections'
    })
  },
  edit: function(e) {
    var productId = this.data.productInfo.id;
    wx.navigateTo({
      url: '../edit-product-info/edit-product-info?product_id=' + productId 
    })
  }
})

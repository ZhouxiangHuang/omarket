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
  },
  onLoad: function (options) {
    var productId = options.product_id;
    
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
  }
})

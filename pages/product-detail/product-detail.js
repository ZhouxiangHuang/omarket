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
    isOwner: false,
    isCollected: false,
    isMerchant: false,
  },
  onLoad: function (options) {
    // var isOwner = app.globalData.merchantId.toString() == option.merchantId;
    // var isMerchant = app.globalData.isMerchant;
    this.setData({isOwner: true, isMerchant: true});
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
        collectionCount: res.result.length
      })
    })
  },
  collect: function(e) {
    var productId = this.data.productInfo.id;
    var that = this;

    if(this.data.isCollected) {
      app.http.post('/site/product/discard', {product_id: productId}, function(res) {
        if(res.result_code === 10000) {
          that.setData({
            isCollected: false
          });
          wx.showToast({
            title: '操作成功',
            icon: 'succes',
            duration: 1000,
            mask:true
          })
        }
      })
    } else {
      app.http.post('/site/product/collect', {product_id: productId}, function(res) {
        if(res.result_code === 10000) {
          that.setData({
            isCollected: true
          });
          wx.showToast({
            title: '收藏成功',
            icon: 'succes',
            duration: 1000,
            mask:true
          })
        }
      })
    }

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

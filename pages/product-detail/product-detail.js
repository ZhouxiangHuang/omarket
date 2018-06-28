//index.js
//获取应用实例
const app = getApp()

Page({
  curIndex: 0,
  scroll: 0,
  data: {
    user: {},
    merchant: {},
    hasUserInfo: false,
    productImages: [],
    productInfo: {},
    collectionCount: 0,
    isOwner: false,
    isCollected: false,
    hiddenModal: true
  },
  onLoad: function (options) {
    var productId = options.product_id;

    var that = this;
    app.http.get('/site/product/detail',{product_id: productId}, function(res){
      var merchantId = res.result.merchant_id;
      var isOwner = app.globalData.user.merchantInfo.id == merchantId;
      that.setData({
        productInfo: res.result,
        productImages: res.result.images,
        isOwner: isOwner
      })

      app.http.get('/site/merchant/detail', {merchant_id: merchantId}, function(res) {
        that.setData({
          merchant: res.result
        });
      });
    })

    app.http.get('/site/product/collections', {}, function(res) {
      that.setData({
        collectionCount: res.result.length
      })
    })
  },
  onShow: function () {
    this.setData({
      user: app.globalData.user,
      hasUserInfo: true
    })
  },
  collect: function(e) {
    var productId = this.data.productInfo.id;
    var that = this;

    if(this.data.isCollected) {
      app.http.post('/site/product/discard', {product_id: productId}, function(res) {
        if(res.result_code === 10000) {
          that.setData({
            isCollected: false,
            collectionCount: that.data.collectionCount - 1 
          });
          app.toast('操作成功');
        }
      })
    } else {
      app.http.post('/site/product/collect', {product_id: productId}, function(res) {
        if(res.result_code === 10000) {
          that.setData({
            isCollected: true,
            collectionCount: that.data.collectionCount + 1
          });
          app.toast('收藏成功');
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
  },
  delete: function(e) {
    var productId = this.data.productInfo.id;
    app.http.post('/site/product/delete', {product_id: productId}, function(res) {
      if(res.result_code === 10000) {
        wx.navigateBack(1);
      } else {
        app.toat('操作失败，请稍后再试')
      }
    })
  },
  askDelete: function() {
    this.setData({
      hiddenModal: false
    })
  },
  hideModal: function() {
    this.setData({
      hiddenModal: true
    })
  },
  onShareAppMessage: function () {
    return {
        title: this.data.merchant.store_name,
        desc: this.data.productInfo.product_unique_code,
        path: '/pages/product-detail/product-detail?product_id=' + this.data.productInfo.id,
        imageUrl: this.data.productInfo.images[0].url,
        success: function (res) {

        }
    };
  },
})

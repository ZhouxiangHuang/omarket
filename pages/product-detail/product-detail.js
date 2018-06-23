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
    hiddenModal: true
  },
  onLoad: function (options) {
    var isMerchant = app.globalData.isMerchant;
    this.setData({isMerchant: isMerchant});
    var productId = options.product_id;

    var that = this;
    app.http.get('/site/product/detail',{product_id: productId}, function(res){
      var merchantId = res.result.merchant_id;
      var isOwner = app.globalData.merchantId == merchantId;
        that.setData({
          productInfo: res.result,
          productImages: res.result.images,
          isOwner: isOwner
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
        title: '我的店在欧贸！',
        desc: '这款产品很好卖!',
        path: '/product-detail/product-detail?product_id=' + this.data.productInfo.id,
        success: function (res) {
            if (this.data.savedId === this.data.id) {
                return;
            }

            this.saveData().then(() => {
                this.setData({
                    savedId: this.data.id
                });
                // todo 如果跳转到其他页面，删除this.data.id
            });
        }
    };
  },
})

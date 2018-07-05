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

    app.http.promiseGet('/site/product/detail',{product_id: productId})
      .then(res => {
        var merchantId = res.result.merchant_id;
        var isOwner = app.globalData.user.merchantInfo.id == merchantId;
        that.setData({
          productInfo: res.result,
          productImages: res.result.images,
          isOwner: isOwner
        })

        return app.http.promiseGet('/site/merchant/detail', {merchant_id: merchantId});
      })
      .then(res => {
        that.setData({
          merchant: res.result
        });
      })
      .catch(error => {
        app.toast(error);
      });
  },
  onShow: function () {
    this.setData({
      user: app.globalData.user,
      hasUserInfo: true
    })

    var that = this;
    app.http.promiseGet('/site/user/collections', {})
      .then(res => {
        var productList = that.getProductList(res.result);
        var isCollected = that.itemExists(productList, that.data.productInfo);
        that.setData({
          collectionCount: that.countCollectedProducts(res.result),
          isCollected: isCollected
        })
      })
      .catch(error => {
        app.toast(error);
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
  itemExists: function(productList, item) {
    var result = false;
    productList.forEach(function(product) {
      if(product.id == item.id) {
        result = true;
      }
    });

    return result;
  },
  countCollectedProducts: function(collections) {
    var count = 0;
    collections.forEach(function(collection) {
      count += collection.products.length;
    })

    return count;
  },
  getProductList: function(collections) {
    var products = [];
    collections.forEach(function(collection) {
      products = products.concat(collection.products);
    })

    return products;
  },
  returnHome: function() {
    // wx.switchTab({
    //   url: '../merchant-list/merchant-list',  //注意switchTab只能跳转到带有tab的页面，不能跳转到不带tab的页面
    // })

      wx.redirectTo({
        url: '../login/login', 
      })
  }
})

//index.js
//获取应用实例
const app = getApp()

Page({
  toBeDeleted: null,
  toBeDeletedMerchantName: null,
  data: {
    collections: [],
    hiddenCollections: [],
    display: {},
    hide: {},
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
      
      res.result.forEach(function(merchant) {
        that.data.display[merchant.merchant_name] = {'merchant_id': merchant.merchant_id, 'merchant_name': merchant.merchant_name, 'products': []};
        that.data.hide[merchant.merchant_name] = merchant;       
      });

      that.setData({
        display: that.data.display,
        hide: that.data.hide,
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
    var merchantName = e.currentTarget.dataset.merchant;
    
    if(this.data.display[merchantName].products.length > 0) {
      var tempProducts = this.data.display[merchantName].products;
      this.data.display[merchantName].products = [];
      this.data.hide[merchantName].products = tempProducts;
    } else {
      var tempProducts = this.data.hide[merchantName].products;
      this.data.hide[merchantName].products = [];
      this.data.display[merchantName].products = tempProducts;
    }

    this.setData({
      display: this.data.display,
      hide: this.data.hide
    });

  },
  doDelete() {
      var productId = this.toBeDeleted;
      var that = this;
      app.http.post('/site/product/discard', {product_id: productId}, function(res) {
        that.setData({hiddenModal: true});
      })

      var newArray = [];
      this.data.display[this.toBeDeletedMerchantName].products.forEach(function(product) {
        if(product.id !== productId) {
          newArray.push(product);
        }
      })

      this.data.display[this.toBeDeletedMerchantName].products = newArray;

      this.setData({
        display: this.data.display
      })
  },
  delete(e) {
    this.toBeDeleted = e.currentTarget.dataset.productid;
    this.toBeDeletedMerchantName = e.currentTarget.dataset.merchant;
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

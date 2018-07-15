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
    this.getCollections();
  },
  selectStore: function (e) {
    var merchantId = e.currentTarget.dataset.merchant;
    wx.navigateTo({
      url: '../product-list/product-list?merchantId=' + merchantId
    })
  },
  productListSwitch(e) {
    var merchantName = e.currentTarget.dataset.merchant;

    if (this.data.display[merchantName].products.length > 0) {
      var tempProducts = this.data.display[merchantName].products;
      this.data.display[merchantName].products = [];
      this.data.hide[merchantName].products = tempProducts;
      this.data.display[merchantName].dropTriangle = false;
    } else {
      var tempProducts = this.data.hide[merchantName].products;
      this.data.hide[merchantName].products = [];
      this.data.display[merchantName].products = tempProducts;
      this.data.display[merchantName].dropTriangle = true;
    }

    this.setData({
      display: this.data.display,
      hide: this.data.hide
    });

  },
  doDelete() {
    var productId = this.toBeDeleted;

    app.http.promisePost('/site/product/discard', {
      product_id: productId
    }).then(res => {
      this.setData({
        hiddenModal: true
      });
    })

    var newArray = [];
    this.data.display[this.toBeDeletedMerchantName].products.forEach(product => {
      if (product.id !== productId) {
        newArray.push(product);
      }
    })

    if (newArray.length == 0) {
      this.data.display[this.toBeDeletedMerchantName] = undefined;
    } else {
      this.data.display[this.toBeDeletedMerchantName].products = newArray;
    }

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
  },
  getCollections() {
    app.http.promiseGet('/site/user/collections', {})
      .then(res => {
        res.result.forEach(merchant => {
          this.data.hide[merchant.merchant_name] = {
            'currency': merchant.currency,
            'merchant_id': merchant.merchant_id,
            'merchant_name': merchant.merchant_name,
            'products': []
          };
          merchant.dropTriangle = true;
          this.data.display[merchant.merchant_name] = merchant;
        });

        this.setData({
          display: this.data.display,
          hide: this.data.hide,
          collections: res.result
        })
      })
  }
})
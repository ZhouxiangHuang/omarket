//index.js
//获取应用实例
const app = getApp()
import regeneratorRuntime from '../../libs/runtime';

Page({
  toBeDeleted: null,
  toBeDeletedMerchantId: null,
  data: {
    collections: [],
    hiddenCollections: [],
    display: {},
    hide: {},
    hiddenModal: true
  },
  //事件处理函数
  bindViewTap() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad() {
    this.getCollections();
  },
  selectStore(e) {
    let merchantId = e.currentTarget.dataset.merchant;
    wx.navigateTo({
      url: '../product-list/product-list?merchantId=' + merchantId
    })
  },
  productListSwitch(e) {
    let merchantId = e.currentTarget.dataset.merchant;

    let collections = this.data.collections
      .map(collection => {
        let collectionCp = Object.assign({}, collection);
        if (collection.merchant_id == merchantId) {
          if (!collection.products.length) {
            this.data.merchants.forEach(merchant => {
              if (merchant.merchant_id == merchantId) collectionCp.products = merchant.products;
            });
          } else {
            collectionCp.products = [];
          }
        }

        return collectionCp;
      })
      .map(collection => {
        if (collection.merchant_id == merchantId) {
          let collectionCp = Object.assign({}, collection);
          collectionCp.dropTriangle = !collectionCp.dropTriangle;
          return collectionCp;
        }
      })

    this.setData({
      collections: collections
    });
  },
  async doDelete() {
    let productId = this.toBeDeleted;

    await app.http.promisePost('/site/product/discard', {
      product_id: productId
    })
    this.setData({
      hiddenModal: true
    });

    let collections = this.data.merchants.map(merchant => {
      let products = merchant.products.filter(product => {
        return product.id != productId
      })
      let merchantCp = Object.assign({}, merchant);
      merchantCp.products = products;
      return merchantCp;
    })

    this.setData({
      collections: collections
    })
  },
  delete(e) {
    this.toBeDeleted = e.currentTarget.dataset.productid;
    this.toBeDeletedMerchantId = e.currentTarget.dataset.merchant;
    this.setData({
      hiddenModal: false
    });
  },
  hideModal() {
    this.setData({
      hiddenModal: true
    });
  },
  async getCollections() {
    let res = await app.http.promiseGet('/site/user/collections', {});

    let merchants = res.result.map(merchant => {
      let modifiedMerch = Object.assign({
        dropTriangle: true
      }, merchant);
      return modifiedMerch;
    })

    this.setData({
      collections: merchants,
      merchants: merchants
    })
  }
})
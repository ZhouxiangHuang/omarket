//index.js
//获取应用实例
const app = getApp();
const COLOR_SELECTED = 'white';
const COLOR_DEFAULT = 'F8F8F8';

Page({
  selectedCategoryId: null,
  categories: [],
  ownerId: null,
  data: {
    user: {},
    isOwner: false,
    timeRange: [{
        'name': '从新到旧',
        'code': 'newest'
      },
      {
        'name': '从旧到新',
        'code': 'oldest'
      }
    ],
    priceRange: [{
        'name': '从高到低',
        'code': 'highest'
      },
      {
        'name': '从低到高',
        'code': 'lowest'
      }
    ],
    timeIndex: null,
    priceIndex: null,
  },
  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function (option) {
    this.ownerId = option.merchantId;
  },
  onShow: function () {
    if (!app.globalData.isLoggedIn) {
      app.toast("请先授权登录");
      return this.returnLogin();
    }
    var isOwner = app.globalData.user.merchantInfo.id.toString() == this.ownerId;
    this.setData({
      isOwner: isOwner,
      user: app.globalData.user
    })

    app.http.promiseGet('/site/merchant/detail', {
        merchant_id: this.ownerId
      })
      .then(res => {
        this.setData({
          merchant: res.result
        });
      })

    app.http.promiseGet('/site/product/products', {
        merchant_id: this.ownerId
      })
      .then(res => {
        this.categories = res.result;
        var categoryId = this.getReviewHistory().categoryId;
        this.displayCategory(categoryId);
      })
      .catch(error => {
        app.toast(error);
      })

  },
  selectCategory: function (event) {
    var categoryId = event.currentTarget.dataset.category;
    this.selectedCategoryId = categoryId;
    this.updateReviewHistory(categoryId);
    this.displayCategory(categoryId);
  },
  checkProductDetal: function (event) {
    var id = event.currentTarget.dataset.no.id;
    wx.navigateTo({
      url: '../product-detail/product-detail?product_id=' + id,
      fail: function (e) {
        console.log(e);
      }
    })
  },
  editMerchant: function () {
    wx.navigateTo({
      url: '../edit-merchant-info/edit-merchant-info?merchant_id=' + this.data.user.merchantInfo.id,
      fail: function (e) {
        console.log(e);
      }
    })
  },
  editCatogory: function () {
    wx.navigateTo({
      url: '../edit-categories/edit-categories',
      fail: function (e) {
        console.log(e);
      }
    })
  },
  editProducts: function () {
    if (this.data.categories.length === 1) {
      app.toast('请先添加产品类别');
      return false;
    }
    var path = '../edit-product-info/edit-product-info';
    if (this.selectedCategoryId) {
      path = path + '?category_id=' + this.selectedCategoryId;
    }

    wx.navigateTo({
      url: path,
      fail: function (e) {
        console.log(e);
      }
    })
  },
  callMerchant: function (e) {
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.dataset.tel, //此号码并非真实电话号码，仅用于测试  
      success: function () {
        console.log("拨打电话成功！")
      },
      fail: function () {
        console.log("拨打电话失败！")
      }
    })
  },
  orderByTime: function (e) {
    var index = e.detail.value;
    var order = this.data.timeRange[index];
    var newList = this.data.productList.sort(function (a, b) {
      if (order.code === "oldest") {
        return a.timestamp > b.timestamp
      } else {
        return a.timestamp < b.timestamp
      }
    })
    this.setData({
      timeIndex: index,
      priceIndex: null,
      productList: newList
    })
  },
  orderByPrice: function (e) {
    var index = e.detail.value;
    var order = this.data.priceRange[index];
    var newList = this.data.productList.sort(function (a, b) {
      if (order.code === "lowest") {
        return a.price > b.price
      } else {
        return a.price < b.price
      }
    })
    this.setData({
      timeIndex: null,
      priceIndex: index,
      productList: newList
    })
  },
  displayCategory: function (categoryId) {
    var displayProducts = [];
    this.categories.map(function (category) {
      if (categoryId === category.id) {
        category.color = COLOR_SELECTED;
        displayProducts = category.products;
      } else {
        category.color = COLOR_DEFAULT;
      }
    })

    this.setData({
      categories: this.categories,
      productList: displayProducts
    })
  },
  updateReviewHistory: function (categoryId) {
    app.globalData.lastViewedCategory = categoryId;
    app.globalData.lastViewedMerchant = this.ownerId;
  },
  getReviewHistory: function () {
    var id = 0;
    if (app.globalData.lastViewedMerchant == this.ownerId) {
      id = app.globalData.lastViewedCategory || 0;
    }

    return {
      'categoryId': id
    }
  }
})
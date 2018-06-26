//index.js
//获取应用实例
const app = getApp();
const COLOR_SELECTED = 'white';
const COLOR_DEFAULT = 'F8F8F8';

Page({
  merchantId: null,
  categories: [],
  data: {
    isOwner: false,
    timeRange: [
      {'name': '从新到旧', 'code': 'newest'},
      {'name': '从旧到新', 'code': 'oldest'}
    ],
    priceRange: [
      {'name': '从高到低', 'code': 'highest'},
      {'name': '从低到高', 'code': 'lowest'}
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
    this.merchantId = option.merchantId;
    var isOwner = app.globalData.merchantId.toString() == option.merchantId;
    this.setData({isOwner: isOwner});
  },
  onShow: function () {
    var that = this;
    app.http.get('/site/merchant/detail', {merchant_id: this.merchantId}, function(res) {
      that.setData({
        merchant: res.result
      });
    });

    app.http.get('/site/product/products', {merchant_id: this.merchantId},function(res){ 
      if(res.result_code === 10000) {
        that.categories = res.result;
        var categoryId = that.getReviewHistory().categoryId;
        that.displayCategory(categoryId);
      } else {
        app.toast(res.reason);
      }
    }); 
  },
  selectCategory: function (event) {
    var categoryId = event.currentTarget.dataset.category;
    this.updateReviewHistory(categoryId);
    this.displayCategory(categoryId);
  },
  checkProductDetal: function(event) {
    var id = event.currentTarget.dataset.no.id;
    wx.navigateTo({
      url: '../product-detail/product-detail?product_id=' + id,
      fail: function(e) {
          console.log(e);
      }
    })
  },
  editMerchant: function() {
    wx.navigateTo({
      url: '../edit-merchant-info/edit-merchant-info?merchant_id=' + this.merchantId,
      fail: function(e) {
          console.log(e);
      }
    })
  },
  editCatogory: function() {
    wx.navigateTo({
      url: '../edit-categories/edit-categories',
      fail: function(e) {
          console.log(e);
      }
    })
  }, 
  editProducts: function() {  
    if(this.data.categories.length === 1) {
      app.toast('请先添加产品类别');
      return false;
    }
    wx.navigateTo({
      url: '../edit-product-info/edit-product-info',
      fail: function(e) {
          console.log(e);
      }
    })
  },
  callMerchant: function(e) {
    wx.makePhoneCall({  
      phoneNumber: e.currentTarget.dataset.tel, //此号码并非真实电话号码，仅用于测试  
      success:function(){  
        console.log("拨打电话成功！")  
      },  
      fail:function(){  
        console.log("拨打电话失败！")  
      }  
    })  
  },
  orderByTime: function(e) {
    var index = e.detail.value;    
    var order = this.data.timeRange[index];
    var newList = this.data.productList.sort(function(a, b) {
      if(order.code === "oldest") {
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
  orderByPrice: function(e) {
    var index = e.detail.value;    
    var order = this.data.priceRange[index];
    var newList = this.data.productList.sort(function(a, b) {
      if(order.code === "lowest") {
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
  displayCategory: function(categoryId) {
    var displayProducts = [];
    this.categories.map(function(category) {
        if(categoryId === category.id) {
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
  updateReviewHistory: function(categoryId) {
    app.globalData.lastViewedCategory = categoryId;
    app.globalData.lastViewedMerchant = this.merchantId;
  },
  getReviewHistory: function() {
    var id = 0;
    if(app.globalData.lastViewedMerchant == this.merchantId) {
      id = app.globalData.lastViewedCategory || 0;
    }

    return {
      'categoryId': id
    }
  }
})

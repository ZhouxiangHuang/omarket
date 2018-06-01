//index.js
//获取应用实例
const app = getApp()

Page({
  merchantId: null,
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('ton.open-type.getUserInfo'),
    isOwner: false
  },
  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function (option) {
    this.merchantId = option.merchantId;
    // var isOwner = app.globalData.merchantId.toString() == option.merchantId;
    this.setData({isOwner: true});
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
        var products = {}
        products['热销'] = [];
        res.result.forEach(function(category, index) {
            var categoryName = Object.keys(category)[0]; //category name
            var productList = category[categoryName]; //products within category
            products[categoryName] = productList;
            productList.forEach(function(product) {
                if(product.hot_item) {
                  products['热销'].push(product);
                }
            });
        })

        var categoryList = [];
        Object.keys(products).forEach(element => {
          if(element === '热销') {
            categoryList.push({name: element, color: 'white', ishot: true});
          } else {
            categoryList.push({name: element, color: '#F8F8F8', ishot: false});
          }
        });
      
        that.setData({
          categories: categoryList,
          productList: products['热销'],
          products: products
        });
      } else {
          wx.showToast({
            title: res.reason,
            duration: 3000,
            icon: 'none'
          });
        }
    }); 
  },
  selectCategory: function (event) {
    var category = event.currentTarget.dataset.no.name;

    //change color
    this.data.categories.map(element => {
        if(element.name === category) {
          element.color = 'white';
        } else {
          element.color = '#F8F8F8';
        }
    });

    this.setData({
      productList: this.data.products[category],
      categories: this.data.categories
    });
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
    wx.navigateTo({
      url: '../edit-product-info/edit-product-info',
      fail: function(e) {
          console.log(e);
      }
    })
  }
})

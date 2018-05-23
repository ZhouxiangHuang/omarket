//index.js
//获取应用实例
const app = getApp()

Page({
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
    // var isOwner = app.globalData.merchantId.toString() == option.merchantId;
    this.setData({isOwner: true});
  },
  onShow: function () {
    var that = this;
    wx.showLoading({title: '加载中',mask: true});
    app.http.get('/site/product/products',{},function(res){ 
      wx.hideLoading();
      if(res.result_code === 10000) {
        var data = res.result;
        var products = {}
        data.forEach(function(category) {
            var prop = Object.keys(category)[0];
            var val = category[prop];
            products[prop] = val;
        })

        that.setData({
          products: products
        })
    
        var categoryList = [];
        Object.keys(that.data.products).forEach(element => {
          if(element === '热销') {
            categoryList.push({name: element, color: 'white'});
          } else {
            categoryList.push({name: element, color: '#F8F8F8'});
          }
        });
      
        that.setData({
          merchant: {imageUrl: '/images/missgrace.jpeg', 
                      name: 'MISS GRACE', 
                      address: 'Baross Gabor utca 73, 16区', 
                      tags:['牛仔裤','运动服','休闲'],
                      announcement: '买卖的都是质量最好的牛仔裤',                                                         
                    },
          categories: categoryList,
          productList: that.data.products['热销'],
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
      url: '../edit-merchant-info/edit-merchant-info?merchant_id=' + 1,
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

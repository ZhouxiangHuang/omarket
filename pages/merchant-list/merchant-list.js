//index.js
//获取应用实例
const app = getApp()

Page({
  page: 0,
  allMerchants: [],
  filterConditions: {
    'country': null,
    'category': null
  },
  data: {
    merchants: [],
    filterCountries: [],
    filterCategories: [],
    countryIndex: null,
    categoryIndex: null,
  },
  onShow: function () {
    var that = this;
    this.page = 0;
    this.getMerchantList();
    app.http.get('/site/merchant/registered-countries', {}, function(res) {
      if(res.result_code === 10000) {
        res.result.push({'name': '全部', 'code': 'all'});
        that.setData({
          filterCountries: res.result
        })
      }
    })

    app.http.get('/site/product/categories', {}, function(res) {
      if(res.result_code === 10000) {
        res.result.push({'name': '全部', 'id': 'all'});
        that.setData({
          filterCategories: res.result
        })
      }
    })
  },
  selectStore: function (e) {
    var merchantId = e.currentTarget.dataset.merchant;
    wx.navigateTo({
      url: '../product-list/product-list?merchantId=' + merchantId,
      fail: function(e) {
          console.log(e);
      }
    })
  },
  onReachBottom: function() {
    this.getMoreMerchantList();
  },
  onPullDownRefresh: function(){
    this.page = 0;
    this.getMerchantList();
    wx.stopPullDownRefresh();
  },
  filterCountry: function(e) {
    var index = e.detail.value;   
    var countryCode = this.data.filterCountries[index].code;
    if(countryCode === "all") {
      this.filterConditions.country = null;
    } else {
      this.filterConditions.country = countryCode;
    }
    this.getMerchantList();
    this.setData({
      countryIndex: index
    });
  },
  filterCategory: function(e) {
    var index = e.detail.value;    
    var categoryId = this.data.filterCategories[index].id;
    this.filterConditions.category = categoryId;
    if(categoryId === "all") {
      this.filterConditions.category = null;
    } else {
      this.filterConditions.category = categoryId;
    }
    this.getMerchantList();
    this.setData({
      categoryIndex: index
    });
  },
  getMerchantList: function() {
    var that = this;
    var country = this.filterConditions.country;
    var category = this.filterConditions.category;
    var data = {};
    data.page = this.page;
    if(country) {
      data.country = country;
    }
    if(category) {
      data.category = category;
    }
    app.http.get('/site/merchant/list', data, function(res) {
      that.allMerchants = res.result;
      that.setData({
        merchants: res.result
      });    
    })
  }, 
  getMoreMerchantList: function() {
    this.page++;
    var that = this;
    var country = this.filterConditions.country;
    var category = this.filterConditions.category;
    var data = {};
    data.page = this.page;
    if(country) {
      data.country = country;
    }
    if(category) {
      data.category = category;
    }
    app.http.get('/site/merchant/list', data, function(res) {
      that.allMerchants = res.result;
      res.result.forEach(function(merchant) {
        that.data.merchants.push(merchant);
      })
      that.setData({
        merchants: that.data.merchants
      });    
    })
  }
})

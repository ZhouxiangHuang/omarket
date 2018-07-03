//index.js
//获取应用实例
const app = getApp()

Page({
  page: 0,
  filterPositionFlag: true,
  allMerchants: [],
  filterConditions: {
    'country': null,
    'category': null
  },
  data: {
    banners: ["/images/banner-1.png", "/images/banner-2.png"],
    merchants: [],
    filterCountries: [],
    filterCategories: [],
    countryIndex: null,
    categoryIndex: null,
    filterStyle: null
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
  onPageScroll: function(e) {
    if(this.filterPositionFlag) {
      if(e.scrollTop >= 100) {
        this.setData({
          filterStyle: "position: fixed;"
        })
      }
      this.filterPositionFlag = false;
    } else {
      if(e.scrollTop <= 100) {
        this.setData({
          filterStyle: null
        })
      }
      this.filterPositionFlag = true;
    }
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
    this.page = 0;
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
    this.page = 0;
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

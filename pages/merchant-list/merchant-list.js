//index.js
//获取应用实例
const app = getApp();

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
    this.page = 0;
    this.getMerchantList();
    app.http.promiseGet('/site/merchant/registered-countries', {})
      .then(res => {
        res.result.push({
          'name': '全部',
          'code': 'all'
        });
        this.setData({
          filterCountries: res.result
        })
      })
      .catch(error => {
        app.toast(error);
      })

    app.http.promiseGet('/site/product/categories', {})
      .then(res => {
        res.result.map(category => {
          category.name_with_count = category.name + ' (' + category.merchant_count + ')';
        })
        res.result.push({
          'name_with_count': '全部',
          'id': 'all'
        });
        this.setData({
          filterCategories: res.result
        });
      })
      .catch(error => {
        app.toast(error);
      })
  },
  onPageScroll: function (e) {
    if (this.filterPositionFlag) {
      if (e.scrollTop >= 100) {
        this.setData({
          filterStyle: "position: fixed;"
        })
      }
      this.filterPositionFlag = false;
    } else {
      if (e.scrollTop <= 100) {
        this.setData({
          filterStyle: null
        })
      }
      this.filterPositionFlag = true;
    }
  },
  selectStore: function (e) {
    let merchantId = e.currentTarget.dataset.merchant;

    app.http.promisePost('/site/merchant/add-viewer', {
      merchant_id: merchantId
    }).then(res => {
      console.log(res);
    })

    wx.navigateTo({
      url: '../product-list/product-list?merchantId=' + merchantId,
      fail: function (e) {
        console.log(e);
      }
    })
  },
  onReachBottom: function () {
    this.getMoreMerchantList();
  },
  onPullDownRefresh: function () {
    this.page = 0;
    this.getMerchantList();
    wx.stopPullDownRefresh();
  },
  filterCountry: function (e) {
    var index = e.detail.value;
    var countryCode = this.data.filterCountries[index].code;
    this.page = 0;
    if (countryCode === "all") {
      this.filterConditions.country = null;
    } else {
      this.filterConditions.country = countryCode;
    }
    this.getMerchantList();
    this.setData({
      countryIndex: index
    });
  },
  filterCategory: function (e) {
    var index = e.detail.value;
    var categoryId = this.data.filterCategories[index].id;
    this.page = 0;
    this.filterConditions.category = categoryId;
    if (categoryId === "all") {
      this.filterConditions.category = null;
    } else {
      this.filterConditions.category = categoryId;
    }
    this.getMerchantList();
    this.setData({
      categoryIndex: index
    });
  },
  getMerchantList: function () {
    var country = this.filterConditions.country;
    var category = this.filterConditions.category;
    var data = {};
    data.page = this.page;
    if (country) {
      data.country = country;
    }
    if (category) {
      data.category = category;
    }
    app.http.promiseGet('/site/merchant/list', data)
      .then(res => {
        this.allMerchants = res.result;
        this.setData({
          merchants: res.result
        });
      })
      .catch(error => {
        app.toast(error);
      })
  },
  getMoreMerchantList: function () {
    this.page++;
    var country = this.filterConditions.country;
    var category = this.filterConditions.category;
    var data = {};
    data.page = this.page;
    if (country) {
      data.country = country;
    }
    if (category) {
      data.category = category;
    }

    app.http.promiseGet('/site/merchant/list', data)
      .then(res => {
        this.allMerchants = res.result;
        res.result.forEach(merchant => {
          this.data.merchants.push(merchant);
        })
        this.setData({
          merchants: this.data.merchants
        });
      })
      .catch(error => {
        app.toast(error);
      })
  }
})
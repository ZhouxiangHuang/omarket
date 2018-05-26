//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    motto: 'Hello',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('ton.open-type.getUserInfo'),
    categories: [],
    newCategory: ''
  },
  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    var that = this;
    app.http.get('/site/product/merchant-categories', {}, function(res) {
        if(res.result_code === 10000) {
            if(res.result.length > 0) {
                that.setData({
                    categories: res.result
                })
            }
        }
    });
  },
  editCategory: function (e) {
    var inputVal = e.detail.value;
    var id = e.currentTarget.dataset.input;
    this.data.categories.forEach(function(category) {
      if(category.id === id) {
        category.name = inputVal;
      }
    })
  },
  addCategory: function (e) {
    var newCategory = {id: new Date().getTime(), name: ''};
    this.data.categories.push(newCategory);
    this.setData({
      categories: this.data.categories
    });
  },
  save: function(e) {
    var form = {};
    this.data.categories.forEach(function(category) {
      if(category.name) {
        form[category.id] = category.name;
      }
    })

    app.http.post('/site/product/update-merchant-category', {form: form}, function(res) {
      if(res.result_code === 10000) {
        wx.navigateBack(1);
      }
    })
  },
  delete: function(e) {
    var id = e.currentTarget.dataset.input;
    var newCategories = [];
    this.data.categories.forEach(function(category) {
      if(category.id !== id) {
        newCategories.push(category);
      }
    })
    this.setData({
      categories: newCategories
    });    
  }
})

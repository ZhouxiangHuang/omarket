//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    user: {},
    categories: [],
    newCategory: ''
  },
  onLoad: function () {
    var that = this;
    app.http.promiseGet('/site/product/merchant-categories', {})
      .then(res => {
        if (res.result.length > 0) {
          that.setData({
            categories: res.result
          })
        }
      })
  },
  onShow: function () {
    this.setData({
      user: app.globalData.user
    })
  },
  editCategory: function (e) {
    var inputVal = e.detail.value;
    var id = e.currentTarget.dataset.input;
    this.data.categories.forEach(category => {
      if (category.id === id) {
        category.name = inputVal;
      }
    })
  },
  addCategory: function (e) {
    var newCategory = {
      id: new Date().getTime(),
      name: ''
    };
    this.data.categories.push(newCategory);
    this.setData({
      categories: this.data.categories
    });
  },
  save: function (e) {
    var form = {};

    let isValid = true;
    this.data.categories.forEach(category => {
      if (!this.isValid(category.name)) {
        isValid = false;
      }
      if (category.name) {
        form[category.id] = category.name;
      }
    })

    if (!isValid) {
      return false;
    }

    app.http.promisePost('/site/product/update-merchant-category', {
        form: form
      })
      .then(res => {
        wx.navigateBack(1);
      })
  },
  delete: function (e) {
    var id = e.currentTarget.dataset.input;
    var newCategories = [];
    this.data.categories.forEach(category => {
      if (category.id !== id) {
        newCategories.push(category);
      }
    })
    this.setData({
      categories: newCategories
    });
  },
  isValid: function (name) {
    if (name.length > 5) {
      app.toast('类别名称最多5个字哦');
      return false;
    }

    return true;
  }
})
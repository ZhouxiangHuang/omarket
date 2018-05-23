//index.js
//获取应用实例
const app = getApp()

Page({
  tag: 0,
  mode: '',
  data: {
    countries: [],
    selectedRecord: {},
    motto: 'list',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('ton.open-type.getUserInfo'),
    list: []
  },
  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function (option) {
    this.tag = option.tag;
    var that = this;
    this.mode = option.mode;
    if(option.mode == "regions") {
      app.http.get('/site/user/regions', {}, function(res) {
        that.data.countries = res.result;
        if(res.result_code === 10000) {
          that.setData({
            list: res.result
        })
        }
      });
    } else {
        app.http.get('/site/product/categories', {}, function(res) {
          if(res.result_code === 10000) {
            that.setData({
              list: res.result
          })
          }
        });
    }

  },
  select: function(e) {
    var selectedCategory = e.currentTarget.dataset.select;
    if(selectedCategory.children && selectedCategory.children.length > 0) {
      this.setData({
        list: selectedCategory.children
      })
    } else {
      //make selection
      this.data.countries.forEach(function(country) {
        if(selectedCategory['country_code'] === country['country_code']) {
          selectedCategory['country'] = country['name'];
        }
      })

      console.log(selectedCategory);

      if(this.mode === "regions") {
        app.globalData.region = selectedCategory;
      } else {
        var record = {'id': selectedCategory.id, 'tag': this.tag, 'name': selectedCategory.name}
        app.globalData.tagRecord = record;
      }
      wx.navigateBack(1);
    }
  }
})
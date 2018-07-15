//index.js
//获取应用实例
const app = getApp()
const REGION_MODE = "regions";

Page({
  tag: 0,
  mode: '',
  data: {
    countries: [],
    selectedRecord: {},
    userInfo: {},
    list: []
  },
  onLoad: function (option) {
    this.tag = option.tag;
    this.tag2 = option.tag2;
    this.tag3 = option.tag3;
    this.mode = option.mode;
    if (option.mode == REGION_MODE) {
      app.http.promiseGet('/site/user/regions', {})
        .then(res => {
          this.data.countries = res.result;
          this.setData({
            list: res.result
          })
        })
    } else {
      app.http.promiseGet('/site/product/categories', {})
        .then(res => {
          this.setData({
            list: res.result
          })
        })
    }
  },
  select: function (e) {
    var selectedCategory = e.currentTarget.dataset.select;
    if (selectedCategory.children && selectedCategory.children.length > 0) {
      this.setData({
        list: selectedCategory.children
      })
    } else {
      //make selection
      this.data.countries.forEach(function (country) {
        if (selectedCategory['country_code'] === country['country_code']) {
          selectedCategory['country'] = country['name'];
        }
      })

      if (this.mode === REGION_MODE) {
        app.globalData.region = selectedCategory;
      } else {
        var existingTags = [this.tag2, this.tag3];
        if (existingTags.includes(selectedCategory.id.toString())) {
          app.toast('此标签已存在，请重新选择');
          return false;
        }
        var record = {
          'tag_id': selectedCategory.id,
          'prev_tag': this.tag,
          'name': selectedCategory.name
        }
        app.globalData.tagRecord = record;
      }
      wx.navigateBack(1);
    }
  }
})
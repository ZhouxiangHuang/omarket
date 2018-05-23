//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    announcement: '哈',
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('ton.open-type.getUserInfo'),
    startTime: '06:00',
    endTime: '18:00',
    hiddenModal:true,
    form: {tags: []},
    tag1: '',
    tag2: '',
    tag3: '',    
    countryCode: 0,
    cityCode: 0,
  },
  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    var that = this;
    app.http.get('/site/merchant/detail', {}, function(res) {
      that.data.countryCode = res.result.country_code;
      that.data.cityCode = res.result.city_code;
      that.data.form.tags = res.result.tags;
      that.data.form.announcement = res.result.announcement;      
      that.setData({
        merchant: res.result, 
        tag1: res.result.tag_names[0], 
        tag2: res.result.tag_names[1],
        tag3: res.result.tag_names[2],
        form: that.data.form
      });
      
      // this.setData({
      //   merchant: {imageUrl: '/images/missgrace.jpeg', 
      //               store_name: 'MISS GRACE', 
      //               region: '匈牙利/布达佩斯',
      //               address: 'Baross Gabor utca 73', 
      //               tags:['牛仔裤','运动服','休闲'],
      //               description: '买卖的都是质量最好的牛仔裤',
      //               mobile: '0036305591038',
      //             },
      // });
    })
  },
  onShow: function(option) {
    var record = app.globalData.tagRecord;
    var region = app.globalData.region;

    if(record) {
      this.data.form.tags.push(record.id);
      if(record.tag === '1') {
        this.setData({
          tag1: record.name
        })
      } else if(record.tag === '2') {
        this.setData({
          tag2: record.name
        })
      } else {
        this.setData({
          tag3: record.name
        })
      }
    }

    if(region) {
      var merchant = this.data.merchant;
      this.data.countryCode = region.country_code;
      this.data.cityCode = region.city_code;     
      merchant.region = region.country + "/" + region.name;
      this.setData({
        merchant: merchant
      })
    }
  },
   /**
   * 监听时间picker选择器
   */
  listenerStartTimePickerSelected: function(e) {
    this.setData({
        startTime: e.detail.value
    });
  },

  listenerEndTimePickerSelected: function(e) {
    this.setData({
        endTime: e.detail.value
    });
  },
  annouce: function(e) {
    this.setData({
      hiddenModal: false
    })
  },
  listenerConfirm: function(e) {
    this.setData({
      hiddenModal: true,
      form: this.data.form
    })
  },
  listenerCancel: function() {
    this.setData({
      hiddenModal: true,
      announcement: ''
    })
  },
  announceContent: function(e) {
    var inputVal = e.detail.value;
    this.data.form.announcement = inputVal;
  },
  selectTag: function(e) {
    var tag = e.currentTarget.dataset.tag;
    wx.navigateTo({
      url: '../list/list?tag=' + tag
    })
  },
  updateMerchant: function(e) {
      var form = {
        name: this.data.merchant.store_name,
        start: this.data.startTime,
        end: this.data.endTime,
        tags: this.data.form.tags,
        mobile: this.data.merchant.mobile,
        announcement: this.data.form.announcement,  
        address: this.data.merchant.address,    
        city_code: this.data.cityCode,
        country_code: this.data.countryCode,
      }

      console.log(form);
      // var form = {
      //   name: 'ASDFASDEWDF',
      //   start: "05:00",
      //   end: "18:00",
      //   tags: [111, 6, 29],
      //   mobile: '41324123423',
      //   announcement: '我先来测试一下今天的天气到底好不好',  
      //   address: 'baross gabor utca 328',                 
      // }
      app.http.post('/site/merchant/update', form, function(res) {
        console.log(res);
      });
  },
  selectRegion: function(e) {
    wx.navigateTo({
      url: '../list/list?mode=regions'
    })
  }
})

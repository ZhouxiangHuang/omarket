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
  },
  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    this.setData({
      merchant: {imageUrl: '/images/missgrace.jpeg', 
                  name: 'MISS GRACE', 
                  address: 'Baross Gabor utca 73', 
                  tags:['牛仔裤','运动服','休闲'],
                  description: '买卖的都是质量最好的牛仔裤',
                  mobile: '0036305591038',
                },
    });
  },
  onShow: function(option) {
    var record = app.globalData.tagRecord;
    console.log(record);
    if(record) {
      this.data.form.tags.push(record.id);
    }

    if(record) {
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
  selectTap: function(e) {
    var tag = e.currentTarget.dataset.tag;
    wx.navigateTo({
      url: '../list/list?tag=' + tag
    })
  },
  updateMerchant: function(e) {
      var form = {
        name: this.data.merchant.name,
        start: this.data.startTime,
        end: this.data.endTime,
        tags: this.data.form.tags,
        mobile: this.data.merchant.mobile,
        announcement: this.data.form.announcement,  
        address: this.data.merchant.address,                 
      }

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
  }
})

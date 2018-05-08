//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('ton.open-type.getUserInfo'),
    startTime: '06:00',
    endTime: '18:00',
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
  }
})

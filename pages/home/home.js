//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('ton.open-type.getUserInfo'),
    proList: [{selected: false, proUrl: '/images/jeans.jpg'}, {selected: false, proUrl: '/images/missgrage.jpeg'}]
  },
  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    console.log(this.data);     
  },
  //滑动获取选中商品
  getSelectItem:function(e){
    var that = this;
    var itemWidth = e.detail.scrollWidth / that.data.proList.length;//每个商品的宽度
    var scrollLeft = e.detail.scrollLeft;//滚动宽度
    var curIndex = Math.round(scrollLeft / itemWidth);//通过Math.round方法对滚动大于一半的位置进行进位
    for (var i = 0, len = that.data.proList.length; i < len; ++i) {
        that.data.proList[i].selected = false;
    }
    that.data.proList[curIndex].selected = true;
    that.setData({
        proList: that.data.proList,
        giftNo: this.data.proList[curIndex].id
    });
},
  getUserInfo: function (e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  }
})

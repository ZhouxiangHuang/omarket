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

  onLoad: function () {
   
  },
  logout: function() {
      wx.redirectTo({
        url: '../login/login'
      })
  }
})

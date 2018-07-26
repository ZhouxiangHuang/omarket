//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    hasUserInfo: false,
    user: {},
    merchant: {}
  },
  onLoad: function () {

  },
  onShow: function () {
 
  },
  copy: function (e) {
    let content = e.currentTarget.dataset.content;
    wx.setClipboardData({
        data: content,
        success: res => {
            console.log('复制成功！');
        }
    })
  }
  

})
//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('ton.open-type.getUserInfo'),
    userColor: '#FF4343',
    userFont: 'white',    
    merchantColor: 'white',
    merchantFont: '#FF4343', 
    role: 2 // 2 => user, 1 => merchant
  },
  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    wx.getUserInfo({
      success: res => {
        app.globalData.userInfo = res.userInfo
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    })
  },
  getUserInfo: function (e) {
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  login: function (e) {
    wx.showLoading({
      title: '登陆中',
      mask: true
    })
    wx.login({
      success: res => {
        var data ={'code': res.code, 'role': this.data.role};
        if(this.data.role == 1) {
          data['store_name'] = this.data.storeName;
          data['address'] = this.data.address;
          data['mobile'] = this.data.mobile;      
        }
        app.http.post('/site/user/login',data,function(res){ 
          wx.hideLoading();
          if(res.result_code === 10000) {
            var token = res.result.access_token;
            wx.setStorage({key: 'token',data: token})
            wx.switchTab({
              url: '../merchant-list/merchant-list',  //注意switchTab只能跳转到带有tab的页面，不能跳转到不带tab的页面
            })
          } else {
            wx.showToast({
              title: res.reason,
              duration: 3000,
              icon: 'none'
            });
          }
        });  
      }
    })
  },
  changeRole: function() {
    var newRole = (this.data.role === 1) ? 2 : 1;
    this.setData({
      userColor: this.data.merchantColor,
      merchantColor: this.data.userColor,
      userFont: this.data.merchantFont,
      merchantFont: this.data.userFont,
      role: newRole
    })
  },
  bindStoreName: function(e) {
    this.setData({
      storeName: e.detail.value
    })
  },
  bindMobile: function(e) {
    this.setData({
      mobile: e.detail.value
    })  },
  bindAddress: function(e) {
    this.setData({
      address: e.detail.value
    })  
  }
})


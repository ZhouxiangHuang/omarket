//index.js
//获取应用实例
const app = getApp()

Page({
  role: 2, // 2 => user, 1 => merchant
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('ton.open-type.getUserInfo'),
    authorized: false,
    userColor: '#FF4343',
    userFont: 'white',    
    merchantColor: 'white',
    merchantFont: '#FF4343', 
    role: 2       
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
    wx.login({
      success: res => {
        app.http.post('/site/user/login',{'code': res.code, 'role': this.data.role},function(res){ 
          console.log(res);
          if(res.result_code === 10000) {
            this.setData({
              authorized: true
            });
            var url = (this.data.roel === 1) ? '../edit-merchant-info/edit-merchant-info' : '../merchant-list/merchant-list';
            wx.switchTab({
              url: '../taste/index',  //注意switchTab只能跳转到带有tab的页面，不能跳转到不带tab的页面
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
  userLogin: function() {
    this.role = 2;
    this.changeRole();
  },
  merchantLogin: function() {
    this.role = 1;
    this.changeRole();
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
  }
})


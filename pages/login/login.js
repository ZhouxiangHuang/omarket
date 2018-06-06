//index.js
//获取应用实例
const app = getApp()
const USER_ROLE = 2;
const MERCHANT_ROLE = 1;

Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    userColor: '#FF4343',
    userFont: 'white',    
    merchantColor: 'white',
    merchantFont: '#FF4343', 
    role: USER_ROLE,
    isMerchant: false,
    codes: [],
    telCodeIndex: 6
  },
  onLoad: function () {
    this.setData({
      isMerchant: app.globalData.isMerchant
    })

    wx.getUserInfo({
      success: res => {
        app.globalData.userInfo = res.userInfo
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    })

    var that = this;
    app.http.get('/site/user/tel-codes', {}, function(res) {
      if(res.result_code === 10000) {
        res.result.map(function(country) {
          country.name = country.name + ' (+' + country.tel_code + ')';
        })

        that.setData({
          codes: res.result
        });
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
        var data = {'code': res.code, 'role': this.data.role};
        if(this.data.role == MERCHANT_ROLE) {
          data['store_name'] = this.data.storeName;
          data['address'] = this.data.address;
          data['mobile'] = '+' + this.data.codes[this.data.telCodeIndex].tel_code + this.data.mobile;      
        }
        var that = this;
        app.http.post('/site/user/login',data,function(res){ 
          if(res.result_code === 10000) {
            app.globalData.userRole = that.data.role; 
            var token = res.result.access_token;
            wx.setStorage({key:'token',data: token})
            wx.switchTab({
              url: '../merchant-list/merchant-list',  //注意switchTab只能跳转到带有tab的页面，不能跳转到不带tab的页面
            })
          } else {
            wx.showToast({
              title: '登录失败',
              duration: 3000,
              icon: 'none'
            });
          }
        });  
      }
    })
  },
  changeRole: function() {
    var newRole = (this.data.role === MERCHANT_ROLE) ? USER_ROLE : MERCHANT_ROLE;
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
  },
  selectCodes: function(e) {
    this.setData({
      telCodeIndex: e.detail.value
    })
  }
})


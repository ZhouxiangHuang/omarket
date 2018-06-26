//index.js
//获取应用实例
const app = getApp()


Page({
  data: {
    hasUserInfo: false,
    user: {},
    userColor: 'white',
    userFont: '#FF4343',    
    merchantColor: '#FF4343',
    merchantFont: 'white', 
    codes: [],
    telCodeIndex: 6,
    filterCountries: [],
  },
  onLoad: function () {
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
  onShow: function () {
    if(!app.globalData.hasUserInfo) {
      var that = this;
      app.getUserInfo(function() {
        that.setData({
          user: app.globalData.user,
          hasUserInfo: true
        });
        that.setColors(app.globalData.user.currentRole);
      });
    } else {
      this.setData({
        user: app.globalData.user,
        hasUserInfo: true
      });
      this.setColors(app.globalData.user.currentRole);
      console.log('current role', app.globalData.user)
    }
  },
  login: function (e) {
    wx.login({
      success: res => {
        var data = {};
        data.code = res.code;
        data.role = this.data.user.currentRole;
        if(this.data.user.currentRole == app.merchantRole) {
          data.store_name = this.data.user.merchantInfo.storeName;
          data.address = this.data.user.merchantInfo.address;
          data.mobile = '+' + this.data.codes[this.data.telCodeIndex].tel_code + this.data.user.merchantInfo.mobile;
          if(!this.isValid(data)) {
            return false;
          }
        }
        var that = this;
        app.http.post('/site/user/login',data,function(res) { 
          if(res.result_code === 10000) {
            app.globalData.user = that.data.user; 
            var token = res.result.access_token;
            wx.setStorage({key:'token',data: token})
            wx.switchTab({
              url: '../merchant-list/merchant-list',  //注意switchTab只能跳转到带有tab的页面，不能跳转到不带tab的页面
            })
          } else {
            app.toast('登录失败');
          }
          console.log(app.globalData.user);
        });  
      },
      fail: res => {
        app.toast('登录失败, 请查看网络连接');
      }
    })
  },
  changeRole: function() {
    var newRole = (this.data.user.currentRole === app.merchantRole) ? app.userRole : app.merchantRole;
    this.data.user.currentRole = newRole;
    this.setData({
      userColor: this.data.merchantColor,
      merchantColor: this.data.userColor,
      userFont: this.data.merchantFont,
      merchantFont: this.data.userFont,
      user: this.data.user
    })
  },
  bindStoreName: function(e) {
    this.data.user.merchantInfo.storeName = e.detail.value;
    this.setData({
      user: this.data.user
    })
  },
  bindMobile: function(e) {
    this.data.user.merchantInfo.mobile = e.detail.value;
    this.setData({
      user: this.data.user
    })  
  },
  bindAddress: function(e) {
    this.data.user.merchantInfo.address = e.detail.value;
    this.setData({
      user: this.data.user
    })  
  },
  selectCodes: function(e) {
    this.setData({
      telCodeIndex: e.detail.value
    })
  }, 
  isValid: function(data) {
    if(this.data.user.isMerchant) {
      return true;
    }

    if(data.store_name === null) {
      app.toast("请输入店名");
      return false;
    }
    if(!data.address) {
      app.toast("请输入地址");
      return false;
    }
    if(data.mobile.includes('undefined')) {
      app.toast("请输入手机号码");
      return false;
    }

    return true;
  },
  setColors: function(role) {
    if(role === app.merchantRole) {
      this.setData({
        userColor: 'white',
        userFont: '#FF4343',    
        merchantColor: '#FF4343',
        merchantFont: 'white'
      })
    } else {
      this.setData({
        userColor: '#FF4343',
        userFont: 'white',    
        merchantColor: 'white',
        merchantFont: '#FF4343'
      })
    }
  }
})


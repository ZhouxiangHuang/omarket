//index.js
//获取应用实例
const app = getApp();

Page({
  isRedirect: false,
  isLoggedOut: false,
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
  onLoad: function (option) {
    //进入页面场景：未注册用户从其他页面跳转，未注册用户直接打开，注册用户直接打开，注册用户退出登录
    if (this.isRedirect = (option.redirect == 1)) {
      this.isLoggedOut = (option.logout == 1);
    } else {
      //直接打开需要验证身份，以便直接进入程序跳过登录
      app.validate()
        .then(res => {
          return app.initUserInfo();
        })
        .then(user => {
          console.log('current role', app.globalData.user)
          wx.switchTab({
            url: '../merchant-list/merchant-list',
          })
        })
    }

    this.renderTelCode();
  },
  onShow: function () {
    this.setData({
      user: app.globalData.user,
      hasUserInfo: app.globalData.hasUserInfo
    });

    if (!this.data.hasUserInfo) {
      this.data.user.currentRole = app.userRole; //给第一次登陆的用户
      this.setColors(app.userRole);
    } else {
      this.setColors(app.globalData.user.currentRole);
    }
  },
  login: function (e) {
    app.wxApi.wxLogin()
      .then(res => {
        var data = {};
        data.code = res.code;
        data.role = this.data.user.currentRole;
        if (this.data.user.currentRole == app.merchantRole) {
          data.store_name = this.data.user.merchantInfo.storeName;
          data.address = this.data.user.merchantInfo.address;
          data.mobile = '+' + this.data.codes[this.data.telCodeIndex].tel_code + this.data.user.merchantInfo.mobile;
          if (!this.isValid(data)) {
            return false;
          }
        }
        return app.http.promisePost('/site/user/login', data);
      })
      .then(res => {
        app.globalData.user = this.data.user;
        app.globalData.isLoggedIn = true;
        var token = res.result.access_token;
        return app.wxApi.wxSetStorage('token', token);
      })
      .then(res => {
        return app.initUserInfo();
      })
      .then(user => {
        if (this.isRedirect && !this.isLoggedOut) {
          wx.navigateBack(1);
        } else {
          wx.switchTab({
            url: '../merchant-list/merchant-list', //注意switchTab只能跳转到带有tab的页面，不能跳转到不带tab的页面
          })
        }
      })
      .catch(error => {
        console.error(error);
        app.toast('登录失败, 请稍后再试');
      })
  },
  switchRole: function () {
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
  bindStoreName: function (e) {
    this.data.user.merchantInfo.storeName = e.detail.value;
    this.setData({
      user: this.data.user
    })
  },
  bindMobile: function (e) {
    this.data.user.merchantInfo.mobile = e.detail.value;
    this.setData({
      user: this.data.user
    })
  },
  bindAddress: function (e) {
    this.data.user.merchantInfo.address = e.detail.value;
    this.setData({
      user: this.data.user
    })
  },
  selectCodes: function (e) {
    this.setData({
      telCodeIndex: e.detail.value
    })
  },
  isValid: function (data) {
    if (this.data.user.isMerchant) {
      return true;
    }

    if (!data.store_name) {
      app.toast("请输入店名");
      return false;
    }
    if (!data.address) {
      app.toast("请输入地址");
      return false;
    }
    if (data.mobile.includes('undefined')) {
      app.toast("请输入手机号码");
      return false;
    }

    return true;
  },
  setColors: function (role) {
    if (role === app.merchantRole) {
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
  },
  renderTelCode: function () {
    app.http.promiseGet('/site/user/tel-codes', {})
      .then(res => {
        res.result.map(country => {
          country.name = country.name + ' (+' + country.tel_code + ')';
        })
        this.setData({
          codes: res.result
        });
      })
  }
})
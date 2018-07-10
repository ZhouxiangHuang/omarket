//index.js
//获取应用实例
const app = getApp();

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
    app.http.promiseGet('/site/user/tel-codes', {})
      .then(res => {
        res.result.map(country => {
          country.name = country.name + ' (+' + country.tel_code + ')';
        })
        this.setData({
          codes: res.result
        });
      })
  },
  onShow: function () {
    this.setData({
      user: app.globalData.user,
      hasUserInfo: app.globalData.user
    });

    if (!this.data.hasUserInfo) {
      this.setColors(app.userRole);
    } else {
      this.setColors(app.globalData.user.currentRole);
    }
    console.log('current role', app.globalData.user)
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
        if (this.data.user.currentRole == app.merchantRole) {
          app.globalData.user.merchantInfo.id = res.result.merchant_id;
        }
        var token = res.result.access_token;
        wx.setStorage({
          key: 'token',
          data: token
        })
        wx.switchTab({
          url: '../merchant-list/merchant-list', //注意switchTab只能跳转到带有tab的页面，不能跳转到不带tab的页面
        })
      })
      .catch(error => {
        console.log(error);
        app.toast('登录失败, 请稍后再试');
      })
  },
  changeRole: function () {
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

    if (data.store_name === null) {
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
  }
})
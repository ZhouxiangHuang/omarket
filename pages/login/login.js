//index.js
//获取应用实例
const app = getApp();

Page({
  isRedirect: false,
  isLoggedOut: false,
  newMerchantRegister: false,
  countryCode: null,
  cityCode: null,
  data: {
    hasUserInfo: false,
    user: {
      merchantInfo: {}
    },
    userColor: 'white',
    userFont: '#FF4343',
    merchantColor: '#FF4343',
    merchantFont: 'white',
    codes: [],
    telCodeIndex: 6,
    filterCountries: [],
    selectedRegion: null,
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
          this.setData({
            user: user,
            hasUserInfo: app.globalData.hasUserInfo
          });
          wx.switchTab({
            url: '../merchant-list/merchant-list',
          })
        })
    }

    this.renderTelCode();
  },
  onShow: function () {
    app.wxApi.wxGetStorage('storeName')
      .then(res => {
        this.data.user.merchantInfo.storeName = res;
        this.setData({
          user: this.data.user,
        });
      })
      .catch(error => {
        console.error(error);
      })

    this.setData({
      user: app.globalData.user,
      hasUserInfo: app.globalData.hasUserInfo
    });

    if (!this.data.hasUserInfo) {
      this.data.user.currentRole = app.userRole; //给第一次登陆的用户
      this.setData({
        user: this.data.user
      })  
      this.setColors(app.userRole);
    } else {
      this.setColors(app.globalData.user.currentRole);
    }

    let region = app.globalData.region;
    if (region) {
      this.data.user.currentRole = app.merchantRole;
      this.countryCode = region.country_code;
      this.cityCode = region.city_code;
      this.setColors(app.merchantRole);
      this.setData({
        selectedRegion: region.country + "/" + region.name,
        user: this.data.user
      });
    }
  },
  login: function (e) {
    var data = {};
    if (this.data.user.currentRole == app.merchantRole) {
      data.store_name = this.data.user.merchantInfo.storeName;
      data.country_code = this.countryCode;
      data.city_code = this.cityCode;
      data.mobile = '+' + this.data.codes[this.data.telCodeIndex].tel_code + this.data.user.merchantInfo.mobile;
      if (!this.isValid(data)) {
        return false;
      }
    }

    app.wxApi.wxLogin()
      .then(res => {
        data.code = res.code;
        data.role = this.data.user.currentRole;
        return app.http.promisePost('/site/user/login', data);
      })
      .then(res => {
        console.log(res);
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
        } else if (this.newMerchantRegister) {
          wx.navigateTo({
            url: '../edit-merchant-info/edit-merchant-info?merchant_id=' + user.merchantInfo.id + '&is_new=1',
          })
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
      user: this.data.user,
      selectRegion: null,
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
  selectRegion: function (e) {
    app.wxApi.wxSetStorage('storeName', this.data.user.merchantInfo.storeName);
    wx.navigateTo({
      url: '../list/list?mode=regions'
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
      console.log('runnn');
      app.toast("请输入店名");
      return false;
    }
    if (!data.country_code) {
      app.toast("请选择你所在的地区");
      return false;
    }
    if (data.mobile.includes('undefined')) {
      app.toast("请输入手机号码");
      return false;
    }

    this.newMerchantRegister = true;
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
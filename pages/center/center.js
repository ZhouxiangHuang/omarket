//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    hasUserInfo: false,
    user: {},
    merchant: {}
  },
  onShow: function () {
    app.wxApi.wxGetUserInfo()
      .then(res => {
        app.globalData.user.nickName = res.userInfo.nickName;
        app.globalData.user.avatarUrl = res.userInfo.avatarUrl;
        this.setData({
          user: app.globalData.user,
          hasUserInfo: true
        })
      })
      .catch(error => {
        this.setData({
          user: app.globalData.user,
          hasUserInfo: true
        })
        console.error(error);
      })

    if (app.globalData.user.currentRole == app.merchantRole) {
      app.http.promiseGet('/site/merchant/detail', {
          merchant_id: app.globalData.user.merchantInfo.id
        })
        .then(res => {
          this.setData({
            merchant: res.result
          });
        })
    }
  },
  logout: function () {
    wx.redirectTo({
      url: '../login/login?redirect=1&logout=1'
    })
  },
  getCollections: function () {
    wx.navigateTo({
      url: '../collections/collections'
    })
  },
  myStore: function () {
    wx.navigateTo({
      url: '../product-list/product-list?merchantId=' + this.data.user.merchantInfo.id,
      fail: function (e) {
        console.log(e);
      }
    })
  },
  posterGenerate: function () {
    wx.navigateTo({
      url: '../poster-generate/poster-generate?merchant_id=' + this.data.user.merchantInfo.id,
      fail: function (e) {
        console.log(e);
      }
    })
  },
  codeGenerate: function () {
    wx.navigateTo({
      url: '../code/code',
      fail: function (e) {
        console.log(e);
      }
    })
  },
  aboutUs: function () {
    wx.navigateTo({
      url: '../about-us/about-us',
      fail: function (e) {
        console.log(e);
      }
    })
  }

})
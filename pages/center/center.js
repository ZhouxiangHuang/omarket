//index.js
//获取应用实例
const app = getApp()
import regeneratorRuntime from '../../libs/runtime';

Page({
  data: {
    hasUserInfo: false,
    user: {},
    merchant: {}
  },
  async getUserInfo() {
    let result = await app.wxApi.wxGetUserInfo();
    app.globalData.user.nickName = result.userInfo.nickName;
    app.globalData.user.avatarUrl = result.userInfo.avatarUrl;
    this.setData({
      user: app.globalData.user,
      hasUserInfo: true
    })
  },
  async getMerchantDetail() {
    let res = await app.merchant.getDetail(app.globalData.user.merchantInfo.id);
    this.setData({
      merchant: res.result
    });
  },
  onShow: function () {
    this.getUserInfo();
    if (app.globalData.user.currentRole == app.merchantRole) {
      this.getMerchantDetail();
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
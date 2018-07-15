//index.js
//获取应用实例
const app = getApp()

Page({
  config: {},
  tempFile: null,
  posterId: 1,
  merchantName: null,
  data: {},
  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function (option) {
    this.merchantName = option.merchant_name;
    this.getNewPoster();
  },
  getUserInfo: function (e) {
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  getNewPoster: function () {
    var data = {
      id: this.posterId
    };
    app.http.promiseGet('/site/merchant/share', data)
      .then(res => {
        this.config = this.formatConfig(res.result);
        this.generate(this.config);
        this.posterId = res.result.next_poster_id;
      })
      .catch(error => {
        app.toast('系统错误，请尝试联系客服');
      })
  },
  generate: function (config) {
    wx.showLoading({
      title: '正在为您制作海报...',
      mask: true
    });

    var tempFilePath = null;
    app.wxApi.wxDownloadFile(config.image.url)
      .then(res => {
        tempFilePath = res.tempFilePath
        return app.wxApi.wxDownloadFile(config.qrCode.url);
      })
      .then(res => {
        let context = wx.createCanvasContext('firstCanvas');
        context.scale(config.image.scaleX, config.image.scaleY);
        context.drawImage(tempFilePath, config.image.posX, config.image.posY);
        context.scale(config.qrCode.scaleX, config.qrCode.scaleY);
        context.drawImage(res.tempFilePath, config.qrCode.posX, config.qrCode.posY);
        context.setFontSize(config.fontSize);
        context.setFillStyle(config.fontColor);
        context.fillText(this.merchantName, config.fontX, config.fontY);
        context.draw();
        wx.hideLoading();
      })
      .catch(error => {
        console.error(error);
      })
  },
  saveToAlbum: function () {
    wx.canvasToTempFilePath({
      canvasId: 'firstCanvas',
      success: res => {
        var tempFilePath = res.tempFilePath;
        this.tempFile = tempFilePath;
        this.save();
      },
      fail: function (res) {
        console.log(res);
      }
    })
  },
  save: function () {
    var that = this;
    wx.getSetting({
      success(res) {
        if (!res.authSetting['scope.writePhotosAlbum']) {
          wx.authorize({
            scope: 'scope.writePhotosAlbum',
            success() {
              console.log('授权成功');
              wx.saveImageToPhotosAlbum({
                filePath: this.tempFile,
                success: function (res) {
                  app.toast('已保存到您的相册');
                },
                fail: function (res) {
                  console.log(res);
                }
              })
            },
            fail() {
              console.log('授权失败');
            }
          })
        } else {
          wx.saveImageToPhotosAlbum({
            filePath: that.tempFile,
            success: function (res) {
              app.toast('已保存到您的相册');
            },
            fail: function (res) {
              console.log(res);
            }
          })
        }
      }
    })
  },
  formatConfig: function (data) {
    var config = {};
    config.image = {};
    config.image.url = data.image_url;
    config.image.scaleX = data.image_scale_x;
    config.image.scaleY = data.image_scale_y;;
    config.image.posX = data.image_pos_x;
    config.image.posY = data.image_pos_y;
    config.qrCode = {};
    config.qrCode.url = data.qr_url;
    config.qrCode.scaleX = data.qr_scale_x;
    config.qrCode.scaleY = data.qr_scale_y;
    config.qrCode.posX = data.qr_pos_x;
    config.qrCode.posY = data.qr_pos_y;
    config.fontColor = data.font_color;
    config.fontSize = data.font_size;
    config.fontX = data.font_x;
    config.fontY = data.font_y;
    return config;
  }
})
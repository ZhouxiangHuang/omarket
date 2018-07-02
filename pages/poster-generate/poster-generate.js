//index.js
//获取应用实例
const app = getApp()

Page({
  config: {},
  tempFile: null,
  data: {
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    this.getNewPoster();
  },
  getUserInfo: function(e) {
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  getNewPoster: function() {
    var that = this;
    var data = {};
    app.http.get('/site/merchant/share', data, function(res) {
      if(res.result_code == 10000) {
        that.config = that.formatConfig(res.result);
        that.generate(that.config);
      } else {
        app.toast('系统错误，请尝试联系客服');
      }
    });
  },
  generate: function(config) {
    var context = wx.createCanvasContext('firstCanvas');
    context.scale(config.image.scaleX, config.image.scaleY); 
    context.drawImage(config.image.url, config.image.posX, config.image.posY);
    context.scale(config.qrCode.scaleX, config.qrCode.scaleY); 
    context.drawImage(config.qrCode.url, config.qrCode.posX, config.qrCode.posY);
    context.draw()

    var that = this;
    wx.canvasToTempFilePath({
      canvasId: 'firstCanvas',
      success: function (res) {
        var tempFilePath = res.tempFilePath;
        that.tempFile = tempFilePath;
      },
      fail: function (res) {
          console.log(res);
      }
    })
  },
  save: function() {
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
                  success: function(res) {
                    app.toast('已保存到您的相册');
                  },
                  fail: function(res) {
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
              success: function(res) {
                app.toast('已保存到您的相册');
              },
              fail: function(res) {
                console.log(res);
              }
            })
        }
      }
    })
  },
  formatConfig: function(data) {
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
    return config;
  }
})

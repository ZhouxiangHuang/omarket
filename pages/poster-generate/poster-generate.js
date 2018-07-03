//index.js
//获取应用实例
const app = getApp()

Page({
  config: {},
  tempFile: null,
  posterId : 1,
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
    var data = {id: this.posterId};
    var that = this;
    app.http.get('/site/merchant/share', data, function(res) {
      if(res.result_code == 10000) {
        that.config = that.formatConfig(res.result);
        that.generate(that.config);
        that.posterId = res.result.next_poster_id;
      } else {
        app.toast('系统错误，请尝试联系客服');
      }
    });
  },
  generate: function(config) {
    var that = this;
    wx.showLoading({title: '正在为您制作海报...',mask: true});
    wx.downloadFile({
      url: config.image.url,
      success: function (sres) {
        wx.downloadFile({
          url: config.qrCode.url,
          success: function (res) {
            var context = wx.createCanvasContext('firstCanvas');
            context.scale(config.image.scaleX, config.image.scaleY); 
            context.drawImage(sres.tempFilePath, config.image.posX, config.image.posY);
            context.scale(config.qrCode.scaleX, config.qrCode.scaleY); 
            context.drawImage(res.tempFilePath, config.qrCode.posX, config.qrCode.posY);
            context.draw();
            wx.hideLoading();
          },fail:function(res){
            console.log(res);
            wx.hideLoading();
          }
        })
      },fail:function(fres){
        wx.hideLoading();
        console.log(fres);
      }
    });

  },
  saveToAlbum: function() {
    var that = this;
    wx.canvasToTempFilePath({
      canvasId: 'firstCanvas',
      success: function (res) {
        var tempFilePath = res.tempFilePath;
        that.tempFile = tempFilePath;
        that.save();
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

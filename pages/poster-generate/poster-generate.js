//index.js
//获取应用实例
const app = getApp()

Page({
  config: {},
  tempFile: null,
  data: {},
  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function (option) {
    app.http.promiseGet('/site/merchant/detail', {
        merchant_id: option.merchant_id
      })
      .then(res => {
        this.generate(res.result);
      });
  },
  generate: function (merchant) {
    let qrCodeUrl = null;

    app.wxApi.wxDownloadFile(merchant.qr_code)
      .then(res => {
        qrCodeUrl = res.tempFilePath;
        if (merchant.image_url) {
          return app.wxApi.wxDownloadFile(merchant.image_url);
        } else {
          let result = {};
          result.tempFilePath = '/images/default-store.png';
          return result;
        }
      })
      .then(res => {
        let context = wx.createCanvasContext('firstCanvas');
        let hedearFileTempPath = res.tempFilePath
        context.drawImage('/images/invitation.jpeg', 0, 0, 315, 400);
        context.drawImage(hedearFileTempPath, 110, 20, 100, 100);
        context.drawImage(qrCodeUrl, 100, 220, 115, 125);

        let fontSize = 26;
        let text = merchant.store_name;
        let windowWidth = 320;
        context.setFontSize(fontSize);
        let metrics = context.measureText(text);
        let x = (windowWidth - metrics.width) / 2;
        context.setFillStyle('#666');
        context.fillText(text, x, 150);
        context.draw();
      })
      .catch(error => {
        console.error(error);
      })
  },
  saveToAlbum: function () {
    app.wxApi.wxCanvasToTempFilePath('firstCanvas')
      .then(res => {
        var tempFilePath = res.tempFilePath;
        this.tempFile = tempFilePath;
        return app.wxApi.wxGetSetting();
      })
      .then(res => {
        let scope = 'scope.writePhotosAlbum';
        if (!res.authSetting[scope]) {
          app.wxApi.wxAuthorize(scope)
            .then(res => {
              return app.wxApi.wxSaveImageToPhotosAlbum(this.tempFile);
            })
            .catch(error => {
              console.error(error);
            })
        } else {
          return app.wxApi.wxSaveImageToPhotosAlbum(this.tempFile);
        }
      })
  }
})
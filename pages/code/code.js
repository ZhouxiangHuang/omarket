//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    code: '******',
  },
  onShow: function () {
    app.http.promiseGet('/site/merchant/generate-code', {})
      .then(res => {
        this.setData({
          code: res.result
        })
      })
  },
})
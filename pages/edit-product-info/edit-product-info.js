//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('ton.open-type.getUserInfo'),
    productImages: [],
    productCode: '',
    productName: '',
    productPrice: 0,
    categories: {},
    categoryIndex: 0,
    isHot: false
  },
  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    var that = this;
    app.http.get('/site/merchant/categories', {}, function(res){
      that.setData({
        categories: res.result
      })
    })
  },
  chooseImage: function(e) {
    var that = this;
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths
        var limit = 6;
        if(that.data.productImages.length === limit) {
          wx.showToast({
            title: '限定上传'+limit+'张照片',
            icon: 'none',
            duration: 3000,
            mask:true
          });
          return false;
        }
        tempFilePaths.forEach(element => {
          that.data.productImages.push(element);
        });

        that.setData({
          productImages: that.data.productImages
        })
      }
    })
  },
  submit: function(e) {
    var that = this;
    var filename = 'file';
    this.data.productImages.forEach(function upload(path, index) {
      if(index === 0) {
        var categoryIndex = that.data.categoryIndex;
        var categoryId = that.data.categories[categoryIndex].id;
        var form = {
            'file_name': filename,
            'code': that.data.productCode,
            'price': that.data.productPrice,
            'name': that.data.productName,
            'merchant_category_id': categoryId,
            'hot': this.data.isHot
        };
      } else {
        var form = {
          'file_name': filename,
          'image_only': true,
          'code': that.data.productCode
        };
      }
    
      wx.uploadFile({
        url: app.http.domain + '/site/product/create',
        filePath: path,
        name: filename,
        formData: form,
      })
    })
  },
  bindPrice: function(e) {
    this.setData({
      productPrice: e.detail.value
    })
  },
  bindProductName: function(e) {
    this.setData({
      productName: e.detail.value
    })  },
  bindProductCode: function(e) {
    this.setData({
      productCode: e.detail.value
    })  
  },
  selectCategory: function(e) {
    this.setData({
      categoryIndex: e.detail.value
    })
  },
  selectHot: function(e) {
    this.setData({
      isHot: !this.data.isHot
    })
  }
})

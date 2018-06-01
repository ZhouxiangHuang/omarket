//index.js
//获取应用实例
const app = getApp()
const FILE_NAME = 'file';

Page({
  data: {
    productImages: [],
    productCode: '',
    productName: '',
    productPrice: 0,
    categories: {},
    categoryIndex: 0,
    isHot: false
  },
  onLoad: function () {
    var that = this;
    app.http.get('/site/merchant/categories', {}, function(res){
      if(res.result_code === 10000) {
        that.setData({
          categories: res.result
        })
      } else {
        wx.showToast({
          title: '请求失败',
          icon: 'fail',
          duration: 1000,
          mask:true
      })
      }
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

        that.setData({
          productImages: tempFilePaths
        })
      }
    })
  },
  submit: function(e) {
    var that = this;
    var uploadedCount = 0;
    this.data.productImages.forEach(function upload(path, index) {
      if(index === 0) {
        //第一次上传带上字段信息，之后只传照片
        var categoryIndex = that.data.categoryIndex;
        var categoryId = that.data.categories[categoryIndex].id;
        var form = {
            'file_name': FILE_NAME,
            'code': that.data.productCode,
            'price': that.data.productPrice,
            'name': that.data.productName,
            'merchant_category_id': categoryId,
            'hot': that.data.isHot ? 1 : 0
        };
      } else {
        var form = {
          'file_name': FILE_NAME,
          'image_only': true,
          'code': that.data.productCode
        };
      }
    
      wx.uploadFile({
        url: app.http.domain + '/site/product/create',
        filePath: path,
        name: FILE_NAME,
        formData: form,
        success: function(res) {
          if(res.data.result_code === 10000) {
            uploadedCount++;
            if(uploadedCount === this.data.productImages.length) {
                wx.navigateBack(1);
            }
          } else {
            wx.showToast({
              title: '上传失败，请稍后再试',
              icon: 'none',
              duration: 3000,
              mask:true
            });
          }
        }
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

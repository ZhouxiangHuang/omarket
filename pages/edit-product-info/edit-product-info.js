//index.js
//获取应用实例
const app = getApp()
const FILE_NAME = 'file';

Page({
  deleteList: [],
  tempName : null,
  data: {
    productImages: [],
    productCode: '',
    productName: '',
    productPrice: 0,
    categories: {},
    categoryIndex: 0,
    categoryId: null,
    isHot: false,
    isEdit: false,
    hideDelete: true,
    productDescription: null
  },
  onLoad: function (option) {
    var productId = option.product_id;
    var that = this;

    if(productId) {
      this.setData({
        isEdit: true,
        productId: productId
      });

      app.http.get('/site/product/detail', {product_id: productId}, function(res) {
        var images = res.result.images;
        if(res.result_code === 10000) {
          that.setData({
            productImages: images,
            productCode: res.result.product_unique_code,
            productName: res.result.name,
            productPrice: res.result.price,
            isHot: res.result.hot_item === 1,
            categoryId: res.result.merchant_category_id,
            productDescription: res.result.description            
          })
        } else {
          wx.showToast({  
            title: '系统更新，请稍后重试',
            icon: 'fail',
            duration: 2000,
            mask:true
          })
        }
      })
    }

    app.http.get('/site/merchant/categories', {}, function(res){
      if(res.result_code === 10000) {
        that.setData({
          categories: res.result
        });

        that.data.categories.forEach(function(category, index) {
            if(that.data.categoryId !== null) {
                if(that.data.categoryId === category.id) {
                  that.setData({
                    categoryIndex: index
                  })
                }
            }
        });
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
      count: 6, // 默认9
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

        //do not delete, added for multiple photo upload
        tempFilePaths.forEach(function(path) {
          var image = {};
          image.unique_name = Date.now();
          image.url = path;
          image.is_new = true; //标记是新图
          that.data.productImages.push(image);
        });

        that.setData({
          productImages: that.data.productImages
        })
      }
    })
  },
  submit: function(e) {
    var that = this;
    var categoryIndex = that.data.categoryIndex;
    var category = that.data.categories[categoryIndex];
    var categoryId = category.id;
    var paths = [];
    this.data.productImages.forEach(function(image) {
      if(image.updated) {
        that.deleteList.push(image.unique_name);
        paths.push(image.url);
      } 
      if(image.is_new) {
        paths.push(image.url);
      } 
    });

    var form = {
        'file_name': FILE_NAME,
        'code': that.data.productCode,
        'price': that.data.productPrice,
        'name': that.data.productName,
        'merchant_category_id': categoryId,
        'hot': that.data.isHot ? 1 : 0,
        'delete_list': JSON.stringify(this.deleteList),
        'product_id': that.data.productId,
        'description': that.data.productDescription
    };
    if(this.data.isEdit) {
      var url = '/site/product/update';
    } else {
      var url = '/site/product/create';
    }

    if(paths.length === 0) {
      app.http.post(url, form, function(res) {
        if(res.result_code === 10000) {
          wx.navigateBack({delta: 2});
        }
      })
    } else {
      app.http.uploadFiles(url, form, paths, function(res) {
        if(res.result_code === 10000) {
          wx.navigateBack(1);
        } else {
          wx.showToast({
            title: '上传失败，请稍后再试',
            icon: 'none',
            duration: 3000,
            mask:true
          });
        }
      });
    }
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
  bindDescription: function(e) {
    this.setData({
      productDescription: e.detail.value
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
  },
  // replace: function(e) {
  //   var uniqueName = e.currentTarget.dataset.name;
  //   var that = this;
  //   wx.chooseImage({
  //     count: 1, // 默认9
  //     sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
  //     sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
  //     success: function (res) {
  //       // 替换旧图只会选择一张照片，所以去数组的第一个元素
  //       var tempFilePath = res.tempFilePaths[0] 
  //       //替换对应的图片并标识已更新
  //       that.data.productImages.map(function(image) {
  //         if(image.unique_name === uniqueName) {
  //           image.url = tempFilePath;
  //           image.updated = true; //标记是更新
  //         }
  //       })

  //       that.setData({
  //         productImages: that.data.productImages
  //       })
  //     }
  //   })
  // }, 
  delete: function() {
    var uniqueName = this.tempName;
    var newProductImages = [];
    var that = this;
    this.data.productImages.map(function(image) {
      if(image.unique_name === uniqueName) {
        if(!image.is_new) {
          that.deleteList.push(image.unique_name);
        }
      } else {
        newProductImages.push(image);
      }
    });

    this.setData({
      productImages: newProductImages,
      hideDelete: true
    })
  },
  hide: function(e) {
    this.tempName = null;

    this.setData({
      hideDelete: true
    })
  },
  askDelete: function(e) {
    var product = e.currentTarget.dataset.product;
    this.tempName = product.unique_name;
    
    this.setData({
      hideDelete: false
    })
  }
})

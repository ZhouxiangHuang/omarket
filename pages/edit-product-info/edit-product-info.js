//index.js
//获取应用实例
const app = getApp()
const FILE_NAME = 'file';

Page({
  deleteList: [],
  tempName : null,
  productId : null,
  data: {
    productImages: [],
    productCode: '',
    productName: '',
    productPrice: null,
    categories: {},
    categoryIndex: 0,
    categoryId: null,
    isHot: false,
    isEdit: false,
    hideDelete: true,
    productDescription: ''
  },
  onLoad: function (option) {
    var categoryId = option.category_id;
    var productId = option.product_id;
    var that = this;

    if(categoryId) {
      this.setData({
        categoryId: categoryId
      })
    }

    if(productId) { 
      this.setData({
        isEdit: true,
        productId: productId
      });

      app.http.promiseGet('/site/product/detail', {product_id: productId})
        .then(res => {
          var images = res.result.images;
          this.productId = res.result.id;
          this.setData({
            productImages: images,
            productCode: res.result.product_unique_code,
            productName: res.result.name,
            productPrice: res.result.price,
            isHot: res.result.hot_item === 1,
            categoryId: res.result.merchant_category_id,
            productDescription: res.result.description            
          }) 
        })
        .catch(error => {
          app.toast('系统更新，请稍后重试');
        })
    }

    app.http.promiseGet('/site/merchant/categories', {})
      .then(res => {
        this.setData({
          categories: res.result
        });

        this.data.categories.forEach((category, index) => {
            if(this.data.categoryId !== null) {
                if(this.data.categoryId == category.id) {
                  this.setData({
                    categoryIndex: index
                  })
                }
            }
        }); 
      })
      .catch(res => {
        app.toast('请求失败');
      })
  },
  chooseImage: function(e) {
    wx.chooseImage({
      count: 6, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: res => {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths
        var limit = 6;
        if(this.data.productImages.length === limit) {
          app.toast('限定上传'+limit+'张照片');
          return false;
        }

        //do not delete, added for multiple photo upload
        tempFilePaths.forEach(path => {
          var image = {};
          image.unique_name = Date.now() + Math.floor(Math.random() * 100);
          image.url = path;
          image.is_new = true; //标记是新图
          this.data.productImages.push(image);
        });

        this.setData({
          productImages: this.data.productImages
        })
      }
    })
  },
  submit: function(e) {
    var categoryIndex = this.data.categoryIndex;
    var category = this.data.categories[categoryIndex];
    var categoryId = category.id;
    var paths = [];
    this.data.productImages.forEach(image => {
      if(image.updated) {
        this.deleteList.push(image.unique_name);
        paths.push(image.url);
      } 
      if(image.is_new) {
        paths.push(image.url);
      } 
    });

    var form = {
        'code': this.data.productCode,
        'price': this.data.productPrice,
        'name': this.data.productName,
        'merchant_category_id': categoryId,
        'hot': this.data.isHot ? 1 : 0,
        'delete_list': JSON.stringify(this.deleteList),
        'product_id': this.productId,
        'description': this.data.productDescription,
    };

    if(paths.length === 0) { //no image to upload
      if(this.data.isEdit) {
        var url = '/site/product/update';
      } else {
        var url = '/site/product/create';
      }

      app.http.post(url, form, function(res) {
        if(res.result_code === 10000) {
          wx.navigateBack(1);
        } else {
          app.toast('上传失败，请稍后再试');
        }
      })
      //upload with images
    } else {  
      form.file_name = FILE_NAME;
      if(!this.data.isEdit) {
        console.log('start');
        app.http.promisePost('/site/product/create', form)
          .then(res => {
            form.product_id = res.result.product_id;
            return app.http.promiseUploadFiles('/site/product/update', form, paths);
          })
          .then(res => {
            wx.navigateBack(1);
          })
          .catch(error => {
            console.error(error);
            app.toast('上传失败，请稍后再试');
          })
      } else {
        app.http.promiseUploadFiles('/site/product/update', form, paths)
          .then(res => {
            wx.navigateBack(1);
          })
          .catch(error => {
            console.error(error);
            app.toast('上传失败，请稍后再试');
          })
      }
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

//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    announcement: '哈',
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('ton.open-type.getUserInfo'),
    startTime: '06:00',
    endTime: '18:00',
    hiddenModal: true,
    form: {tags: []},
    tag1: '',
    tag2: '',
    tag3: '',    
    countryCode: 0,
    cityCode: 0,
  },
  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function (option) {
    var merchantId = option.merchant_id;
    var that = this;
    app.http.get('/site/merchant/detail', {merchant_id: merchantId}, function(res) {
      that.data.countryCode = res.result.country_code;
      that.data.cityCode = res.result.city_code;
      that.data.form.tags = res.result.tags;
      that.data.form.announcement = res.result.announcement;      
      that.setData({
        merchant: res.result, 
        tag1: res.result.tag_names[0], 
        tag2: res.result.tag_names[1],
        tag3: res.result.tag_names[2],
        form: that.data.form
      });
      
      // this.setData({
      //   merchant: {image_url: '/images/missgrace.jpeg', 
      //               store_name: 'MISS GRACE', 
      //               region: '匈牙利/布达佩斯',
      //               address: 'Baross Gabor utca 73', 
      //               tags:['牛仔裤','运动服','休闲'],
      //               description: '买卖的都是质量最好的牛仔裤',
      //               mobile: '0036305591038',
      //             },
      // });  
    })
  },
  onShow: function(option) {
    var record = app.globalData.tagRecord;
    var region = app.globalData.region;

    if(record) {
      this.data.form.tags.push(record.id);
      if(record.tag === '1') {
        this.setData({
          tag1: record.name
        })
      } else if(record.tag === '2') {
        this.setData({
          tag2: record.name
        })
      } else {
        this.setData({
          tag3: record.name
        })
      }
    }

    if(region) {
      var merchant = this.data.merchant;
      this.data.countryCode = region.country_code;
      this.data.cityCode = region.city_code;     
      merchant.region = region.country + "/" + region.name;
      this.setData({
        merchant: merchant
      })
    }
  },
   /**
   * 监听时间picker选择器
   */
  listenerStartTimePickerSelected: function(e) {
    this.setData({
        startTime: e.detail.value
    });
  },

  listenerEndTimePickerSelected: function(e) {
    this.setData({
        endTime: e.detail.value
    });
  },
  announce: function(e) {
    this.setData({
      hiddenModal: false
    })
  },
  listenerConfirm: function(e) {
    this.setData({
      hiddenModal: true,
      form: this.data.form
    })
  },
  listenerCancel: function() {
    this.setData({
      hiddenModal: true,
      announcement: ''
    })
  },
  announceContent: function(e) {
    var inputVal = e.detail.value;
    this.data.form.announcement = inputVal;
  },
  selectTag: function(e) {
    var tag = e.currentTarget.dataset.tag;
    wx.navigateTo({
      url: '../list/list?tag=' + tag
    })
  },
  updateMerchant: function(e) {
      var form = {
        store_name: this.data.merchant.store_name,
        start: this.data.startTime,
        end: this.data.endTime,
        tags: this.data.form.tags,
        mobile: this.data.merchant.mobile,
        announcement: this.data.form.announcement,  
        address: this.data.merchant.address,    
        city_code: this.data.cityCode,
        country_code: this.data.countryCode,
      }

      // app.http.post('/site/merchant/update', form, function(res) {
      //   if(res.result_code === 10000) {
      //     wx.navigateBack(1);
      //   }
      // });
      var url = this.data.merchant.image_url;
      if(url) {
        wx.getStorage({
          key: 'token', 
          success: function(res){
            var accessToken = res.data;
            wx.uploadFile({
              url: app.http.domain + '/site/merchant/upload-profile',
              filePath: url,
              name: 'file',
              header: {'access-token': accessToken},  
              formData: {},
            })          
          },
          fail: function(res){
            console.log(res);
          }
        });
      }
  },
  selectRegion: function(e) {
    wx.navigateTo({
      url: '../list/list?mode=regions'
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
        var tempFilePaths = res.tempFilePaths;
        that.data.merchant.image_url = tempFilePaths[0];

        that.setData({
          merchant: that.data.merchant
        })
      }
    })
  },
})

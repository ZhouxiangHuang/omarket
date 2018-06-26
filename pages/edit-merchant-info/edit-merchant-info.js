//index.js
//获取应用实例
const app = getApp()

Page({
  tempAnnouncementContent: null,
  pictureTaken: false,
  data: {
    user: {},
    hasUserInfo: false,
    startTime: '06:00',
    endTime: '18:00',
    hiddenModal: true,
    form: {},
    tag1: null,
    tag2: null,
    tag3: null,    
    countryCode: 0,
    cityCode: 0,
    announcement: null
  },
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
      that.data.announcement = res.result.announcement;      
      that.setData({
        merchant: res.result, 
        tag1: res.result.tags[0] || null,
        tag2: res.result.tags[1] || null,
        tag3: res.result.tags[2] || null,
        announcement: res.result.announcement
      });
    })
  },
  onShow: function(option) {
    var record = app.globalData.tagRecord;
    var region = app.globalData.region;

    console.log(record);

    if(record) {
      if(!this.data.tag1) {
        this.setData({
          tag1: record
        })
      } else if(!this.data.tag2) {
        this.setData({
          tag2: record
        })
      } else if(!this.data.tag3) {
        this.setData({
          tag3: record
        })
      }
      
      if(this.data.tag1 && this.data.tag1.tag_id == record.prev_tag) {
        this.setData({
          tag1: record
        })
      } else if(this.data.tag2 && this.data.tag2.tag_id == record.prev_tag) {
        this.setData({
          tag2: record
        })
      } else if(this.data.tag3 && this.data.tag3.tag_id == record.prev_tag){
        this.setData({
          tag3: record
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
      announcement: this.tempAnnouncementContent
    })
  },
  listenerCancel: function() {
    this.tempAnnouncementContent = null;
    this.setData({
      hiddenModal: true,
    })
  },
  announceContent: function(e) {
    var inputVal = e.detail.value;
    this.tempAnnouncementContent = inputVal;
  },
  storeNameListener: function(e) {
    var inputVal = e.detail.value;
    this.data.merchant.store_name = inputVal;
    this.setData({
      merchant: this.data.merchant
    });
  },
  addressListener: function(e) {
    var inputVal = e.detail.value;
    this.data.merchant.address = inputVal;
    this.setData({
      merchant: this.data.merchant
    });
  },
  mobileListener: function(e) {
    var inputVal = e.detail.value;
    this.data.merchant.mobile = inputVal;
    this.setData({
      merchant: this.data.merchant
    });
  },
  selectTag: function(e) {
    var tagId = e.currentTarget.dataset.tag;
    var tags = [];
    if(this.data.tag1 != null) {
      tags.push(this.data.tag1.tag_id);
    } 
    if(this.data.tag2 != null) {
      tags.push(this.data.tag2.tag_id);
    } 
    if(this.data.tag3 != null) {
      tags.push(this.data.tag3.tag_id);
    } 
    var otherTags = [];
    tags.forEach(function(id) {
      if(tagId != id) {
        otherTags.push(id);
      }
    })

    wx.navigateTo({
      url: '../list/list?tag=' + tagId + '&tag2=' + otherTags[0] + '&tag3=' + otherTags[1] 
    })
  },
  updateMerchant: function(e) {
      var form = {
        store_name: this.data.merchant.store_name,
        start: this.data.startTime,
        end: this.data.endTime,
        tags: [this.data.tag1.tag_id, this.data.tag2.tag_id, this.data.tag3.tag_id],
        mobile: this.data.merchant.mobile,
        announcement: this.data.announcement,  
        address: this.data.merchant.address,    
        city_code: this.data.cityCode,
        country_code: this.data.countryCode,
      }

      if(!this.isValid(form)) {
        return false;
      };

      app.http.post('/site/merchant/update', form, function(res) {
        if(res.result_code === 10000) {
          wx.navigateBack(1);
        }
      });
      var url = this.data.merchant.image_url;
      if(this.pictureTaken) {
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
    this.pictureTaken = true;
    var that = this;
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
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
  isValid: function(form) {
      if(form.store_name === "") {
        app.toast('店面不能为空');
        return false;
      }
      if(form.city_code === "") {
        app.toast('请选择地区');
        return false;
      }
      if(form.store_name.length > 20) {
        app.toast('店名过长');
        return false;
      }
      if(form.announcement.length > 25) {
        app.toast('公告过长，请控制在25个字以内');
        return false;
      }

      return true;
  }
})

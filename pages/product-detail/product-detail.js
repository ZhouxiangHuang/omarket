//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('ton.open-type.getUserInfo'),
    productImages: ['/images/jeans.jpg'],
    number: 0,
    productInfo: {}
  },
  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function (options) {
    var productId = options.product_id;
    var data = {
      product_id: productId
    }
    var that = this;
    app.http.get('/site/product/detail',data, function(res){
        that.setData({
          productInfo: res.result    
        })
    })
  },
  getSelectItem: function(e) {
      var that = this;
      var itemWidth = e.detail.scrollWidth / that.data.productImages.length;//每个商品的宽度
      var scrollLeft = e.detail.scrollLeft * 2;//滚动宽度
      console.log(itemWidth, scrollLeft);
      var curIndex = Math.round(scrollLeft / itemWidth);//通过Math.round方法对滚动大于一半的位置进行进位
      
      // console.log(curIndex);
      // if(curIndex === 1) {
      //   console.log('test');
      //   that.setData({
      //     number:  scrollLeft
      //   })
      // }
  },
  collect: function(e) {
    var productId = this.data.productInfo.id;
    app.http.post('/site/product/collect', {product_id: productId}, function(res) {
      console.log(res);
    })
  },
  checkCollections: function(e) {
    wx.navigateTo({
      url: '../collections/collections'
    })
  }
})

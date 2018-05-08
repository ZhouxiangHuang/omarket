//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('ton.open-type.getUserInfo')
  },
  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    this.setData({
      products: {热销: [{name: '牛仔裤', price: 199,}, {name: '喇叭裤', price: 222}],
                裤子: [{name: '运动裤', price: 123}, {name: '迷彩裤', price: 666}]},
    });

    var categoryList = [];
    Object.keys(this.data.products).forEach(element => {
      if(element === '热销') {
        categoryList.push({name: element, color: 'white'});
      } else {
        categoryList.push({name: element, color: '#F8F8F8'});
      }
    });

    this.setData({
      merchant: {imageUrl: '/images/missgrace.jpeg', 
                  name: 'MISS GRACE', 
                  address: 'Baross Gabor utca 73, 16区', 
                  tags:['牛仔裤','运动服','休闲'],
                  description: '买卖的都是质量最好的牛仔裤',                   
                },
      categories: categoryList,
      productList: this.data.products['热销'],
    });
  },
  selectCategory: function (event) {
    var category = event.currentTarget.dataset.no.name;

    //change color
    this.data.categories.map(element => {
        if(element.name === category) {
          element.color = 'white';
        } else {
          element.color = '#F8F8F8';
        }
    });

    this.setData({
      productList: this.data.products[category],
      categories: this.data.categories
    });
  }
})

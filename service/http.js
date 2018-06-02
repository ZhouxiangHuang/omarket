
// var rootDocment = 'http://eu.localhost.com/index.php';//你的域名
var rootDocment = 'http://47.98.237.13/index.php';//你的域名

function post(url,data,cb){    
    getToken(doPost,url,data,cb);
}

function doPost(accessToken,url,data,cb) {
  wx.showLoading({title: '加载中',mask: true});
  wx.request({  
    url: rootDocment + url,  
    data: data,  
    method: 'POST',  
    header: {'Content-Type': 'application/json', 'access-token': accessToken},  
    success: function(res){  
      wx.hideLoading();
      return typeof cb == "function" && cb(res.data)  
    },  
    fail: function(){  
      wx.hideLoading();
      return typeof cb == "function" && cb(false)  
    }  
  }) 
}

function get(url,data,cb){
    getToken(doGet,url,data,cb);
}

function doGet(accessToken,url,data,cb) {
  wx.showLoading({title: '加载中',mask: true});
  var params = [];
  var keys = Object.keys(data);
  keys.forEach(function(key) {
    var param = key + '=' + data[key];
    params.push(param);
  })
  params = params.join(',');

  wx.request({
    url: rootDocment + url + '?' + params,
    method: 'get',  
    header: {'Content-Type': 'application/json', 'access-token': accessToken},  
    success: function(res){  
      wx.hideLoading();
      return typeof cb == "function" && cb(res.data)  
    },  
    fail: function(){  
      wx.hideLoading();
      return typeof cb == "function" && cb(false)  
    }  
  })  
}

function uploadFiles(url, data, paths, cb) {
  data['paths'] = paths;
  getToken(doUploadFiles,url,data,cb);
}

function doUploadFiles(accessToken, url, data, cb, index) {
  wx.showLoading({title: '上传中',mask: true});
  if(!index) {
    index = 0;
  }

  var paths = data['paths'];
  var path = paths[index];
  var fileName = data['file_name'];

  //recursion to solve async image upload
  if(index == paths.length) {
    var res = {result_code: 10000};
    wx.hideLoading();
    return typeof cb == "function" && cb(res)  
  } else {
    wx.uploadFile({
      url: rootDocment + '/site/product/create',
      header: {'access-token': accessToken},  
      filePath: path,
      name: fileName,
      formData: data,
      success: function(res) {
        var res = JSON.parse(res.data);
        if(res['result_code'] === 10000) {
          return doUploadFiles(accessToken, url, data, cb, index + 1);
        } else {
          wx.hideLoading();
          return {result_code: 15000};
        }
      }
    })  
  }
}

function getToken(request,url,data,cb) {
  wx.getStorage({
    key: 'token', 
    success: function(res){
      var accessToken = res.data;
      return request(accessToken,url,data,cb);
    },
    fail: function(res){
      console.log('fail test');
      return request(null,url,data,cb);
    }
  });
}

module.exports = {  
  post: post,
  get: get,
  domain: rootDocment,
  uploadFiles: uploadFiles
}
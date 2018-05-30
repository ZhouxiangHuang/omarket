
var rootDocment = 'http://eu.localhost.com/index.php';//你的域名
// var rootDocment = 'http://47.98.237.13/index.php';//你的域名


function post(url,data,cb){    
    getToken(doPost,url,data,cb);
}

function doPost(accessToken,url,data,cb) {
  wx.request({  
    url: rootDocment + url,  
    data: data,  
    method: 'POST',  
    header: {'Content-Type': 'application/json', 'access-token': accessToken},  
    success: function(res){  
      return typeof cb == "function" && cb(res.data)  
    },  
    fail: function(){  
      return typeof cb == "function" && cb(false)  
    }  
  }) 
}

function get(url,data,cb){
    getToken(doGet,url,data,cb);
}

function doGet(accessToken,url,data,cb) {
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
      return typeof cb == "function" && cb(res.data)  
    },  
    fail: function(){  
      return typeof cb == "function" && cb(false)  
    }  
  })  
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
  domain: rootDocment 
}
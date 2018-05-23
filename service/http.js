
var rootDocment = 'http://eu.localhost.com/index.php';//你的域名

function post(url,data,cb){
    var accessToken = wx.getStorage({key: 'token'});
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
    var accessToken = wx.getStorage({key: 'token'});
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

module.exports = {  
  post: post,
  get: get,
  domain: rootDocment 
}
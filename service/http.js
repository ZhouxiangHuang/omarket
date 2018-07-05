'use strict'

// var rootDocment = 'http://eu.localhost.com/index.php';// develpment
var rootDocment = 'http://47.98.237.13/index.php';// testing
// var rootDocment = 'https://www.omart.online/index.php'; //production

var wxApi = require('wxApi.js');

function post(url,data,cb){
    wxApi.getAccessToken().then( accessToken => {
      doPost(accessToken, url, data, cb);
    }).catch(error => {
      doPost('', url, data, cb);
    })
}

function promisePost(url,data){
  wx.showLoading({title: '加载中', mask: true});
  let promise = new Promise((resolve, reject) => {
      wxApi.getAccessToken()
      .then(accessToken => {
        return httpPost(accessToken, url, data);
      })
      .catch(error => {
        return httpPost('', url, data);
      })
      .then(res => {
        resolve(res);
      })
      .catch(error => {
        reject(error);
      })
      .finally(() => {
        wx.hideLoading();
      })
  })

  return promise;
}

function httpPost(accessToken, url, data) {
  let promise = new Promise((resolve, reject) => {
    wx.request({
      url: rootDocment + url,
      data: data,
      method: 'POST',
      header: {'Content-Type': 'application/json', 'access-token': accessToken},
      success: function(res){
        if(res.data.result_code === 10000) {
          resolve(res.data)
        } else {
          reject('服务器正在维护，请稍后再试');
        }
      },
      fail: function(){
        cb(false)
      }
    })
  })

  return promise;
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
  wx.showLoading({title: '加载中',mask: true});
  wxApi.getAccessToken()
  .then(accessToken => {
    return httpGet(accessToken, url, data);
  })
  .then(res => {
    cb(res);
  })
  .finally(() => {
    wx.hideLoading();
  })
}

function promiseGet(url,data){
  wx.showLoading({title: '加载中',mask: true});
  let promise = new Promise((resolve, reject) => {
      wxApi.getAccessToken()
      .then(accessToken => {
        return httpGet(accessToken, url, data);
      })
      .then(res => {
        resolve(res);
      })
      .catch(error => {
        reject(error);
      })
      .finally(() => {
        wx.hideLoading();
      })
  })

  return promise;
} 

const httpGet = (accessToken,url,data) => {
    let promise = new Promise((resolve, reject) => {
      var params = [];
      var keys = Object.keys(data);
      keys.forEach(function(key) {
        var param = key + '=' + data[key];
        params.push(param);
      })
      params = params.join('&');
      wx.request({
        url: rootDocment + url + '?' + params,
        method: 'get',
        header: {'Content-Type': 'application/json', 'access-token': accessToken},  
        success: function(res){
          if(res.data.result_code === 10000) {
            resolve(res.data);
          } else {
            reject('服务器正在维护，请稍后再试');
          }
        },
        fail: function(){
          reject(false);
        }
      })
    })

    return promise;
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
  if(!path) {
    path = '';
  }
  var fileName = data['file_name'];
  //recursion to solve async image upload
  if(index == paths.length && paths.length > 0) {
    var res = {result_code: 10000};
    wx.hideLoading();
    return typeof cb == "function" && cb(res)  
  } else {
    wx.uploadFile({
      url: rootDocment + url,
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
          var res = {result_code: 15000};
          return typeof cb == "function" && cb(res)  
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
  uploadFiles: uploadFiles,
  promiseGet: promiseGet,
  promisePost: promisePost
}
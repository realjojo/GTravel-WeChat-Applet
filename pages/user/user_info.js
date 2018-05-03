// pages/user/user_info.js
var app = getApp();
var service = app.globalData.service;
var phone = ""
var phone1 = ""
var phone2 = ""
var name = ""

Page({

  data: {
    info: [],
    avator: ""
  },

  setAvator: function () {
    var that = this;
    wx.chooseImage({
      count: 1,
      success: function (res) {
        var tempFilePaths = res.tempFilePaths[0];
        wx.uploadFile({
          url: service + '/users/upload_photo',
          filePath: tempFilePaths,
          name: 'file',
          header: {
            'content-type': 'multipart/form-data'
          },
          formData: {
            'user_id': app.globalData.userInfo.uid
          },
          success: function (res) {
            if (res.statusCode == 200) {
              var jsObject = JSON.parse(res.data);
              var data = service + '/users/' + jsObject.avator_url + '?type=0';
              wx.request({
                url: service + '/users/update_user_info',
                method: 'POST',
                data: {
                  user_id: app.globalData.userInfo.uid,
                  user_name: app.globalData.userInfo.name,
                  photo_url: jsObject.avator_url
                },
                header: {
                  'content-type': 'application/x-www-form-urlencoded'
                },
                success: function (res) {
                  console.log(res)
                  if (res.statusCode == 200) {
                    app.globalData.userInfo.avator = data;
                    app.globalData.userInfo.avator_url = jsObject.avator_url;
                    that.setData({
                      avator: data
                    })
                  }
                }
              })
            }
          }
        })
      }
    })
  },

  switchItem: function (e) {
    switch (e.currentTarget.id) {
      case "0":
        wx.navigateTo({
          url: 'change_info?type=0&content=' + name,
        })
        break;
      case "1":
        wx.navigateTo({
          url: 'change_info?type=1&content=' + phone,
        })
        break;
      case "2":
        wx.navigateTo({
          url: 'change_info?type=2',
        })
        break;
    }
  },

  logout: function () {
    app.globalData.userInfo.uid = "";
    app.globalData.userInfo.token = "";
    app.globalData.userInfo.avator = "/resources/default_user_img.png";
    app.globalData.userInfo.name = "";
    app.globalData.userInfo.phone = "";
    app.globalData.userInfo.isLogin = "false";
    wx.navigateBack({
      delta: 1
    })
  },

  onShow: function () {
    phone = app.globalData.userInfo.phone
    name = app.globalData.userInfo.name
    phone1 = phone.substring(0, 3)
    phone2 = phone.substring(7, 11)
    this.setData({
      info: [{
        id: 0,
        title: "用户名",
        content: name
      }, {
        id: 1,
        title: "绑定手机号",
        content: phone1 + "****" + phone2
      }, {
        id: 2,
        title: "更改密码",
        content: ""
      }],
      avator: app.globalData.userInfo.avator
    })
  }
})
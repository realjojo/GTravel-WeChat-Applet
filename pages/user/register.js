// pages/user/register.js
var app = getApp();
var service = app.globalData.service;
var phone = "";
var password = "";
var verification_code = "";

Page({

  data: {
    isRight: true,
    sendVcode: "false",
    second: 60
  },

  input: function (e) {
    switch (e.currentTarget.id) {
      case "p":
        phone = e.detail.value;
        break;
      case "vcode":
        verification_code = e.detail.value;
        break;
      case "pw":
        password = e.detail.value;
        break;
    }
  },

  p_check: function (e) {
    phone = e.detail.value
    if (phone.length == 11 || phone.length == 0) {
      this.setData({
        isRight: true
      })
    } else {
      this.setData({
        isRight: false
      })
    }
  },

  getVcode: function () {
    var that = this;
    if (that.data.isRight == true && phone != "") {
      wx.request({
        url: service + '/users/send_verification_code',
        method: 'POST',
        data: {
          type: 0,
          phone: phone
        },
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        success: function (res) {
          console.log(res)
          if (res.statusCode == 200) {
            that.setData({
              sendVcode: "true"
            })
            countdown(that);
          }
        }
      })
    }
  },

  register: function () {
    console.log(password)
    if (password.length < 6) {
      wx.showToast({
        title: '密码不得少于六位',
        image: '/resources/fail.png'
      })
    } else if (verification_code == "") {
      wx.showToast({
        title: '请输入验证码',
        image: '/resources/fail.png'
      })
    } else {
      wx.showLoading({
        title: '请等待',
      })
      wx.request({
        url: service + '/users/user_register',
        method: 'POST',
        data: {
          phone: phone,
          psw: password,
          verification_code: verification_code
        },
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        success: function (res) {
          console.log(res)
          if (res.statusCode == 200) {
            var uid = res.data.user_id;
            var token = res.data.token;
            var uname = res.data.username;
            var avator = res.data.avator_url;
            app.globalData.userInfo.isLogin = "true";
            app.globalData.userInfo.phone = phone;
            app.globalData.userInfo.name = uname;
            app.globalData.userInfo.avator = "/resources/default_user_img.png";
            app.globalData.userInfo.avator_url = avator;
            app.globalData.userInfo.uid = uid;
            app.globalData.userInfo.token = token;
            app.globalData.userInfo.default_phone = phone;
            wx.hideLoading();
            wx.navigateBack({
              delta: 1
            })
          }
        }
      })
    }
  }
})

function countdown(that) {
  var second = that.data.second;
  if (second == 0) {
    that.setData({
      sendVcode: "false",
      second: 60,
    });
    return;
  }
  var time = setTimeout(function () {
    that.setData({
      second: second - 1
    });
    countdown(that);
  }
    , 1000)
}
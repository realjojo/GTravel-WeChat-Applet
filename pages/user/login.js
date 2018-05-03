// pages/user/login.js
var app = getApp();
var service = app.globalData.service
var phone = "";
var password = "";
var uid = "";
var token = "";
var uname = "";
var avator = "";
var service = app.globalData.service;

Page({

  data: {
    isRight: true,
    froms: "login",
    default_phone: "",
    focus_p: true,
    focus_pw: false
  },

  p_input: function (e) {
    phone = e.detail.value
  },

  p_confirm: function (e) {
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

  pw_input: function (e) {
    password = e.detail.value;
  },

  pw_confirm: function (e) {
    password = e.detail.value;
  },

  p_check: function (e) {
    phone = e.detail.value
    if (phone.length == 11 || phone == "") {
      this.setData({
        isRight: true
      })
    } else {
      this.setData({
        isRight: false
      })
    }
  },

  login: function (e) {
    wx.showLoading({
      title: '',
    })
    wx.request({
      url: service + '/users/user_login',
      method: 'POST',
      data: {
        type: 0,
        phone: phone,
        psw: password
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        console.log(res.data)
        if (res.statusCode == 200) {
          uid = res.data.user_id;
          token = res.data.token;
          uname = res.data.username;
          avator = res.data.avator_url;
          app.globalData.userInfo.isLogin = "true";
          app.globalData.userInfo.phone = phone;
          app.globalData.userInfo.name = uname;
          if (avator != null) {
            app.globalData.userInfo.avator = service + "/users/" + avator + "?type=0";
          }
          app.globalData.userInfo.avator_url = avator;
          app.globalData.userInfo.uid = uid;
          app.globalData.userInfo.token = token;
          app.globalData.userInfo.default_phone = phone;
          wx.hideLoading();
          wx.navigateBack({
            delta: 1
          })
        } else {
          wx.showToast({
            title: '密码不正确',
            image: '/resources/fail.png'
          })
        }
      }
    })
  },

  onLoad: function (options) {
    if (app.globalData.userInfo.default_phone != "") {
      this.setData({
        default_phone: app.globalData.userInfo.default_phone,
        focus_p: false,
        focus_pw: true
      })
    }
  }
})
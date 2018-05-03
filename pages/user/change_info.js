// pages/user/change_info.js
var app = getApp()
var service = app.globalData.service;
var name, phone, v_code, old_pw, new_pw;

Page({
  data: {
    c_type: "",
    content: "",
    isRight: true,
    sendVcode: "false",
    second: 60
  },

  input: function (e) {
    switch (e.currentTarget.id) {
      case "name":
        name = e.detail.value;
        break;
      case "v_code":
        v_code = e.detail.value;
        break;
      case "old_pw":
        old_pw = e.detail.value;
        break;
      case "new_pw":
        new_pw = e.detail.value;
        break;
    }
  },

  p_input: function (e) {
    phone = e.detail.value;
  },

  p_check: function (e) {
    phone = e.detail.value;
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
          type: 2,
          phone: phone,
          user_id: app.globalData.userInfo.uid
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

  onLoad: function (options) {
    console.log(options)
    this.setData({
      c_type: options.type,
      content: options.content
    })
  },

  confirm: function () {
    var that = this;
    switch (that.data.c_type) {
      case "0":
        wx.request({
          url: service + '/users/update_user_info',
          method: 'POST',
          data: {
            user_id: app.globalData.userInfo.uid,
            user_name: name,
            photo_url: app.globalData.userInfo.avator_url
          },
          header: {
            'content-type': 'application/x-www-form-urlencoded'
          },
          success: function (res) {
            console.log(res)
            if (res.statusCode == 200) {
              app.globalData.userInfo.name = name;
              wx.showToast({
                title: '修改成功',
                icon: '/resources/success.png',
                complete: function () {
                  wx.navigateBack({
                    delta: 1
                  })
                }
              })
            } else {
              wx.showToast({
                title: '修改失败',
                image: '/resources/fail.png'
              })
            }
          }
        })
        break;
      case "1":
        if (that.data.isRight == true) {
          wx.request({
            url: service + '/users/update_phone',
            method: 'POST',
            data: {
              user_id: app.globalData.userInfo.uid,
              new_phone: phone,
              verification_code: v_code
            },
            header: {
              'content-type': 'application/x-www-form-urlencoded'
            },
            success: function (res) {
              console.log(res)
              if (res.statusCode == 200) {
                app.globalData.userInfo.phone = phone;
                wx.showToast({
                  title: '修改成功',
                  icon: '/resources/success.png',
                  duration: 3000,
                  complete: function () {
                    wx.navigateBack({
                      delta: 1
                    })
                  }
                })
              } else {
                wx.showToast({
                  title: '修改失败',
                  image: '/resources/fail.png'
                })
              }
            }
          })
        }
        break;
      case "2":
        wx.request({
          url: service + '/users/update_psw',
          method: 'POST',
          data: {
            user_id: app.globalData.userInfo.uid,
            old_psw: old_pw,
            new_psw: new_pw
          },
          header: {
            'content-type': 'application/x-www-form-urlencoded'
          },
          success: function (res) {
            console.log(res)
            if (res.statusCode == 200) {
              wx.showToast({
                title: '修改成功',
                icon: '/resources/success.png',
                duration: 3000,
                complete: function () {
                  wx.navigateBack({
                    delta: 1
                  })
                }
              })
            } else {
              wx.showToast({
                title: '修改失败',
                image: '/resources/fail.png'
              })
            }
          }
        })
        break;
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
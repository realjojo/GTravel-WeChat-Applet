// pages/user/edit_addr.js
var app = getApp()
var service = app.globalData.service;
var id = "";
var is_default = false;
var name = "";
var phone = "";
var type0 = "", from0 = "";

Page({

  data: {
    isRight: true,
    name: "",
    phone: "",
    froms: "edit_addr",
    isChecked: false
  },

  cancel: function () {
    wx.navigateBack({
      delta: 1,
    })
  },

  confirm: function () {
    var that = this;
    var def = 0;
    if (that.data.isChecked == true) {
      def = 1;
    }
    if (type0 == "edit") {
      if (that.data.isRight == true) {
        wx.request({
          url: service + '/users/update_mailing_info',
          method: 'POST',
          data: {
            id: id,
            user_id: app.globalData.userInfo.uid,
            is_default: def,
            mailing_name: name,
            mailing_phone: phone
          },
          header: {
            'content-type': 'application/x-www-form-urlencoded'
          },
          success: function (res) {
            console.log(res)
            if (res.statusCode == 200) {
              wx.navigateBack({
                delta: 1,
              })
            }
          }
        })
      }
    } else if (type0 == "add") {
      wx.request({
        url: service + '/users/add_mailing_info',
        method: 'POST',
        data: {
          user_id: app.globalData.userInfo.uid,
          is_default: def,
          mailing_name: name,
          mailing_phone: phone
        },
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        success: function (res) {
          console.log(res)
          if (res.statusCode == 200) {
            if (from0 == "order") {
              var pages = getCurrentPages()
              var lastpage = pages[pages.length - 2];
              lastpage.setData({
                hasAddr: true,
                p_name: name,
                p_phone: phone,
              })
              wx.navigateBack({
                delta: 1
              })
            } else if (from0 == "addr") {
              wx.navigateBack({
                delta: 1
              })
            }
          }
        }
      })
    }
  },

  name_input: function (e) {
    name = e.detail.value
  },

  name_confirm: function (e) {
    name = e.detail.value
  },

  phone_input: function (e) {
    phone = e.detail.value
  },

  phone_confirm: function (e) {
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

  phone_check: function (e) {
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

  switchChange: function (e) {
    if (e.detail.value == true) {
      this.setData({
        isChecked: true
      })
    } else {
      this.setData({
        isChecked: false
      })
    }
  },

  delete_addr: function () {
    wx.showModal({
      title: '删除地址',
      content: '确定删除该收货地址吗？',
      success: function (res) {
        if (res.confirm) {
          wx.request({
            url: service + '/users/del_mailing_info?id=' + id + '&user_id=' + app.globalData.userInfo.uid,
            method: 'DELETE',
            header: {
              'content-type': 'application/x-www-form-urlencoded'
            },
            success: function (res) {
              console.log(res)
              if (res.statusCode == 200) {
                wx.navigateBack({
                  delta: 1
                })
              }
            }
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },

  onLoad: function (options) {
    type0 = options.type;
    from0 = options.from;
    if (type0 == "edit") {
      this.setData({
        type1: false
      })
      id = parseInt(options.id);
      name = options.name;
      phone = options.phone;
      this.setData({
        name: name,
        phone: phone
      })
      if (options.is_default == 1) {
        this.setData({
          isChecked: true
        })
      }
    } else if (type0 == "add") {
      this.setData({
        type1: true,
        name: "",
        phone: ""
      })
    }
  }
})
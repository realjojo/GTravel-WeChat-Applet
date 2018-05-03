// pages/user/address.js
var app = getApp()
var service = app.globalData.service;
var mailing_infos = new Array();
var count = 0;
var cur_choose = "";

Page({

  data: {
    addr: []
  },

  edit_addr: function (e) {
    var id = e.currentTarget.id;
    wx.navigateTo({
      url: 'edit_addr?type=edit&num=' + id + '&id=' + mailing_infos[id].id + '&name=' + mailing_infos[id].mailing_name + '&phone=' + mailing_infos[id].mailing_phone + '&is_default=' + mailing_infos[id].is_default,
    })
  },

  add_addr: function () {
    if (count > 9) {
      wx.showModal({
        title: '提示',
        content: '您已达到添加上限',
        showCancel: false,
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击确定')
          }
        }
      })
    } else {
      wx.navigateTo({
        url: 'edit_addr?type=add&from=addr',
      })
    }
  },

  choose: function (e) {
    if (mailing_infos[e.currentTarget.id].show == true) {
      mailing_infos[cur_choose].choose = false;
      mailing_infos[e.currentTarget.id].choose = true;
      cur_choose = e.currentTarget.id;
      this.setData({
        addr: mailing_infos
      })
      wx.navigateBack({
        delta: 1
      })
    }
  },

  onShow: function () {
    var that = this;
    var pages = getCurrentPages()
    var lastpage = pages[pages.length - 2];
    if (app.globalData.userInfo.isLogin == "true") {
      wx.request({
        url: service + '/users/get_mailing_infos',
        method: 'POST',
        data: {
          user_id: app.globalData.userInfo.uid
        },
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        success: function (res) {
          console.log(res)
          mailing_infos = res.data.mailing_infos;
          count = mailing_infos.length;
          for (var x in mailing_infos) {
            if (lastpage.data.froms == "order") {
              mailing_infos[x].show = true;
              if (mailing_infos[x].is_default == 1) {
                mailing_infos[x].choose = true;
                cur_choose = x;
              } else {
                mailing_infos[x].choose = false;
              }
            } else {
              mailing_infos[x].show = false;
              mailing_infos[x].choose = false;
            }
          }
          that.setData({
            addr: mailing_infos
          })
        }
      })
    }
  },

  onLoad: function (options) {
    if (app.globalData.userInfo.isLogin == "false") {
      wx.showModal({
        title: '提示',
        content: '您还未登录账号，是否前往登录？',
        success: function (res) {
          if (res.confirm) {
            wx.navigateTo({
              url: 'login',
            })
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    }
  }
})
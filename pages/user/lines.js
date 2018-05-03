// pages/user/lines.js
var app = getApp()
var service = app.globalData.service;
var lines = new Array();

Page({
  data: {
    list: [{
      id: 'lines',
      name: '地铁线路 / 时刻表',
      open: false,
      lines: []
    }]
  },
  kindToggle: function (e) {
    var id = e.currentTarget.id, list = this.data.list;
    for (var i = 0, len = list.length; i < len; ++i) {
      if (list[i].id == id) {
        list[i].open = !list[i].open
      } else {
        list[i].open = false
      }
    }
    this.setData({
      list: list
    });
  },
  navigate: function (e) {
    wx.navigateTo({
      url: 'time_table?line=' + e.currentTarget.id,
    })
  },
  onLoad: function (options) {
    var that = this;
    wx.request({
      url: service + '/route/linestation',
      method: 'GET',
      data: {
        city: "广州"
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        console.log(res)
        if (res.statusCode == 200) {
          wx.setStorage({
            key: 'lines',
            data: res.data,
          })
          for (var i in res.data) {
            lines.push(res.data[i].line)
          }
          var change = "list[0].lines";
          that.setData({
            [change]: lines
          })
        }
      }
    })
  }
});
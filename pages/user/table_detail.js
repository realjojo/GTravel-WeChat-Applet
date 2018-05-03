// pages/user/table_detail.js
var app = getApp()
var service = app.globalData.service;

Page({

  data: {
    table: []
  },

  onLoad: function (options) {
    var that = this;
    wx.request({
      url: service + '/route/station_timelist',
      method: 'GET',
      data: {
        city: "广州",
        station: options.sta,
        type: 0
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        console.log(res)
        if (res.statusCode == 200) {
          var arr,arr0;
          var arr1 = new Array();
          var count = 0;
          for (var i in res.data) {
            arr = res.data[i];
            if (arr[0].line == options.line) {
              arr0 = arr;
              if (count == 0) {
                for (var j in arr0) {
                  arr0[j].dire = "上行"
                }
                count++;
              } else {
                for (var j in arr0) {
                  arr0[j].dire = "下行"
                }
              }
              arr1 = arr1.concat(arr0);
            }
          }
          console.log(arr1);
          that.setData({
            table: arr1
          })
        }
      }
    })
  }
})
// pages/user/time_table.js
var sliderWidth = 96;
var app = getApp()
var service = app.globalData.service;

Page({
  data: {
    line_name: "",
    tabs: ["上行线", "下行线"],
    activeIndex: 0,
    sliderOffset: 0,
    sliderLeft: 0,
    tables: [],
    tables1: []
  },
  onLoad: function (options) {
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          sliderLeft: (res.windowWidth / that.data.tabs.length - sliderWidth) / 2,
          sliderOffset: res.windowWidth / that.data.tabs.length * that.data.activeIndex
        });
      }
    });
    that.setData({
      line_name: options.line
    })
    wx.getStorage({
      key: 'lines',
      success: function (res) {
        for (var i in res.data) {
          if (options.line == res.data[i].line) {
            var stations = new Array();
            var stations1 = new Array();
            for (var j = 0; j < res.data[i].stations_list.length; j++) {
              var obj = { sta: "", tag: "", special: 2, up: true, down: true };
              if (j == 0) {
                obj.tag = "始";
                obj.special = 0;
                obj.up = false;
              } else if (j == res.data[i].stations_list.length - 1) {
                obj.tag = "终";
                obj.special = 1;
                obj.down = false;
              } else {
                obj.tag = j + 1;
              }
              obj.sta = res.data[i].stations_list[j];
              stations.push(obj);
            }
            for (var j = res.data[i].stations_list.length - 1; j > -1; j--) {
              var obj1 = { sta: "", tag: "", special: 2, up: true, down: true };
              if (j == 0) {
                obj1.tag = "终";
                obj1.special = 1;
                obj1.down = false;
              } else if (j == res.data[i].stations_list.length - 1) {
                obj1.tag = "始";
                obj1.special = 0;
                obj1.up = false;
              } else {
                obj1.tag = res.data[i].stations_list.length - j;
              }
              obj1.sta = res.data[i].stations_list[j];
              stations1.push(obj1);
            }
            that.setData({
              tables: stations,
              tables1: stations1
            })
          }
        }
      },
    })
  },
  tabClick: function (e) {
    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id
    });
  },
  click: function (e) {
    var that = this;
    wx.navigateTo({
      url: 'table_detail?sta=' + e.currentTarget.id + '&line=' + that.data.line_name,
    })
  }
});
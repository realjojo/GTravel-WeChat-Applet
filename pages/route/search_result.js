// pages/route/search_result.js
var app = getApp()
var service = app.globalData.service;
var mfile = require('tool.js')
var start_num = "";
var params = { s: "", e: "" };

Page({

  data: {
    search_type: "",
    tabs: [],
    activeIndex: 0,
    latitude: 23.1351666766,
    longitude: 113.2708136740,
    polyline: [],
    markers: [{
      iconPath: "/resources/marker.png",
      id: 0,
      latitude: 23.1351666766,
      longitude: 113.2708136740,
      width: 35,
      height: 35
    }],
    scale: 12,
    stations: [],
    hidden_tip: false
  },

  close_tip: function () {
    this.setData({
      hidden_tip: true
    })
  },

  choose_mode: function (e) {
    wx.showLoading({
      title: '加载中',
    })
    switch (e.currentTarget.id) {
      case "time":
        this.writeData("time", 0);
        break;
      case "busy":
        this.writeData("busy", 0);
        break;
      case "change":
        this.writeData("change", 0);
        break;
      case "auto":
        this.m_request(params, "auto");
        break;
      case "direct":
        this.m_request(params, "direct");
        break;
      case "shopping":
        this.m_request(params, "shopping");
        break;
      case "catering":
        this.m_request(params, "catering");
        break;
    }
  },

  tabClick: function (e) {
    this.setData({
      activeIndex: e.currentTarget.id
    });
  },

  showSeller: function (e) {
    wx.showLoading({
      title: '加载中',
    })
    wx.getStorage({
      key: 'seller',
      success: function (res) {
        var data = mfile.formSeller(res.data);
        for (var i in data) {
          if (data[i].sta == e.currentTarget.dataset.sta) {
            var shop = data[i];
          }
        }
        wx.setStorage({
          key: 'formSeller',
          data: shop,
          complete: function () {
            wx.hideLoading();
            wx.navigateTo({
              url: '../shops/shops?sta=' + e.currentTarget.dataset.sta,
            })
          }
        })
      },
    })
  },

  onLoad: function (options) {
    var that = this;
    console.log(options)
    that.setData({
      search_type: options.type
    })
    if (options.type == "single") {
      that.writeData("time", 0);
    } else if (options.type == "multi") {
      start_num = options.num;
      switch (start_num) {
        case "1":
          that.setData({
            tabs: ["路线1"]
          })
          break;
        case "2":
          that.setData({
            tabs: ["路线1", "路线2"]
          })
          break;
        case "3":
          that.setData({
            tabs: ["路线1", "路线2", "路线3"]
          })
          break;
      }
      params.s = options.s;
      params.e = options.e;
      that.writeData("auto", start_num);
    } else if (options.type == "time") {
      that.writeData("time_advice", 1);
    }
  },

  m_request: function (params, mode) {
    var that = this;
    wx.request({
      url: service + '/route/multi',
      method: 'POST',
      data: {
        User_id: app.globalData.userInfo.uid,
        Starts: params.s,
        End: params.e,
        Scene: mode
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        console.log(res)
        if (res.statusCode == 200) {
          var arr = mfile.formMultiArr(res, start_num);
          var r1 = mfile.formRouteData(arr.r1, arr.busy, arr.meet, "m1");
          var pos = mfile.formRDArray(arr.r1.route_detail);
          var polyline = mfile.routePos(res.data.all_passby_pos, pos);
          var obj = { route: "", polyline: "" };
          var multi = { m1: "", m2: "", m3: "" };
          obj.route = r1;
          obj.polyline = polyline;
          multi.m1 = obj;
          if (start_num == 2) {
            var r2 = mfile.formRouteData(arr.r2, arr.busy, arr.meet, "m2");
            var pos2 = mfile.formRDArray(arr.r2.route_detail);
            var polyline2 = mfile.routePos(res.data.all_passby_pos, pos2);
            var obj2 = { route: "", polyline: "" };
            obj2.route = r2;
            obj2.polyline = polyline2;
            multi.m2 = obj2;
          } else if (start_num == 3) {
            var r2 = mfile.formRouteData(arr.r2, arr.busy, arr.meet, "m2");
            var r3 = mfile.formRouteData(arr.r3, arr.busy, arr.meet, "m3");
            var pos2 = mfile.formRDArray(arr.r2.route_detail);
            var polyline2 = mfile.routePos(res.data.all_passby_pos, pos2);
            var pos3 = mfile.formRDArray(arr.r3.route_detail);
            var polyline3 = mfile.routePos(res.data.all_passby_pos, pos3);
            var obj2 = { route: "", polyline: "" }, obj3 = { route: "", polyline: "" };
            obj2.route = r2;
            obj2.polyline = polyline2;
            multi.m2 = obj2;
            obj3.route = r3;
            obj3.polyline = polyline3;
            multi.m3 = obj3;
          }
          wx.setStorage({
            key: mode,
            data: multi,
            complete: function () {
              wx.setStorage({
                key: 'seller',
                data: res.data.sellers,
                complete: function () {
                  that.writeData(mode, start_num);
                }
              })
            }
          })
        }
      }
    })
  },

  writeData: function (mode, num) {
    var that = this;
    wx.getStorage({
      key: mode,
      success: function (res) {
        switch (num) {
          case 0:
            that.setData({
              start_sta: res.data.route.data.s,
              s_line: res.data.route.data.s_line,
              s_color: res.data.route.data.s_color,
              s_num: res.data.route.data.s_num,
              end_sta: res.data.route.data.e,
              e_line: res.data.route.data.e_line,
              e_color: res.data.route.data.e_color,
              stations: res.data.route.lines,
              latitude: res.data.polyline.lat,
              longitude: res.data.polyline.lng,
              polyline: [{
                points: res.data.polyline.arr,
                color: "#FA8072",
                width: 6
              }],
              markers: [{
                iconPath: "/resources/start.png",
                id: "start",
                latitude: res.data.polyline.start.lat,
                longitude: res.data.polyline.start.lng,
                width: 35,
                height: 35
              }, {
                iconPath: "/resources/end.png",
                id: "end",
                latitude: res.data.polyline.end.lat,
                longitude: res.data.polyline.end.lng,
                width: 35,
                height: 35
              }]
            })
            break;
          case "2":
            that.setData({
              rr1: [{
                start_sta: res.data.m1.route.data.s,
                s_line: res.data.m1.route.data.s_line,
                s_color: res.data.m1.route.data.s_color,
                s_num: res.data.m1.route.data.s_num,
                end_sta: res.data.m1.route.data.e,
                e_line: res.data.m1.route.data.e_line,
                e_color: res.data.m1.route.data.e_color
              }],
              station1: res.data.m1.route.lines,
              rr2: [{
                start_sta: res.data.m2.route.data.s,
                s_line: res.data.m2.route.data.s_line,
                s_color: res.data.m2.route.data.s_color,
                s_num: res.data.m2.route.data.s_num,
                end_sta: res.data.m2.route.data.e,
                e_line: res.data.m2.route.data.e_line,
                e_color: res.data.m2.route.data.e_color
              }],
              station2: res.data.m2.route.lines,
              latitude: res.data.m1.polyline.lat,
              longitude: res.data.m1.polyline.lng,
              polyline: [{
                points: res.data.m1.polyline.arr,
                color: "#FA8072",
                width: 6
              }, {
                points: res.data.m2.polyline.arr,
                color: "#9932CC",
                width: 6
              }],
              markers: [{
                iconPath: "/resources/start.png",
                id: "s1",
                latitude: res.data.m1.polyline.start.lat,
                longitude: res.data.m1.polyline.start.lng,
                width: 35,
                height: 35
              }, {
                iconPath: "/resources/start.png",
                id: "s2",
                latitude: res.data.m2.polyline.start.lat,
                longitude: res.data.m2.polyline.start.lng,
                width: 35,
                height: 35
              }, {
                iconPath: "/resources/end.png",
                id: "end",
                latitude: res.data.m1.polyline.end.lat,
                longitude: res.data.m1.polyline.end.lng,
                width: 35,
                height: 35
              }]
            })
            break;
          case "3":
            that.setData({
              rr1: [{
                start_sta: res.data.m1.route.data.s,
                s_line: res.data.m1.route.data.s_line,
                s_color: res.data.m1.route.data.s_color,
                s_num: res.data.m1.route.data.s_num,
                end_sta: res.data.m1.route.data.e,
                e_line: res.data.m1.route.data.e_line,
                e_color: res.data.m1.route.data.e_color
              }],
              station1: res.data.m1.route.lines,
              rr2: [{
                start_sta: res.data.m2.route.data.s,
                s_line: res.data.m2.route.data.s_line,
                s_color: res.data.m2.route.data.s_color,
                s_num: res.data.m2.route.data.s_num,
                end_sta: res.data.m2.route.data.e,
                e_line: res.data.m2.route.data.e_line,
                e_color: res.data.m2.route.data.e_color
              }],
              station2: res.data.m2.route.lines,
              rr3: [{
                start_sta: res.data.m3.route.data.s,
                s_line: res.data.m3.route.data.s_line,
                s_color: res.data.m3.route.data.s_color,
                s_num: res.data.m3.route.data.s_num,
                end_sta: res.data.m3.route.data.e,
                e_line: res.data.m3.route.data.e_line,
                e_color: res.data.m3.route.data.e_color
              }],
              station3: res.data.m3.route.lines,
              latitude: res.data.m1.polyline.lat,
              longitude: res.data.m1.polyline.lng,
              polyline: [{
                points: res.data.m1.polyline.arr,
                color: "#FA8072",
                width: 6
              }, {
                points: res.data.m2.polyline.arr,
                color: "#9932CC",
                width: 6
              }, {
                points: res.data.m3.polyline.arr,
                color: "#2E8B57",
                width: 6
              }],
              markers: [{
                iconPath: "/resources/start.png",
                id: "s1",
                latitude: res.data.m1.polyline.start.lat,
                longitude: res.data.m1.polyline.start.lng,
                width: 35,
                height: 35
              }, {
                iconPath: "/resources/start.png",
                id: "s2",
                latitude: res.data.m2.polyline.start.lat,
                longitude: res.data.m2.polyline.start.lng,
                width: 35,
                height: 35
              }, {
                iconPath: "/resources/start.png",
                id: "s3",
                latitude: res.data.m3.polyline.start.lat,
                longitude: res.data.m3.polyline.start.lng,
                width: 35,
                height: 35
              }, {
                iconPath: "/resources/end.png",
                id: "end",
                latitude: res.data.m1.polyline.end.lat,
                longitude: res.data.m1.polyline.end.lng,
                width: 35,
                height: 35
              }]
            })
            break;
          case 1:
            that.setData({
              weather: res.data.weather,
              advice_time: res.data.time_advice,
              rr: [{
                start_sta: res.data.route.data.s,
                s_line: res.data.route.data.s_line,
                s_color: res.data.route.data.s_color,
                s_num: res.data.route.data.s_num,
                end_sta: res.data.route.data.e,
                e_line: res.data.route.data.e_line,
                e_color: res.data.route.data.e_color
              }],
              stations: res.data.route.lines,
              latitude: res.data.polyline.lat,
              longitude: res.data.polyline.lng,
              polyline: [{
                points: res.data.polyline.arr,
                color: "#FA8072",
                width: 6
              }],
              markers: [{
                iconPath: "/resources/start.png",
                id: "start",
                latitude: res.data.polyline.start.lat,
                longitude: res.data.polyline.start.lng,
                width: 35,
                height: 35
              }, {
                iconPath: "/resources/end.png",
                id: "end",
                latitude: res.data.polyline.end.lat,
                longitude: res.data.polyline.end.lng,
                width: 35,
                height: 35
              }]
            })
            break;
        }
        wx.hideLoading();
      }
    })
  }
})
// pages/route/route_planning.js
var app = getApp()
var service = app.globalData.service;
var mfile = require('tool.js')
var count = 0;
var start = "", end1 = "", end2 = "";
var s1 = "", s2 = "", s3 = "";
Page({

  data: {
    search_history: "",
    currentTab: 0,
    hideview1: 1,  //初始隐藏
    hideview2: 1,
    ss: "",
    ee: "",
    multi_s1: "",
    multi_s2: "",
    multi_s3: ""
  },

  tabChange: function (e) {
    console.log(e);
    var that = this;
    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.target.dataset.current,
      })
    }
  },

  swiperChange: function (e) {
    console.log(e);
    this.setData({
      currentTab: e.detail.current,
    })
  },

  exchange: function () {
    this.setData({
      ss: end1,
      ee: start
    })
    start = this.data.ss;
    end1 = this.data.ee;
  },

  addClick: function () {
    count++;
    console.log(count)
    if (count == 1) {
      this.setData({
        hideview1: 0
      })
    } else if (count == 2) {
      if (this.data.hideview2 == 1) {
        this.setData({
          hideview2: 0
        })
      } else {
        this.setData({
          hideview1: 0
        })
      }
    } else if (count > 2) {
      count = 2;
    }
  },

  minusClick1: function () {
    count--;
    console.log(count)
    this.setData({
      hideview1: 1,
      multi_s2: ""
    })
    s2 = "";
  },

  minusClick2: function () {
    count--;
    console.log(count)
    this.setData({
      hideview2: 1,
      multi_s3: "",
    })
    s3 = "";
  },

  myinput: function (e) {
    switch (e.currentTarget.id) {
      case "single_s":
        start = e.detail.value;
        break;
      case "single_e":
        end1 = e.detail.value;
        break;
      case "multi_e":
        end2 = e.detail.value;
        break;
      case "multi_s1":
        s1 = e.detail.value;
        break;
      case "multi_s2":
        s2 = e.detail.value;
        break;
      case "multi_s3":
        s3 = e.detail.value;
        break;
    }
  },

  start_search: function (e) {
    var that = this;
    var starts = "";
    var num = 0;
    if (app.globalData.userInfo.isLogin == "true") {
      switch (e.currentTarget.id) {
        case "single_btn":
          if (start == "") {
            wx.showToast({
              title: '请输入起点',
              image: '/resources/fail.png'
            })
          } else if (end1 == "") {
            wx.showToast({
              title: '请输入终点',
              image: '/resources/fail.png'
            })
          } else {
            wx.showLoading({
              title: '加载中',
            })
            wx.request({
              url: service + '/route/single',
              method: 'POST',
              data: {
                User_id: app.globalData.userInfo.uid, //"9sg171107104514",
                Start: start,
                End: end1
              },
              header: {
                'content-type': 'application/x-www-form-urlencoded'
              },
              success: function (res) {
                console.log(res)
                if (res.statusCode == 200) {
                  var datas = mfile.formRouteData(res.data.route.fast, res.data.busy, "", "single");
                  var datas1 = mfile.formRouteData(res.data.route.lessbusy, res.data.busy, "", "single");
                  var datas2 = mfile.formRouteData(res.data.route.lesschange, res.data.busy, "", "single");
                  var pos = mfile.formRDArray(res.data.route.fast.route_detail);
                  var pos1 = mfile.formRDArray(res.data.route.lessbusy.route_detail);
                  var pos2 = mfile.formRDArray(res.data.route.lesschange.route_detail);
                  var polyline = mfile.routePos(res.data.all_passby_pos, pos);
                  var polyline1 = mfile.routePos(res.data.all_passby_pos, pos1);
                  var polyline2 = mfile.routePos(res.data.all_passby_pos, pos2);
                  var rr1 = { route: "", polyline: "" }, rr2 = { route: "", polyline: "" }, rr3 = { route: "", polyline: "" };
                  rr1.route = datas; rr1.polyline = polyline;
                  rr2.route = datas1; rr2.polyline = polyline1;
                  rr3.route = datas2; rr3.polyline = polyline2;
                  wx.setStorage({
                    key: 'time',
                    data: rr1,
                    complete: function () {
                      wx.setStorage({
                        key: 'busy',
                        data: rr2,
                        complete: function () {
                          wx.setStorage({
                            key: 'change',
                            data: rr3,
                            complete: function () {
                              wx.setStorage({
                                key: 'seller',
                                data: res.data.seller,
                                complete: function () {
                                  wx.hideLoading();
                                  wx.navigateTo({
                                    url: 'search_result?type=single'
                                  })
                                }
                              })
                            }
                          })
                        }
                      })
                    }
                  })
                } else {
                  wx.hideLoading();
                }
              }
            })
          }
          break;
        case "multi_btn":
          if (s1 == "" && s2 == "" && s3 == "") {
            wx.showToast({
              title: '请输入起点',
              image: '/resources/fail.png'
            })
          } else if (end2 == "") {
            wx.showToast({
              title: '请输入终点',
              image: '/resources/fail.png'
            })
          } else {
            if (s1 != "") {
              if (s2 != "") {
                if (s3 != "") {
                  starts = s1 + "+" + s2 + "+" + s3;
                  num = 3;
                  that.mrequest(starts, num);
                } else {
                  starts = s1 + "+" + s2;
                  num = 2;
                  that.mrequest(starts, num);
                }
              } else if (s3 != "") {
                starts = s1 + "+" + s3;
                num = 2;
                that.mrequest(starts, num);
              } else {
                wx.showToast({
                  title: '至少两个起点',
                  image: '/resources/fail.png'
                })
              }
            }
          }
          break;
      }
    } else {
      wx.showModal({
        title: '提示',
        content: '请您先登录账号，登录成功后进行路线规划',
        success: function (res) {
          if (res.confirm) {
            wx.navigateTo({
              url: '../user/login',
            })
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    }
  },

  mrequest: function (starts, num) {
    var that = this;
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: service + '/route/multi',
      method: 'POST',
      data: {
        User_id: app.globalData.userInfo.uid,
        Starts: starts,
        End: end2,
        Scene: "auto"
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        console.log(res)
        if (res.statusCode == 200) {
          var arr = mfile.formMultiArr(res, num);
          var r1 = mfile.formRouteData(arr.r1, arr.busy, arr.meet, "m1");
          var pos = mfile.formRDArray(arr.r1.route_detail);
          var polyline = mfile.routePos(res.data.all_passby_pos, pos);
          var obj = { route: "", polyline: "" };
          var multi = { m1: "", m2: "", m3: "" };
          obj.route = r1;
          obj.polyline = polyline;
          multi.m1 = obj;
          if (num == 2) {
            var r2 = mfile.formRouteData(arr.r2, arr.busy, arr.meet, "m2");
            var pos2 = mfile.formRDArray(arr.r2.route_detail);
            var polyline2 = mfile.routePos(res.data.all_passby_pos, pos2);
            var obj2 = { route: "", polyline: "" };
            obj2.route = r2;
            obj2.polyline = polyline2;
            multi.m2 = obj2;
          } else if (num == 3) {
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
            key: 'auto',
            data: multi,
            complete: function () {
              wx.setStorage({
                key: 'seller',
                data: res.data.sellers,
                complete: function () {
                  wx.hideLoading();
                  wx.navigateTo({
                    url: 'search_result?type=multi&s=' + starts + '&e=' + end2 + '&num=' + num
                  })
                }
              })
            }
          })
        } else {
          wx.hideLoading();
        }
      }
    })
  },

  onUnload: function () {
    count = 0;
  }
})
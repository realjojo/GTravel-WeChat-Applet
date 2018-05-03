// pages/destination/destination.js
var app = getApp()
var service = app.globalData.service;
var mfile = require('../route/tool.js')
var keywords = new Array();
var start = "", end = "";

Page({
  data: {
    currentTab: 0,
    focus: false,
    keyword_list: [
      { id: 0, txt: "火锅", check: false },
      { id: 1, txt: "日料", check: false },
      { id: 2, txt: "湘菜", check: false },
      { id: 3, txt: "川菜", check: false },
      { id: 4, txt: "海底捞", check: false },
      { id: 5, txt: "甜品", check: false },
      { id: 6, txt: "粤菜", check: false },
      { id: 7, txt: "冰淇淋", check: false },
      { id: 8, txt: "肯德基", check: false },
      { id: 9, txt: "面包甜点", check: false }],
    time1: "",
    time2: "",
    time: "12:00",
    inputShowed: false,
    inputVal: "",
    kwVal: "",
    result: ["广州塔", "林和西", "广州东站"],
    ss: "",
    ee: ""
  },

  tabChange: function (e) {
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
    this.setData({
      currentTab: e.detail.current,
    })
  },

  exchange: function () {
    this.setData({
      ss: end,
      ee: start
    })
    start = this.data.ss;
    end = this.data.ee;
  },

  showInput: function () {
    this.setData({
      inputShowed: true
    });
  },

  hideInput: function () {
    this.setData({
      inputVal: "",
      inputShowed: false
    });
  },

  clearInput: function () {
    this.setData({
      inputVal: ""
    });
  },

  inputTyping: function (e) {
    this.setData({
      inputVal: e.detail.value
    });
  },

  bindfocus: function () {
    this.setData({
      focus: true
    })
  },

  bindblur: function () {
    this.setData({
      focus: false
    })
  },

  click_result: function (e) {
    this.setData({
      inputVal: e.currentTarget.id,
      focus: false
    })
  },

  input: function (e) {
    this.setData({
      kwVal: e.detail.value
    })
  },

  check_kw: function (e) {
    var that = this;
    var check = "keyword_list[" + e.currentTarget.id + "].check";
    var str = "";
    switch (that.data.keyword_list[e.currentTarget.id].check) {
      case true:
        delete keywords[e.currentTarget.dataset.txt]
        for (var i in keywords) {
          str = str + " " + keywords[i]
        }
        that.setData({
          [check]: false,
          kwVal: str
        })
        break;
      case false:
        keywords[e.currentTarget.dataset.txt] = e.currentTarget.dataset.txt
        for (var i in keywords) {
          str = str + " " + keywords[i]
        }
        that.setData({
          [check]: true,
          kwVal: str
        })
        break;
    }
  },

  myinput: function (e) {
    switch (e.currentTarget.id) {
      case "s":
        start = e.detail.value;
        break;
      case "e":
        end = e.detail.value;
        break;
    }
  },

  start_search: function (e) {
    var that = this;
    if (app.globalData.userInfo.isLogin == "true") {
      switch (e.currentTarget.id) {
        case "destination":
          var kw = new Array();
          if (keywords != "") {
            for (var i in keywords) {
              kw.push(keywords[i])
            }
          } else {
            kw.push(that.data.kwVal)
          }
          wx.setStorage({
            key: 'keywords',
            data: kw,
          })
          if (that.data.inputVal == "" || that.data.kwVal == "") {
            wx.showToast({
              title: '搜索条件不全',
              image: '/resources/fail.png'
            })
          } else {
            wx.navigateTo({
              url: '../shops/sta_shops?sta=' + that.data.inputVal,
            })
          }
          break;
        case "advice":
          if (start == "" || end == "" || that.data.time1 == "" || that.data.time2 == "") {
            wx.showToast({
              title: '搜索条件不全',
              image: '/resources/fail.png'
            })
          } else {
            wx.showLoading({
              title: '加载中',
            })
            wx.request({
              url: service + '/route/advice',
              method: 'POST',
              data: {
                User_id: app.globalData.userInfo.uid,
                Start: start,
                End: end,
                timeStart: that.data.time1,
                timeEnd: that.data.time2
              },
              header: {
                'content-type': 'application/x-www-form-urlencoded'
              },
              success: function (res) {
                console.log(res)
                if (res.statusCode == 200) {
                  var rr = mfile.formRouteData(res.data, res.data.busy, "", "time");
                  var pos = mfile.formRDArray(res.data.route_detail);
                  var polyline = mfile.routePos(res.data.all_passby_pos, pos);
                  var rr1 = { route: "", polyline: "", weather: "", time_advice: "" };
                  rr1.route = rr; rr1.polyline = polyline;
                  rr1.time_advice = res.data.time_advice;
                  rr1.weather = res.data.weather;
                  wx.setStorage({
                    key: 'time_advice',
                    data: rr1,
                    complete: function () {
                      wx.setStorage({
                        key: 'seller',
                        data: res.data.sellers,
                        complete: function () {
                          wx.hideLoading();
                          wx.navigateTo({
                            url: '../route/search_result?type=time',
                          })
                        }
                      })
                    }
                  })
                }
              }
            })
          }
          break;
      }
    } else {
      wx.showModal({
        title: '提示',
        content: '请您先登录账号，登录成功后进行出行推荐',
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

  bindTimeChange: function (e) {
    var that = this;
    switch (e.currentTarget.id) {
      case "time1":
        that.setData({
          time1: e.detail.value
        })
        break;
      case "time2":
        that.setData({
          time2: e.detail.value
        })
        break;
    }
  },

  onLoad: function (options) {

  }
})
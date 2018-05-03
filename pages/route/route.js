//pages / route / route.js
var app = getApp()
var latitude, longitude;
var speed;
var accuracy;
var s_width, s_height;
var scale = 14;
var mapCtx;

Page({

  data: {
    latitude: "",
    longitude: "",
    markers: [],
    polyline: [],
    controls: [],
    scale: scale,
    disabled: false,
    plain: false,
    loading: false
  },

  regionchange(e) {
    console.log(e.type) //视野变化时触发
  },

  markertap(e) {
    console.log(e.markerId) //点击标记点触发
    wx.openLocation({
      latitude: latitude,
      longitude: longitude,
    })
  },

  controltap(e) {
    console.log(e.controlId) //点击控件时触发
    var that = this;
    switch (e.controlId) {
      case "control":
        wx.getLocation({
          type: 'gcj02',
          success: function (res) {
            latitude = res.latitude;
            longitude = res.longitude;
            that.setData({
              latitude: latitude,
              longitude: longitude,
              markers: [{
                iconPath: "/resources/marker.png",
                id: "focusposition",
                latitude: latitude,
                longitude: longitude,
                width: 35,
                height: 35
              }]
            })
          }
        })
        break;
      case "plus":
        mapCtx.getScale({
          success: function (res) {
            if (res.scale >= 5 && res.scale < 18) {
              scale = res.scale;
              scale++;
              that.setData({
                scale: scale
              })
              console.log(scale)
            }
          }
        })
        break;
      case "minus":
        mapCtx.getScale({
          success: function (res) {
            if (res.scale > 5 && res.scale <= 18) {
              scale = res.scale;
              scale--;
              that.setData({
                scale: scale
              })
              console.log(scale)
            }
          }
        })
        break;
      case "route_btn":
        wx.navigateTo({
          url: 'route_planning',
        })
        break;
    }
  },

  clickmap(e) {
    var that = this;
    wx.chooseLocation({
      success: function (res) {
        latitude = res.latitude;
        longitude = res.longitude;
        that.setData({
          latitude: latitude,
          longitude: longitude,
          markers: [{
            iconPath: "/resources/marker.png",
            id: "chooseposition",
            latitude: latitude,
            longitude: longitude,
            width: 35,
            height: 35
          }]
        })
      },
    })
  },

  onLoad: function (options) {
    var that = this;
    wx.getLocation({
      type: 'gcj02',
      success: function (res) {
        latitude = res.latitude;
        longitude = res.longitude;
        console.log(latitude);
        console.log(longitude)
        that.setData({
          latitude: latitude,
          longitude: longitude,
          markers: [{
            iconPath: "/resources/marker.png",
            id: "myposition",
            latitude: latitude,
            longitude: longitude,
            width: 35,
            height: 35
          }]
        })
      },
    })
    wx.getSystemInfo({
      success: function (res) {
        console.log(res)
        s_width = res.screenWidth;
        that.setData({
          controls: [{
            id: "control",
            iconPath: '/resources/focus.png',
            position: {
              left: 10,
              top: res.windowHeight - 70,
              width: 40,
              height: 40
            },
            clickable: true
          }, {
            id: "plus",
            iconPath: '/resources/plus_region.png',
            position: {
              left: s_width - 40,
              top: res.windowHeight - 40,
              width: 30,
              height: 30
            },
            clickable: true
          }, {
            id: "minus",
            iconPath: '/resources/minus_region.png',
            position: {
              left: s_width - 40,
              top: res.windowHeight - 80,
              width: 30,
              height: 30
            },
            clickable: true
          }, {
            id: "route_btn",
            iconPath: '/resources/route_btn.png',
            position: {
              left: s_width / 2 - 30,
              top: res.windowHeight - 80,
              width: 60,
              height: 60
            },
            clickable: true
          }]
        })
      },
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    mapCtx = wx.createMapContext('map', this)
  }
})
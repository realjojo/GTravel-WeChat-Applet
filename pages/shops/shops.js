// pages/shops/shops.js
var app = getApp()
var service = app.globalData.service;

Page({
  data: {
    shops: []
  },

  onLoad: function (options) {
    var that = this;
    wx.setNavigationBarTitle({
      title: options.sta,
    });
    wx.getStorage({
      key: 'formSeller',
      success: function (res) {
        console.log(res.data)
        that.setData({
          shops: res.data.shops
        })
      },
    })
  },

  click_shop: function (e) {
    wx.navigateTo({
      url: 'shop_detail?shop_id=' + e.currentTarget.id,
    })
  }
})
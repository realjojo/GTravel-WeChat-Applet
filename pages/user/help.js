// pages/user/help.js
var app = getApp()
var service = app.globalData.service;

Page({

  data: {
    question: []
  },

  onLoad: function (options) {
    var that = this;
    wx.request({
      url: service + '/users/get_q_and_a',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        console.log(res)
        that.setData({
          question: res.data.q_and_a
        })
      }
    })
  },

  click: function (e) {
    wx.showModal({
      title: this.data.question[e.currentTarget.id].question,
      content: this.data.question[e.currentTarget.id].answer,
      showCancel: false
    })
  }
})
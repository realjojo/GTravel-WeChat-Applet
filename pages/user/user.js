// pages/user/user.js
var app = getApp()

Page({
  data: {
    myOrderItems: [{
      id: 1,
      text: "待付款",
      image: "/resources/pay.png"
    }, {
      id: 2,
      text: "待发货",
      image: "/resources/send.png"
    }, {
      id: 3,
      text: "待取货",
      image: "/resources/receive.png"
    }, {
      id: 4,
      text: "待评价",
      image: "/resources/evaluate.png"
    }, {
      id: 5,
      text: "售后服务",
      image: "/resources/service.png"
    }],
    otherInfoItems: [{
      id: 0,
      text: "收货地址管理",
      image: "/resources/address.png",
      divide: "divide_line"
    }, {
      id: 1,
      text: "我的优惠券",
      image: "/resources/my_coupon.png",
      divide: "divide_line"
    }, {
      id: 2,
      text: "列车时刻表",
      image: "/resources/time.png",
      divide: "divide_line"
    }, {
      id: 3,
      text: "帮助中心",
      image: "/resources/help.png",
      divide: ""
    }],
    phoneNumber: "18811721895",
    froms: "user",
    isLogin: "false"
  },

  login: function () {
    wx.navigateTo({
      url: 'login',
    })
  },

  register: function () {
    wx.navigateTo({
      url: 'register',
    })
  },

  phoneCall: function () {
    wx.makePhoneCall({
      phoneNumber: '18811721895'
    })
  },

  userManage: function () {
    if (app.globalData.userInfo.isLogin == "true") {
      wx.navigateTo({
        url: 'user_info',
      })
    }
  },

  all_orders: function () {
    wx.navigateTo({
      url: 'order?flag=0',
    })
  },

  switchTab: function (e) {
    switch (e.currentTarget.id) {
      case "1":
        wx.navigateTo({
          url: 'order?flag=1',
        })
        break;
      case "2":
        wx.navigateTo({
          url: 'order?flag=2',
        })
        break;
      case "3":
        wx.navigateTo({
          url: 'order?flag=3',
        })
        break;
      case "4":
        wx.navigateTo({
          url: 'order?flag=4',
        })
        break;
      case "5":
        wx.navigateTo({
          url: '',
        })
        break;
    }
  },

  navigate: function (e) {
    console.log(e)
    switch (e.currentTarget.id) {
      case "0":
        wx.navigateTo({
          url: 'address',
        })
        break;
      case "1":
        wx.navigateTo({
          url: 'my_coupon?type=my',
        })
        break;
      case "2":
        wx.navigateTo({
          url: 'lines',
        })
        break;
      case "3":
        wx.navigateTo({
          url: 'help',
        })
        break;
    }
  },

  onShow: function () {
    if (app.globalData.userInfo.isLogin == "true") {
      this.setData({
        isLogin: "true"
      })
    } else {
      this.setData({
        isLogin: "false"
      })
    }
    this.setData({
      userPicPath: app.globalData.userInfo.avator,
      userName: app.globalData.userInfo.name,
      userPhone: app.globalData.userInfo.phone
    })
  }
})
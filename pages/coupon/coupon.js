// pages/coupon/coupon.js
var sliderWidth = 96; // 需要设置slider的宽度，用于计算中间位置
var app = getApp()
var service = app.globalData.service;
var coupon_infos = "";
var shop_tag = "";
var latitude = "23.155823", longitude = "113.331062";
var list1 = new Array();
var list2 = new Array();
var list3 = new Array();
var list4 = new Array();

Page({
  data: {
    banner_url: ['/resources/banner_01.png', '/resources/banner_02.png', '/resources/banner_03.png', '/resources/banner_04.png'],
    indicatorDots: true,
    vertical: false,
    autoplay: true,
    interval: 3000,
    duration: 1000,
    tabs: ["餐饮", "娱乐", "购物", "旅游"],
    activeIndex: 0,
    sliderOffset: 0,
    sliderLeft: 0
  },

  onPullDownRefresh: function () {
    this.refreshData();
    wx.stopPullDownRefresh()
  },

  onLoad: function () {
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          sliderLeft: (res.windowWidth / that.data.tabs.length - sliderWidth) / 2,
          sliderOffset: res.windowWidth / that.data.tabs.length * that.data.activeIndex
        });
      }
    });
    that.refreshData();
  },

  tabClick: function (e) {
    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id
    });
  },

  get_btn: function (e) {
    console.log(e)
    if (app.globalData.userInfo.isLogin == "true") {
      wx.request({
        url: service + '/users/me/coupons/' + e.currentTarget.id,
        method: 'POST',
        data: {
          userId: app.globalData.userInfo.uid,
          token: app.globalData.userInfo.token,
          couponId: e.currentTarget.id
        },
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        success: function (res) {
          console.log(res)
          if (res.statusCode == 200) {
            console.log("优惠券领取成功")
            wx.showToast({
              title: '领取成功'
            })
          } else {
            console.log("优惠券领取失败")
          }
        }
      })
    } else if (app.globalData.userInfo.isLogin == "false") {
      wx.showModal({
        title: '提示',
        content: '请您先登录账号，登录成功后方可领取优惠券',
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

  refreshData: function () {
    var that = this;
    list1.length = 0; list2.length = 0; list3.length = 0; list4.length = 0;
    wx.showLoading({
      title: '加载中',
    })
    // if (app.globalData.location == "yes") {
    //   var latitude, longitude;
    //   wx.getLocation({
    //     success: function (res) {
    //       latitude = res.latitude;
    //       longitude = res.longitude;
    //     },
    //   })
    // }
    wx.request({
      url: service + '/users/me/coupons/near',
      method: 'GET',
      data: {
        latitude: latitude,
        longitude: longitude
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        console.log(res)
        if (res.statusCode == 200) {
          coupon_infos = res.data
          var length = coupon_infos.length
          if (length > 50) {
            length = 50
          }
          for (var i = 0; i < length; i++) {
            var time = new Array();
            time = coupon_infos[i].expire_at.split(" ");
            var coupon = { id: "", subject: "", price: "", image_url: "", message: "", seller_id: "", status: "" };
            coupon.id = coupon_infos[i].id;
            coupon.subject = coupon_infos[i].shop_name;
            coupon.price = coupon_infos[i].coupon_name;
            coupon.image_url = coupon_infos[i].image_url;
            coupon.message = time[0] + "到期";
            coupon.seller_id = coupon_infos[i].seller_id;
            coupon.status = coupon_infos[i].status;
            shop_tag = coupon_infos[i].shop_tag;
            switch (shop_tag) {
              case "餐饮":
                list1.push(coupon);
                break;
              case "娱乐":
                list2.push(coupon);
                break;
              case "购物":
                list3.push(coupon);
                break;
              case "旅游":
                list4.push(coupon);
                break;
            }
          }
          that.setData({
            food: list1,
            entertainment: list2,
            shopping: list3,
            travel: list4
          })
        }
        wx.hideLoading();
      }
    })
  }
})
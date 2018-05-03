// pages/user/my_coupon.js
var app = getApp()
var service = app.globalData.service;
var coupon_infos = "";
var list = new Array();

Page({

  data: {
    coupon_list: [],
    mtype: 0
  },

  onPullDownRefresh: function () {
    this.refreshData();
    wx.stopPullDownRefresh()
  },

  onLoad: function (options) {
    var that = this;
    if (options.type == "my") {
      if (app.globalData.userInfo.isLogin == "true") {
        that.refreshData();
      } else {
        wx.showModal({
          title: '提示',
          content: '您还未登录账号，是否前往登录？',
          success: function (res) {
            if (res.confirm) {
              wx.navigateTo({
                url: 'login',
              })
            } else if (res.cancel) {
              console.log('用户点击取消')
            }
          }
        })
      }
    } else if (options.type == "shop") {
      wx.setNavigationBarTitle({
        title: options.shopName,
      })
      that.setData({
        mtype: 1
      })
      wx.getStorage({
        key: 'shop_coupon',
        success: function (res) {
          coupons(res);
          that.setData({
            coupon_list: list
          })
        },
      })
    }
  },

  use_btn: function (e) {
    console.log(e)
    if (this.data.mtype == 0) {
      wx.navigateTo({
        url: '../shops/shop_detail?shop_id=' + e.currentTarget.dataset.shop,
      })
    } else if (this.data.mtype == 1) {
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
    }
  },

  refreshData: function () {
    var that = this;
    wx.request({
      url: service + '/users/me/coupons',
      method: 'GET',
      data: {
        userId: app.globalData.userInfo.uid,
        token: app.globalData.userInfo.token
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        if (res.statusCode == 200) {
          coupons(res);
          that.setData({
            coupon_list: list
          })
        }
      }
    })
  }
})

function coupons(res) {
  list.length = 0;
  coupon_infos = res.data
  for (var i = 0; i < coupon_infos.length; i++) {
    var time = new Array();
    time = coupon_infos[i].expire_at.split(" ");
    var coupon = { id: "", subject: "", price: "", image_url: "", message: "", seller_id: "", shop_id: "", status: "" };
    coupon.id = coupon_infos[i].id;
    coupon.subject = coupon_infos[i].shop_name;
    coupon.price = coupon_infos[i].coupon_name;
    coupon.image_url = coupon_infos[i].image_url;
    coupon.message = time[0] + "到期";
    coupon.seller_id = coupon_infos[i].seller_id;
    coupon.shop_id = coupon_infos[i].shop_id;
    coupon.status = coupon_infos[i].status;
    list.push(coupon);
  }
}
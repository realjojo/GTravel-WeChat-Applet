// pages/shops/order_confirm.js
var app = getApp()
var service = app.globalData.service;
var sum_price, discount = 0;
var addr_id = "", shopId = "";
var s_coupon = "", sc_type = "", sc_id = 0, sc_sellerId = "";
var remark = "";
var goods = new Array();
var coupons, mailing_info;

Page({

  data: {
    hasAddr: false,
    p_name: "",
    p_phone: "",
    title: "",
    goods: [],
    deliver: "门店自提",
    re_method: 0,
    discount: "",
    sum_num: "",
    sum_price: "",
    froms: "order"
  },

  chooseAddr: function () {
    if (this.data.hasAddr == true) {
      wx.navigateTo({
        url: '../user/address?from=order',
      })
    } else {
      wx.navigateTo({
        url: '../user/edit_addr?type=add&from=order',
      })
    }
  },

  deliver_type: function () {
    var that = this;
    wx.showActionSheet({
      itemList: ['门店自提', '自提柜取货'],
      success: function (res) {
        console.log(res.tapIndex)
        if (res.tapIndex == 1) {
          that.setData({
            deliver: '自提柜取货',
            re_method: 1
          })
        }
      },
      fail: function (res) {
        console.log(res.errMsg)
      }
    })
  },

  shop_coupon: function () {
    var that = this;
    wx.showActionSheet({
      itemList: s_coupon,
      success: function (res) {
        console.log(res.tapIndex)
        if (sc_type != "") {
          if (res.tapIndex == 0) {
            that.count_price(sc_type);
            that.setData({
              discount: s_coupon[res.tapIndex]
            })
          } else if (res.tapIndex == 1) {
            that.setData({
              discount: '不使用优惠'
            })
          }
        }
      },
      fail: function (res) {
        console.log(res.errMsg)
      }
    })
  },

  remark: function (e) {
    remark = e.detail.value
  },

  order_pay: function () {
    if (this.data.hasAddr == true) {
      wx.showLoading({
        title: '请等待',
      })
      wx.request({
        url: service + '/order/submit',
        method: 'POST',
        data: {
          user_id: app.globalData.userInfo.uid,
          token: app.globalData.userInfo.token,
          user_source: "",
          seller_id: sc_sellerId,
          coupon_id: sc_id,
          products: goods,
          receive_id: addr_id,
          receive_method: this.data.re_method,
          remark: remark
        },
        header: {
          'Content-Type': 'application/json'
        },
        success: function (res) {
          console.log(res)
          if (res.statusCode == 200) {
            var order_no = res.data.order_no;
            wx.login({
              success: function (res) {
                console.log(res)
                if (res.code) {
                  wx.request({
                    url: service + '/order/getprepayidjs',
                    method: 'POST',
                    data: {
                      user_id: app.globalData.userInfo.uid,
                      token: app.globalData.userInfo.token,
                      order_no: order_no,
                      code: res.code
                    },
                    header: {
                      'content-type': 'application/x-www-form-urlencoded'
                    },
                    success: function (res) {
                      console.log(res)
                      wx.hideLoading();
                      if (res.statusCode == 200) {
                        wx.requestPayment({
                          'timeStamp': res.data.timeStamp,
                          'nonceStr': res.data.nonceStr,
                          'package': res.data.package,
                          'signType': res.data.signType,
                          'paySign': res.data.paySign,
                          'success': function (res) {
                            console.log(res)
                          },
                          'fail': function (res) {
                            console.log(res)
                          }
                        })
                      } else {
                        wx.showToast({
                          title: '下单失败',
                          image: '/resources/fail.png'
                        })
                        console.log('获取预支付字段失败！')
                      }
                    }
                  });
                } else {
                  wx.hideLoading();
                  wx.showToast({
                    title: '下单失败',
                    image: '/resources/fail.png'
                  })
                  console.log('登录失败！' + res.errMsg)
                }
              }
            });
          } else {
            wx.hideLoading();
            wx.showToast({
              title: '下单失败',
              image: '/resources/fail.png'
            })
            console.log('下单失败！')
          }
        }
      })
    } else {
      wx.showModal({
        title: '提示',
        content: '请添加收货人信息',
        success: function (res) {
          if (res.confirm) {
            wx.navigateTo({
              url: '../user/edit_addr?type=add',
            })
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    }
  },

  onShow: function () {
    var that = this;
    wx.getStorage({
      key: 'order_info',
      success: function (res) {
        if (res.data != "") {
          console.log(res.data)
          mailing_info = res.data.mailing_infos;
          coupons = res.data.coupons;
          if (mailing_info.length == 1) {
            addr_id = mailing_info[0].id
            that.setData({
              hasAddr: true,
              p_name: mailing_info[0].mailing_name,
              p_phone: mailing_info[0].mailing_phone
            })
          } else if (mailing_info.length > 1) {
            for (var m in mailing_info) {
              if (mailing_info[m].is_default == 1) {
                addr_id = mailing_info[m].id
                that.setData({
                  hasAddr: true,
                  p_name: mailing_info[m].mailing_name,
                  p_phone: mailing_info[m].mailing_phone
                })
              }
            }
          }
          if (coupons.bestCoupon == null) {
            that.setData({
              discount: "无可用优惠"
            })
            s_coupon = ['无可用优惠'];

            sc_sellerId = coupons.couponList[0].seller_id;
          } else if (coupons.bestCoupon.owned == true) {
            that.setData({
              discount: coupons.bestCoupon.coupon_name
            })
            s_coupon = [coupons.bestCoupon.coupon_name, '不使用优惠'];
            sc_type = coupons.bestCoupon.type;
            sc_id = coupons.bestCoupon.id;
            sc_sellerId = coupons.bestCoupon.seller_id;
            that.count_price(sc_type);
            that.setData({
              sum_price: sum_price - discount
            })
          } else if (coupons.bestCoupon.owned == false) {
            that.setData({
              discount: "无可用优惠"
            })
            s_coupon = ['有可领取的优惠'];
            sc_sellerId = coupons.bestCoupon.seller_id;
          }
        }
      }
    })
    wx.getStorage({
      key: 'cur_order',
      success: function (res) {
        var orders = res.data;
        for (var i in orders) {
          var obj = { good_id: "", good_num: "", good_price: "" }
          obj.good_id = orders[i].id;
          obj.good_num = orders[i].bought_num;
          obj.good_price = orders[i].price;
          goods.push(obj);
        }
        that.setData({
          goods: orders
        })
      }
    })
  },

  onLoad: function (options) {
    var that = this;
    sum_price = options.sum_price;
    shopId = options.shopId;
    that.setData({
      title: options.shopName,
      sum_num: options.all_numb,
      sum_price: sum_price
    })
  },

  count_price: function (t) {
    var that = this;
    switch (t) {
      case 1:
        var s1, s2;
        s1 = that.data.discount.split("满")
        s2 = s1[1].split("减")
        if (Number(s2[0]) < sum_price) {
          discount = Number(s2[1])
        }
        break;
      case 2:
        var str;
        str = that.data.discount.split("折")
        discount = sum_price * (1 - Number(str[0]) / 100)
        break;
    }
  }
})
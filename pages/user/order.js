// pages/user/order.js
var sliderWidth = 96;
var app = getApp();
var service = app.globalData.service;
var orderList0 = new Array(), orderList1 = new Array(), orderList2 = new Array(), orderList3 = new Array(), orderList4 = new Array();

Page({
  data: {
    currentTab: "",
    hideview1: 1,
    hideview2: 1,
    order_items0: [],
    order_items1: [],
    order_items2: [],
    order_items3: [],
    order_items4: []
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
    switch (e.detail.current) {
      case 0:
        if (orderList0 != "") {
          this.setData({
            order_items0: orderList0
          })
        } else {
          this.getOrderList("all");
        }
        break;
      case 1:
        if (orderList1 != "") {
          this.setData({
            order_items1: orderList1
          })
        } else {
          this.getOrderList("ordered");
        }
        break;
      case 2:
        if (orderList2 != "") {
          this.setData({
            order_items2: orderList2
          })
        } else {
          this.getOrderList("payed");
        }
        break;
      case 3:
        if (orderList3 != "") {
          this.setData({
            order_items3: orderList3
          })
        } else {
          this.getOrderList("topick");
        }
        break;
      case 4:
        if (orderList1 != "") {
          this.setData({
            order_items4: orderList4
          })
        } else {
          this.getOrderList("finished");
        }
        break;
    }
  },

  cancel: function (e) {
    var that = this;
    console.log(e)
    wx.showModal({
      title: '取消订单',
      content: '确认取消该订单吗？',
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定')
          wx.request({
            url: service + '/order/usercancel',
            method: 'POST',
            data: {
              user_id: app.globalData.userInfo.uid,
              token: app.globalData.userInfo.token,
              order_no: e.currentTarget.dataset.order_no
            },
            header: {
              'content-type': 'application/x-www-form-urlencoded'
            },
            success: function (res) {
              console.log(res)
              if (res.statusCode == 200) {
                wx.showToast({
                  title: '订单取消成功',
                  image: '/resources/success.png',
                  complete: function () {
                    that.getOrderList(e.currentTarget.dataset.curpage)
                  }
                })
              }
            }
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },

  confirm: function (e) {
    switch (e.currentTarget.dataset.txt) {
      case "立即付款":
        wx.request({
          url: service + '/order/getprepayid',
          method: 'POST',
          data: {
            user_id: app.globalData.userInfo.uid,
            token: app.globalData.userInfo.token,
            order_no: e.currentTarget.dataset.order_no
          },
          header: {
            'content-type': 'application/x-www-form-urlencoded'
          },
          success: function (res) {
            console.log(res)
            if (res.statusCode == 200) {
              wx.requestPayment({
                'timeStamp': res.data.timestamp,
                'nonceStr': res.data.noncestr,
                'package': "prepay_id=" + res.data.prepayid,
                'signType': 'MD5',
                'paySign': res.data.sign,
                'success': function (res) {
                  console.log(res)
                },
                'fail': function (res) {
                  console.log(res)
                },
                'complete': function (res) {
                  console.log(res)
                }
              })
            }
          }
        })
        break;
      case "取货二维码":
      //todo
        break;
    }
  },

  evaluation: function () {

  },

  onPullDownRefresh: function () {
    console.log(this.data.currentTab)
    switch (this.data.currentTab) {
      case 0:
        this.getOrderList("all");
        break;
      case 1:
        this.getOrderList("ordered");
        break;
      case 2:
        this.getOrderList("payed");
        break;
      case 3:
        this.getOrderList("topick");
        break;
      case 4:
        this.getOrderList("finished");
        break;
    }
    wx.stopPullDownRefresh()
  },

  getOrderList: function (search_type) {
    if (app.globalData.userInfo.isLogin == "true") {
      var that = this;
      orderList0.length = 0; orderList1.length = 0; orderList2.length = 0; orderList3.length = 0; orderList4.length = 0;
      wx.showLoading({
        title: '加载中',
      })
      wx.request({
        url: service + '/order/userorderlist',
        method: 'POST',
        data: {
          user_id: app.globalData.userInfo.uid,
          token: app.globalData.userInfo.token,
          order_type: search_type
        },
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        success: function (res) {
          console.log(res)
          if (res.statusCode == 200) {
            var str = "", detail = "";
            var orderList = res.data.orders;
            for (var i in orderList) {
              orderList[i].order_amount_total = Number(orderList[i].order_amount_total);
              orderList[i].show = false;
              switch (orderList[i].order_status) {
                case 1:
                  orderList[i].status = "待付款";
                  orderList[i].btn = "立即付款";
                  orderList[i].show = true;
                  break;
                case 2:
                  orderList[i].status = "待发货";
                  orderList[i].btn = "催促发货";
                  break;
                case 3:
                  if (orderList[i].receive_method == 0) {
                    orderList[i].status = "门店自提";
                  } else if (orderList[i].receive_method == 1) {
                    orderList[i].status = "自提柜取货";
                  }
                  orderList[i].btn = "取货二维码";
                  break;
                case 4:
                  orderList[i].status = "已完成";
                  orderList[i].btn = "再来一单";
                  break;
                case 9:
                  orderList[i].status = "已取消";
                  orderList[i].btn = "再来一单";
                  break;
              }
              for (var j in orderList[i].orderDetails) {
                detail = orderList[i].orderDetails[j];
                orderList[i].orderDetails[j].product_price = Number(detail.product_price);
                str = detail.pic_url.split("://");
                if (str[0] != "http") {
                  orderList[i].orderDetails[j].pic_url = service + "/" + detail.pic_url;
                }
              }
            }
            switch (search_type) {
              case "all":
                orderList0 = orderList;
                that.setData({
                  order_items0: orderList0
                })
                break;
              case "ordered":
                orderList1 = orderList;
                that.setData({
                  order_items1: orderList1
                })
                break;
              case "payed":
                orderList2 = orderList;
                that.setData({
                  order_items2: orderList2
                })
                break;
              case "topick":
                orderList3 = orderList;
                that.setData({
                  order_items3: orderList3
                })
                break;
              case "finished":
                orderList4 = orderList;
                that.setData({
                  order_items4: orderList4
                })
                break;
            }
          }
          wx.hideLoading();
        }
      })
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
  },

  onLoad: function (options) {
    switch (options.flag) {
      case '0':
        this.setData({
          currentTab: 0,
        })
        this.getOrderList("all");
        break;
      case '1':
        this.setData({
          currentTab: 1
        })
        this.getOrderList("ordered");
        break;
      case '2':
        this.setData({
          currentTab: 2
        })
        this.getOrderList("payed");
        break;
      case '3':
        this.setData({
          currentTab: 3
        })
        this.getOrderList("topick");
        break;
      case '4':
        this.setData({
          currentTab: 4
        })
        this.getOrderList("finished");
        break;
    }
  }
})
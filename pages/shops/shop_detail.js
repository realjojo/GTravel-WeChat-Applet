// pages/shops/shop_detail.js
var app = getApp()
var service = app.globalData.service;
var all_numb = 0;
var my_order = new Array();
var shopId = "", seller_id = "", shopName = "";

Page({
  data: {
    shop_desc: "",
    shop_url: "",
    shop_coupon: "",
    menu: [],
    selected: 0,
    cost: 0,
    all_num: 0
  },

  addToTrolley: function (e) {
    var info = this.data.menu;
    all_numb = this.data.all_num;
    info[this.data.selected].menuContent[e.currentTarget.dataset.index].numb++;
    all_numb++;
    this.setData({
      cost: this.data.cost + this.data.menu[this.data.selected].menuContent[e.currentTarget.dataset.index].price,
      menu: info,
      all_num: all_numb
    })
  },

  removeFromTrolley: function (e) {
    var info = this.data.menu;
    all_numb = this.data.all_num;
    if (info[this.data.selected].menuContent[e.currentTarget.dataset.index].numb != 0) {
      info[this.data.selected].menuContent[e.currentTarget.dataset.index].numb--;
      all_numb--;
      this.setData({
        cost: this.data.cost - this.data.menu[this.data.selected].menuContent[e.currentTarget.dataset.index].price,
        menu: info,
        all_num: all_numb
      })
    }
  },

  turnMenu: function (e) {
    this.setData({
      selected: e.currentTarget.dataset.index
    })
    console.log(e.currentTarget.dataset.index);
  },

  pay: function () {
    var that = this;
    my_order.length = 0;
    if (this.data.cost != 0) {
      var menu_copy = this.data.menu;
      var goods = "";
      for (var x in menu_copy) {
        goods = menu_copy[x].menuContent;
        for (var y in goods)
          if (goods[y].numb != 0) {
            var obj = { bought_num: "", description: "", goods_name: "", goods_number: "", goods_type: "", id: "", picture_url: "", price: "", seller_id: "" }
            obj.bought_num = goods[y].numb;
            obj.description = goods[y].desc;
            obj.goods_name = goods[y].name;
            obj.goods_number = goods[y].left_num;
            obj.id = goods[y].g_id;
            obj.goods_type = goods[y].gtype;
            obj.picture_url = goods[y].src;
            obj.price = goods[y].price;
            obj.seller_id = goods[y].seller_id;
            my_order.push(obj)
          }
      }
      console.log(my_order)
      wx.request({
        url: service + '/order/clearing?user_id=' + app.globalData.userInfo.uid + '&seller_id=' + seller_id,
        method: 'POST',
        data: my_order,
        header: {
          'content-type': 'application/json'
        },
        success: function (res) {
          console.log(res)
          if (res.statusCode == 200) {
            wx.setStorage({
              key: 'order_info',
              data: res.data,
              success: function () {
                wx.setStorage({
                  key: 'cur_order',
                  data: my_order,
                  success: function () {
                    wx.navigateTo({
                      url: 'order_confirm?shopId=' + shopId + '&shopName=' + shopName + '&all_numb=' + all_numb + '&sum_price=' + that.data.cost
                    })
                  }
                })
              }
            })
          }
        }
      })
    }
  },

  couponList: function () {
    wx.navigateTo({
      url: '../user/my_coupon?type=shop&shopName=' + shopName,
    })
  },

  onLoad: function (options) {
    var that = this;
    shopId = options.shop_id;
    wx.request({
      url: service + '/shops/' + shopId,
      method: 'GET',
      success: function (res) {
        if (res.statusCode == 200) {
          console.log(res.data)
          shopName = res.data.shopInfo.shop_name;
          var goods = res.data.goodsInfo, shop = res.data.shopInfo;
          var types = new Array();
          var flag1 = false, flag2 = false;
          var menus = new Array();
          var final_menu = new Array();
          var coupon = new Array(), str = "";
          var str0 = "";
          for (var i in goods) {
            var good = { g_id: "", gtype: "", name: "", numb: 0, price: "", desc: "", sales: 0, src: "", left_num: "", seller_id: "" }
            for (var j in types) {
              if (types[j] == goods[i].goods_type) {
                flag1 = true;
              }
            }
            if (flag1 == false) {
              types.push(goods[i].goods_type);
            }
            good.g_id = goods[i].id;
            good.gtype = goods[i].goods_type;
            good.name = goods[i].goods_name;
            good.price = goods[i].price;
            good.desc = goods[i].description;
            if (goods[i].bought_num != null) {
              good.sales = goods[i].bought_num;
            }
            str0 = goods[i].picture_url.split("://");
            if (str0[0] == "http") {
              good.src = goods[i].picture_url;
            } else {
              good.src = service + "/" + goods[i].picture_url;
            }
            good.left_num = goods[i].goods_number;
            good.seller_id = goods[i].seller_id;
            seller_id = goods[i].seller_id;
            menus.push(good);
          }
          for (var m in types) {
            var menu_item = { typeName: "", menuContent: [] };
            for (var n in menus) {
              if (menus[n].gtype == types[m]) {
                menu_item.typeName = types[m];
                menu_item.menuContent.push(menus[n]);
              }
            }
            final_menu.push(menu_item);
          }
          wx.setStorage({
            key: 'shop_coupon',
            data: shop.coupons
          })
          for (var a in shop.coupons) {
            for (var b in coupon) {
              if (shop.coupons[a].coupon_name == coupon[b]) {
                flag2 = true
              }
            }
            if (flag2 == false) {
              coupon.push(shop.coupons[a].coupon_name)
            }
          }
          for (var c in coupon) {
            str = str + coupon[c] + "；"
          }
          wx.setNavigationBarTitle({
            title: shopName,
          })
          that.setData({
            menu: final_menu,
            shop_desc: shop.shop_type,
            shop_url: shop.poster_url,
            shop_coupon: str
          })
        }
      }
    })
  },

  onShow: function () {
    var pages = getCurrentPages()
    var lastpage = pages[pages.length - 2];
    if (lastpage.data.froms == "sta_shops") {
      all_numb = 0;
    } else if (lastpage.data.froms == "order") {
      all_numb = lastpage.data.sum_num;
    }
  }
})
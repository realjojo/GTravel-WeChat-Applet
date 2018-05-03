// pages/shops/sta_shops.js
var app = getApp()
var service = app.globalData.service;
var keywords;
var label0 = "intelli", label1 = "150", label2 = "15000", sta;

Page({
  data: {
    stations: [],
    choice1: 0,
    choice2: 0,
    choice3: 0,
    tabTxt: ["综合排序", "不限价格", "不限距离"],
    general_list: [
      { id: 0, name: "综合排序", label: "intelli" },
      { id: 1, name: "距离优先", label: "distance" },
      { id: 2, name: "热门优先", label: "conmment" },
      { id: 3, name: "低价优先", label: "price" }],
    price_list: [
      { id: 0, name: "不限价格", label: "" },
      { id: 1, name: "小于50元", label: "50" },
      { id: 2, name: "小于100元", label: "100" },
      { id: 3, name: "小于150元", label: "150" },
      { id: 4, name: "150元以上", label: "" }],
    distance_list: [
      { id: 0, name: "不限距离", label: "" },
      { id: 1, name: "小于5km", label: "5000" },
      { id: 2, name: "小于10km", label: "10000" },
      { id: 3, name: "小于15km", label: "15000" },
      { id: 4, name: "15km以上", label: "" }],
    tab: [true, true, true],
    froms: "sta_shops"
  },

  // 选项卡
  filterTab: function (e) {
    var data = [true, true, true];
    var index = e.currentTarget.dataset.index;
    data[index] = !this.data.tab[index];
    this.setData({
      tab: data
    })
  },

  //筛选项点击操作
  filter: function (e) {
    var that = this, id = e.currentTarget.dataset.id, txt = e.currentTarget.dataset.txt, label = e.currentTarget.dataset.label, tabTxt = this.data.tabTxt;
    switch (e.currentTarget.dataset.index) {
      case '0':
        tabTxt[0] = txt;
        label0 = label;
        that.setData({
          tab: [true, true, true],
          tabTxt: tabTxt,
          choice1: id
        });
        break;
      case '1':
        tabTxt[1] = txt;
        label1 = label;
        that.setData({
          tab: [true, true, true],
          tabTxt: tabTxt,
          choice2: id
        });
        break;
      case '2':
        tabTxt[2] = txt;
        label2 = label;
        that.setData({
          tab: [true, true, true],
          tabTxt: tabTxt,
          choice3: id
        });
        break;
    }
    that.getData(label0, label1, label2, sta);
  },

  getData: function (l0, l1, l2, sta) {
    var that = this;
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: service + '/search/keywordSearch',
      method: 'POST',
      data: {
        user_query: keywords,
        search_type: l0,
        dis_filter: l2,
        price_filter: l1,
        sub_station: sta
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        console.log(res)
        if (res.statusCode == 200) {
          that.dataFormat(res.data);
        }
      }
    })
  },

  dataFormat: function (data) {
    var that = this;
    var i = 0, str, s, obj;
    var stations = new Array();
    for (var key in data) {
      var station = { flag: "", sta: "", num: "", fold_url: "/resources/fold.png", isfold: true, shops: [] };
      obj = data[key];
      station.flag = i;
      station.sta = key;
      station.num = "附近有" + obj.length + "家相关商家";
      for (var j = 0; j < obj.length; j++) {
        var shop = { seller_id: "", shop_id: "", name: "", url: "", s1: "", s2: "", comment: "", price: "", desc1: "", desc2: "" };
        shop.seller_id = obj[j].seller_id;
        shop.shop_id = obj[j].shop_id;
        shop.name = obj[j].shop_name;
        shop.price = "￥" + obj[j].ave_price + "/人";
        shop.url = obj[j].img_url;
        shop.s1 = Math.round(Number(obj[j].star_num));
        shop.s2 = 5 - shop.s1;
        shop.desc1 = obj[j].addr;
        str = obj[j].distance.split(".");
        s = str[0] / 1000;
        shop.desc2 = "距您" + s.toFixed(2) + "km";
        shop.comment = obj[j].comment_num + "条评论";
        station.shops.push(shop);
      }
      stations.push(station);
      i++;
    }
    that.setData({
      stations: stations
    })
    wx.hideLoading();
  },

  fold: function (e) {
    var that = this;
    var f = "stations[" + e.currentTarget.id + "].isfold";
    var url = "stations[" + e.currentTarget.id + "].fold_url";
    switch (that.data.stations[e.currentTarget.id].isfold) {
      case true:
        that.setData({
          [f]: false,
          [url]: "/resources/unfold.png"
        })
        break;
      case false:
        that.setData({
          [f]: true,
          [url]: "/resources/fold.png"
        })
        break;
    }
  },

  click_shop: function (e) {
    wx.navigateTo({
      url: 'shop_detail?shop_id=' + e.currentTarget.id,
    })
  },

  onLoad: function (options) {
    var that = this;
    sta = options.sta;
    wx.getStorage({
      key: 'keywords',
      success: function (res) {
        keywords = res.data;
        that.getData("intelli", "150", "15000", sta);
      },
    })
  }
})
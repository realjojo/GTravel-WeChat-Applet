var app = getApp()
var service = app.globalData.service;
var line_colors = ["#edec8e", "#77a9cf", "#f6c6a1", "#ff8692", "#88bba5", "#d77693", "#81225b", "#8fc840", "#188e92", "#c4da2e", "#15a7df"]; //广州地铁线路颜色

function formRouteData(res, hot, meet, mtype) {
  var data = { s: "", e: "", s_line: "", s_num: "", s_color: "", e_line: "", e_color: "" };
  var lines = new Array();
  var route = res.route;
  var detail = res.route_detail;
  var length = (detail.length + 1) / 2;
  var count = 0, str = "";
  var datas = { data: "", lines: [] };
  data.s = route[0];
  data.s_line = route[1];
  str = route[1].split("线");
  data.s_color = chooseColor(str[0]);
  data.e = route[res.route.length - 1];
  data.e_line = route[res.route.length - 2];
  str = route[route.length - 2].split("线");
  data.e_color = chooseColor(str[0]);
  for (var i = 0; i < length; i++) {
    var sta = { time: "", sta: "", show: false, change_sta: "", change_line: "", change_num: "", color: "", change_color: "", gather: "", hot: false };
    sta.sta = detail[2 * i];
    if (i != 0) {
      str = detail[2 * i - 1].split("线");
      sta.color = chooseColor(str[0]);
    }
    if (detail[2 * i - 1] != detail[2 * i + 1]) {
      if (2 * i + 1 < detail.length) {
        sta.show = true;
        sta.change_sta = detail[2 * i];
        sta.change_line = detail[2 * i + 1];
        str = detail[2 * i + 1].split("线");
        sta.change_color = chooseColor(str[0]);
        for (var j = i + 1; j < length; j++) {
          if (detail[2 * i + 1] != detail[2 * j + 1]) {
            break;
          } else {
            count++;
          }
        }
        sta.change_num = count + 1;
        count = 0;
      }
    }
    if (mtype == "m1" || mtype == "m2" || mtype == "m3") {
      if (sta.sta == meet) {
        sta.gather = "(汇合点)"
      }
    }
    for (var key in hot) {
      if (key == sta.sta) {
        sta.hot = true;
      }
    }
    if (i == 0) {
      data.s_num = sta.change_num;
    } else if (i < length - 1) {
      lines.push(sta);
    }
  }
  datas.data = data;
  datas.lines = lines;
  return datas;
}

function formMultiArr(res, num) {
  var r1 = { route: [], route_detail: [] }, r2 = { route: [], route_detail: [] }, r3 = { route: [], route_detail: [] }, r = { route: [], route_detail: [] }, meet = "";
  var arr = { r1: "", r2: "", r3: "", meet: "", busy: "" };
  r1.route = res.data.routes[0][0].route;
  r1.route_detail = res.data.routes[0][0].route_detail;
  if (num == 2) {
    r2.route = res.data.routes[0][1].route;
    r2.route_detail = res.data.routes[0][1].route_detail;
  }
  if (num == 3) {
    r2.route = res.data.routes[0][1].route;
    r2.route_detail = res.data.routes[0][1].route_detail;
    r3.route = res.data.routes[0][2].route;
    r3.route_detail = res.data.routes[0][2].route_detail;
  }
  if (res.data.routes[1][0] != undefined) {
    r.route = res.data.routes[1][0].route;
    r.route_detail = res.data.routes[1][0].route_detail;
    r1.route.pop();
    r1.route_detail.pop();
    r1.route = r1.route.concat(r.route);
    r1.route_detail = r1.route_detail.concat(r.route_detail);
    if (num == 2) {
      r2.route.pop();
      r2.route_detail.pop();
      r2.route = r2.route.concat(r.route);
      r2.route_detail = r2.route_detail.concat(r.route_detail);
    }
    if (num == 3) {
      r2.route.pop();
      r2.route_detail.pop();
      r2.route = r2.route.concat(r.route);
      r2.route_detail = r2.route_detail.concat(r.route_detail);
      r3.route.pop();
      r3.route_detail.pop();
      r3.route = r3.route.concat(r.route);
      r3.route_detail = r3.route_detail.concat(r.route_detail);
    }
  }
  arr.meet = res.data.meet;
  arr.busy = res.data.busy;
  arr.r1 = r1;
  arr.r2 = r2;
  arr.r3 = r3;
  return arr;
}

function formRDArray(res) {
  var length = (res.length + 1) / 2;
  var arr = new Array();
  for (var i = 0; i < length; i++) {
    arr.push(res[2 * i]);
  }
  console.log(arr);
  return arr;
}

function routePos(pos, route) {
  var arr = new Array();
  var data = { start: { lat: "", lng: "" }, end: { lat: "", lng: "" }, arr: [] };
  for (var i in route) {
    var obj = { latitude: "", longitude: "" };
    obj.latitude = pos[route[i]][0];
    obj.longitude = pos[route[i]][1];
    arr.push(obj);
  }
  data.start.lat = pos[route[0]][0];
  data.start.lng = pos[route[0]][1];
  data.end.lat = pos[route[route.length - 1]][0];
  data.end.lng = pos[route[route.length - 1]][1];
  data.arr = arr;
  return data;
}

function chooseColor(str) {
  switch (str) {
    case "一号":
      return line_colors[0];
      break;
    case "二号":
      return line_colors[1];
      break;
    case "三号":
      return line_colors[2];
      break;
    case "三北":
      return line_colors[3];
      break;
    case "四号":
      return line_colors[4];
      break;
    case "五号":
      return line_colors[5];
      break;
    case "六号":
      return line_colors[6];
      break;
    case "七号":
      return line_colors[7];
      break;
    case "八号":
      return line_colors[8];
      break;
    case "广佛":
      return line_colors[9];
      break;
    case "APM":
      return line_colors[10];
      break;
  }
}

function chooseLine(str) {
  switch (str) {
    case "一号":
      return 1;
      break;
    case "二号":
      return 2;
      break;
    case "三号":
      return 3;
      break;
    case "三北":
      return 4;
      break;
    case "四号":
      return 5;
      break;
    case "五号":
      return 6;
      break;
    case "六号":
      return 7;
      break;
    case "七号":
      return 8;
      break;
    case "八号":
      return 9;
      break;
    case "广佛":
      return 10;
      break;
    case "APM":
      return 11;
      break;
  }
}

function formSeller(res) {
  var sta = "", str = "";
  var arr = new Array();
  for (var i in res) {
    sta = res[i];
    var obj = { sta: "", shops: [] };
    for (var j in sta) {
      sta[j].s1 = Math.round(Number(sta[j].star_num));
      sta[j].s2 = 5 - sta[j].s1;
      sta[j].comment = sta[j].comment_num + "条评论";
      sta[j].ave_price = "￥" + sta[j].ave_price + "/人";
      var a = [];
      str = sta[j].tag.split("+");
      for (var m in str) {
        a.push(str[m]);
      }
      a.push(sta[j].shop_type);
      sta[j].tags = a;
    }
    obj.sta = i;
    obj.shops = sta;
    arr.push(obj);
  }
  return arr;
}

module.exports = {
  formRouteData: formRouteData,
  formMultiArr: formMultiArr,
  chooseColor: chooseColor,
  chooseLine: chooseLine,
  formRDArray: formRDArray,
  routePos: routePos,
  formSeller: formSeller
}
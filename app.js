//app.js
App({
  onLaunch: function () {
    var that = this;
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (!res.authSetting['scope.userLocation']) {
          wx.authorize({
            scope: 'scope.userLocation',
            success() {
              // 用户已经同意小程序使用位置功能，后续调用 wx.getLocation 接口不会弹窗询问
              console.log("已获取位置权限")
            },
            fail() {
              that.globalData.location = "no"
            }
          })
        }
      }
    })
  },

  globalData: {
    service: "https://service.gsubway.com",
    userInfo: {
      isLogin: "false",
      phone: "",
      name: "",
      avator: "/resources/default_user_img.png",
      avator_url: "",
      uid: "",
      token: "",
      default_phone: ""
    },
    location: "yes"
  }
})
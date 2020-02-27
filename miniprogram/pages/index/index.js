const App = getApp()

Page({
  data: {
    userInfo: {},
  },
  onLoad: function() {
    this.getUserInfo()
  },
  getUserInfo: function() {
    let userInfo = App.globalData.userInfo
    if(userInfo.nickName) {
      this.setData({
        logged: true,
        userInfo
      })
    }
  },
  onGetUserInfo: function(e) {
    if (e.detail.userInfo) {
      let userInfo = e.detail.userInfo;
      App.globalData.userInfo = userInfo
      App.getUserInfo((res)=>{
        this.setData({
          userInfo: res.userInfo
        })
      })
      wx.navigateTo({
        url: '/pages/classify/classify',
      })
    }
  }
})
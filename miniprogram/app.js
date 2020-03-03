App({
  onLaunch: function () {
    // 云开发环境初始化
    wx.cloud.init({
      env: "programmer-words-buq4u",
      traceUser: true
    })
    this.getUserInfo()
  },
  getUserInfo: function(cb) {
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          wx.getUserInfo({
            success: res => {
              this.getOpenid();
              this.globalData.userInfo = res.userInfo;
              typeof cb === 'function' && cb(res);
            }
          })
        }else{
          console.log('用户未授权');
        }
      }
    })
  },
  getOpenid: function(cb) {
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: (res) => {
        this.globalData.openid = res.result.openid
        typeof cb === 'function' && cb(res)
      },
      fail: err => {
        console.error('[云函数] [login] 调用失败', err)
      }
    })
  },
  globalData: {
    userInfo: {},
    openid: ''
  }
})

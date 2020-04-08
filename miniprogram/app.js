App({
  onLaunch: function () {
    // 云开发环境初始化
    wx.cloud.init({
      env: "programmer-words-buq4u",
      traceUser: true
    })
    this.getUserInfo()
    if (wx.canIUse('getUpdateManager')) {
      const updateManager = wx.getUpdateManager()
      updateManager.onCheckForUpdate(function (res) {
       console.log('onCheckForUpdate====', res)
       // 请求完新版本信息的回调
       if (res.hasUpdate) {
        updateManager.onUpdateReady(function () {
         wx.showModal({
          title: '更新提示',
          content: '新版本已经准备好，是否重启应用？',
          success: function (res) {
           // res: {errMsg: "showModal: ok", cancel: false, confirm: true}
           if (res.confirm) {
            // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
            updateManager.applyUpdate()
           }
          }
         })
        })
        updateManager.onUpdateFailed(function () {
         // 新的版本下载失败
         wx.showModal({
          title: '已经有新版本了哟~',
          content: '新版本已经上线啦~，请您删除当前小程序，重新搜索打开哟~'
         })
        })
       }
      })
     }
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

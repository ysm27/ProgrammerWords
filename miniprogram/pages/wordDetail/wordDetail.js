const db = wx.cloud.database()

Page({
  data: {
    wordId: '',
    word: '',
    record: {
      text: '长按录音',
      iconPath: '/images/record.png'
    },
    // 记录长按录音开始点信息,用于后面计算滑动距离
    startPoint: {},
    // 发送锁，当为true时上锁，false时解锁发送
    // sendLock: true
  },
  onLoad: function (options) {
    let wordId = options.id
    this.setData({ wordId })
    this.getWord()
  },
  getWord: function() {
    let wordId = this.data.wordId
    db.collection('words').where({
      _id: wordId
    }).get({
      success: (res) => {
        let word = res.data[0]
        this.setData({ word })
        wx.setNavigationBarTitle({
          title: word.name
        })
      }
    })
  },
  // 长按录音
  startRecord: function(e) {
    let startPoint = e.touches[0]
    let record = {
      text: '松开发送',
      iconPath: '/images/record_active.png'
    }
    this.setData({ 
      startPoint, record 
    })
    wx.getRecorderManager().start((res) => {
      console.log(res,'startRe')
    })
    wx.showToast({
      title: '正在录音，上划取消发送',
      icon: 'none',
      duration: 60000
    })
  },
  // 松开发送
  stopRecord: function() {
    let record = {
      text: '长按录音',
      iconPath: '/images/record.png'
    }
    this.setData({ record })
    wx.hideToast()
    let recorderManager = wx.getRecorderManager()
    recorderManager.onStop((res) => {
      const tempFilePath = res.tempFilePath
      console.log('endRe',tempFilePath)
    })
  },
  // 上划取消发送 
  handleTouchMove: function(e) {
    let moveLength = e.touches[e.touches.length - 1].clientY - this.data.startPoint
    if(Math.abs(moveLength) > 50) {
      wx.showToast({
        title: "松开手指,取消发送",
        icon: "none",
        duration: 60000
      })
    }else {
      wx.showToast({
            title: "正在录音，上划取消发送",
            icon: "none",
            duration: 60000
      });
    }
  }



  // startRecord: function() {
  //   wx.startRecord({
  //     success (res) {
  //       const tempFilePath = res.tempFilePath
  //       console.log(tempFilePath)
  //     }
  //   })
  //   setTimeout(function () {
  //     wx.stopRecord() 
  //   }, 10000)
  // },
  // stopRecord: function() {
  //   wx.stopRecord({
  //     success: (res) => {
  //       console.log(res)
  //     },
  //   })
  // }
})
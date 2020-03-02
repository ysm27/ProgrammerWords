const db = wx.cloud.database()
const App = getApp()
const recorderManager = wx.getRecorderManager()
const innerAudioContext = wx.createInnerAudioContext()

Page({
  data: {
    wordId: '',
    word: '',
    record: {
      text: '长按录音',
      iconPath: '/images/record.png'
    },
    startPoint: {},   // 记录长按录音开始点信息,用于后面计算滑动距离
    sendLock: true, //发送锁，当为true时上锁，false时解锁发送 
    userInfo: {},
    openid: '',
    pronunciation: []
  },
  onLoad: function (options) {
    let wordId = options.id
    let userInfo = App.globalData.userInfo
    let openid = App.globalData.openid
    this.setData({ wordId, userInfo, openid })
  },
  onShow: function() {
    this.getWord()
    this.getPronunciation()
  },
  // 获取单词信息
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
  // 获取录音
  getPronunciation: function() {
    let wordId = this.data.wordId
    db.collection('pronunciation').where({
      wordId: wordId
    }).get({
      success: (res) => {
        let pronunciation = res.data
        this.setData({ pronunciation })
      }
    })
  },
  // 长按录音
  startRecord: function(e) {
    let startPoint = e.touches[0] // 记录触摸点的坐标信息
    let sendLock = false
    let record = {
      text: '松开发送',
      iconPath: '/images/record_active.png'
    }
    this.setData({ 
      startPoint, sendLock, record
    })
    // 设置录音参数
    const options = {
      duration: 10000,
      sampleRate: 16000,
      numberOfChannels: 1,
    }
    recorderManager.start(options)
    wx.showToast({
      title: '正在录音，上划取消发送',
      icon: 'none',
      duration: 60000
    })
  },
  // 上划取消发送 
  handleTouchMove: function(e) {
    let moveLength = e.touches[e.touches.length - 1].clientY - this.data.startPoint.clientY
    if(Math.abs(moveLength) > 25) {
      wx.showToast({
        title: "松开手指,取消发送",
        icon: "none",
        duration: 60000
      })
      this.setData({ sendLock: true })
    }else {
      wx.showToast({
        title: "正在录音，上划取消发送",
        icon: "none",
        duration: 60000
      });
      this.setData({ sendLock: false })
    }
  },
  // 松开发送
  stopRecord: function() {  
    let that = this
    let sendLock = that.data.sendLock
    let record = {
      text: '长按录音',
      iconPath: '/images/record.png'
    }
    that.setData({ record })
    wx.hideToast()
    recorderManager.stop()
    recorderManager.onStop((res) => {
      if(!sendLock) {
        // 进行语音发送
        let userInfo = that.data.userInfo
        let openid = that.data.openid
        let wordId = that.data.wordId
        let tempFilePath  = res.tempFilePath
        let duration = res.duration
        let fileSize = res.fileSize
        wx.showLoading({
          title: '语音发送中',
        })
        db.collection('pronunciation').add({
          data: {
            userInfo, openid, wordId, tempFilePath, duration, fileSize
          },
          success: res => {
            let record = {
              text: '长按录音',
              iconPath: '/images/record.png'
            }
            that.setData({ record })
            wx.showToast({
              title: '录音成功',
              icon: 'success'
            })
            that.onShow()
          },
          fail: err => {
            wx.showToast({
              icon: 'none',
              title: '录音上传失败'
            })
          },
          complete: () => {
            wx.hideLoading()
          }
        })
      }else{
        wx.showToast({
          title: '取消发送',
          icon: 'none'
        })
      }
    })
  },
  // 播放录音
  playVoice: function(e) {
    let index = e.currentTarget.dataset.index
    let pronunciation = this.data.pronunciation
    let filePath = pronunciation[index].tempFilePath
    innerAudioContext.src = filePath
    innerAudioContext.play()
  },
  // 删除录音
  handleDelete: function(e) {
    let that = this
    let id = e.currentTarget.dataset.id
    db.collection('pronunciation').doc(id).remove({
      success: function(res) {
        wx.showToast({
          title: '删除成功',
          icon: 'success'
        })
        that.onShow()
      }
    })
  }
})
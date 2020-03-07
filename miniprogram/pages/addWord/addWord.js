const db = wx.cloud.database()

Page({
  data: {
    name: '',
    pronunciation: '',
    translation: '',
    description: '',
    classifyId: ''
  },
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '添加单词'
    })
    let classifyId = options.classifyId
    this.setData({ classifyId })
  },
  handleName: function(e) {
    let name = e.detail.value.trim()
    this.setData({ name })
  },
  handlePronun: function(e) {
    let pronunciation = e.detail.value.trim()
    this.setData({ pronunciation })
  },
  handleTrans: function(e) {
    let translation = e.detail.value.trim()
    this.setData({ translation })
  },
  handleDesc: function(e) {
    let description = e.detail.value.trim()
    this.setData({ description })
  },
  handleSubmit: function() {
    let name = this.data.name
    let pronunciation = this.data.pronunciation
    let translation = this.data.translation
    let description = this.data.description
    let classifyId = this.data.classifyId
    if(!name || !classifyId) {
      wx.showToast({
        title: '请输入单词名称',
        icon: 'none'
      })
      return
    }
    db.collection('words').add({
      data: {
        name, pronunciation, translation, description, classifyId
      },
      success: (res) => {
        wx.reLaunch({
          url: '/pages/wordList/wordList?id=' + classifyId,
        })
      },
      fail: err => {
        wx.showToast({
          title: '添加单词失败',
          icon: 'none'
        })
      }
    })
  }
})
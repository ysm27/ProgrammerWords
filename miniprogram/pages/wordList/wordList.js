const db = wx.cloud.database()
const innerAudioContext = wx.createInnerAudioContext()

Page({
  data: {
    classifyId: '',
    words: [],
    develop: false
  },
  onLoad: function (options) {
    let classifyId = options.id
    this.setData({ classifyId })
    this.getClassifyName()
    this.getWords()
    wx.showLoading({
      title: '玩命加载中～',
      mask: true
    })
    wx.showShareMenu({
      withShareTicket: true
    })
  },
  onHide: function(){
    innerAudioContext.stop()
  },
  // 获取分类名称
  getClassifyName: function() {
    let classifyId = this.data.classifyId
    db.collection('classify').where({
      _id: classifyId
    }).get({
      success: (res) => {
        let classifyName = res.data[0].value
        wx.setNavigationBarTitle({
          title: classifyName,
        })
      }
    })
  },
  // 获取单词数据
  getWords: function() {
    let that = this
    wx.cloud.callFunction({
      name: 'getWords',
      data: {},
      success(res) {
        let classifyId = that.data.classifyId
        let wordsData = res.result.data
        let words = wordsData.filter(data => {
        return data.classifyId == classifyId
        })
        let length = words.length
        words.forEach(data => {
          data.change = 'front'
        })
        db.collection('classify').doc(classifyId).update({
          data: {
            length
          }
        })
        that.setData({ words })
        wx.hideLoading()
      }
    })
  },
  // 单击单词，使其翻转背面显示其他信息，同时发音
  handleChange: function(e) {
    let index = e.currentTarget.dataset.index
    let wordId = e.currentTarget.dataset.id
    let words = this.data.words
    words[index].change = 'back'
    this.setData({ words })
    db.collection('words').where({
      _id: wordId
    }).get({
      success: (res) => {
        let wordData = res.data
        let word = wordData[0]
        let wordName = word.name
        innerAudioContext.src = 'http://dict.youdao.com/speech?audio='+wordName
        innerAudioContext.play()
      }
    })
  },
   // 播放喇叭声音
   playVoice: function(e) {
    let wordId = e.currentTarget.dataset.id
    db.collection('words').where({
      _id: wordId
    }).get({
      success: (res) => {
        let wordData = res.data
        let word = wordData[0]
        let wordName = word.name
        innerAudioContext.src = 'http://dict.youdao.com/speech?audio='+wordName
        innerAudioContext.play()
      }
    })
  },
  // 再单击单词，使其翻转至正面
  handleBackFront: function(e) {
    let index = e.currentTarget.dataset.index
    let words = this.data.words
    words[index].change = 'front'
    this.setData({ 
      words
    })
  },
  // 点击添加按钮
  handleAdd: function() {
    let classifyId = this.data.classifyId
    wx.navigateTo({
      url: '/pages/addWord/addWord?classifyId=' + classifyId,
    })
  }
})
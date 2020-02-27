const db = wx.cloud.database()

Page({
  data: {
    classifyId: '',
    words: [],
  },
  onLoad: function (options) {
    let classifyId = options.id
    this.setData({ classifyId })
    this.getWords()
    this.getClassifyName()
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
    let classifyId = this.data.classifyId
    db.collection('words').where({
      classifyId: classifyId
    }).get({
      success: (res) => {
        let words = res.data
        words.forEach(data => {
          data.change = 'front'
        })
        this.setData({ words })
      }
    })
  },
  // 单击单词，使其翻转背面显示其他信息
  handleChange: function(e) {
    let index = e.currentTarget.dataset.index
    let words = this.data.words
    words[index].change = 'end'
    this.setData({ words })
  },
  // 再单击单词，使其翻转至正面
  handleBackFront: function(e) {
    let index = e.currentTarget.dataset.index
    let words = this.data.words
    words[index].change = 'front'
    this.setData({ words })
  },
  // 点击添加按钮
  handleAdd: function() {
    let classifyId = this.data.classifyId
    wx.navigateTo({
      url: '/pages/addWord/addWord?classifyId=' + classifyId,
    })
  }
})
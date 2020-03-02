const db = wx.cloud.database()

Page({
  data: {
    classify: [],
    develop: true
  },
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '程序员单词本'
    })
    this.getClassify()
  },
  getClassify: function() {
    db.collection('classify').get({
      success: res => {
        let classify = res.data
        this.setData({ classify })
      },
      fail: res => {
        wx.showToast({
          title: '数据获取失败',
          icon: 'none'
        })
      }
    })
  },
  handleAdd: function() {
    wx.navigateTo({
      url: '/pages/addClassify/addClassify',
    })
  }
})
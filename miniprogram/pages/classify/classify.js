const db = wx.cloud.database()

Page({
  data: {
    classify: [],
    develop: false
  },
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '码农单词本'
    })
    this.getClassify()
    wx.showLoading({
      title: '玩命加载中～',
      mask: true
    })
    wx.showShareMenu({
      withShareTicket: true
    })
  },
   // 获取分类
  getClassify: function() {
    db.collection('classify').get({
      success: res => {
        let classify = res.data
        this.setData({ classify })
        wx.hideLoading()
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
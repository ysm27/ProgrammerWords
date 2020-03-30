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
        classify[0].words = 28
        classify[1].words = 68
        classify[2].words = 52
        classify[3].words = 31
        classify[4].words = 41
        classify[0].src = '/images/card_1.png'
        classify[1].src = '/images/card_2.png'
        classify[2].src = '/images/card_3.png'
        classify[3].src = '/images/card_4.png'
        classify[4].src = '/images/card_1.png'
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
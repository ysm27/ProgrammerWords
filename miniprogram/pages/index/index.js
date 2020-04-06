const db = wx.cloud.database()

Page({
  data: {
    classify: [],
    classifyId: [],
    backgroundImages: ['/images/card_1.png', '/images/card_2.png', '/images/card_3.png', '/images/card_4.png'],
    zIndex: 3,
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
    let that = this
    db.collection('classify').get({
      success: res => {
        let classify = res.data
        classify.forEach((item,index) => {
          let zIndex = ++ that.data.zIndex
          let backgroundImages = that.data.backgroundImages
          let backgroundImage = backgroundImages[zIndex % backgroundImages.length];
          item.src = `${backgroundImage}`
        })
        that.setData({ classify })
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
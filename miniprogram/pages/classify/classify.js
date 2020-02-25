Page({
  data: {

  },
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '程序员单词课'
    })
  },
  handleAdd: function() {
    wx.navigateTo({
      url: '/pages/addClassify/addClassify',
    })
  }
})
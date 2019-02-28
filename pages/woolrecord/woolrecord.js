const app = getApp()
const baseUrl = app.globalData.baseUrl
Page({

  /**
   * 页面的初始数据
   */
  data: {
    openId: ' ',
    page: 2
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this
    that.setData({
      openId: wx.getStorageSync('openid')
    })
    wx.request({
      url: baseUrl + 'm=wttapi&a=yangmaolist',
      method: 'POST',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      data: {
        openid: that.data.openId
      },
      success: function(res) {
        that.setData({
          cur_integral: res.data.cur_integral,
          totalyangmao: res.data.totalyangmao,
          usedyangmao: res.data.usedyangmao,
          woolList: res.data.data
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    var that = this
    wx.request({
      url: baseUrl + 'm=wttapi&a=yangmaolist',
      method: 'POST',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      data: {
        openid: that.data.openId
      },
      success: function(res) {
        that.setData({
          cur_integral: res.data.cur_integral,
          totalyangmao: res.data.totalyangmao,
          usedyangmao: res.data.usedyangmao,
          woolList: res.data.data
        })
        wx.stopPullDownRefresh();
      }
    })
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    var that = this
    wx.request({
      url: baseUrl + 'm=wttapi&a=yangmaolist',
      method: 'POST',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      data: {
        openid: that.data.openId,
        page: that.data.page
      },
      success: function(res) {
        var newContent = that.data.woolList.concat(res.data.data)
        that.setData({
          woolList: newContent,
          page: that.data.page * 1 + 1
        })
      },
      fail: function(res) {
        wx.showToast({
          title: '数据异常',
          icon: 'none'
        })
      }
    })
  },
  /**
   * 用户点击右上角分享
   */
  // onShareAppMessage: function () {

  // }
})
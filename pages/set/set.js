// pages/user/user.js
const app = getApp()
const baseUrl = app.globalData.baseUrl
Page({

  /**
   * 页面的初始数据
   */
  data: {
    log_status: '0',
    avatar_url: '',
    nickName: ''
  },
  toDaytask: function(e) {
    wx.navigateTo({
      url: '../dailytask/dailytask',
    })
  },
  toSignin: function (e) {
    wx.navigateTo({
      url: '../signin/signin',
    })
  },
  toWools: function (e) {
    wx.navigateTo({
      url: '../woolrecord/woolrecord',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this
    if (wx.getStorageSync('avatar') != '') {
      this.setData({
        avatar_url: wx.getStorageSync('avatar'),
        nickName: wx.getStorageSync('nickname'),
        openId: wx.getStorageSync('openid')
      })
    }
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
    var that=this
    wx.request({
      url: baseUrl + 'm=wttapi&a=getuserinfo',
      method: "POST",
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      data: {
        openid: that.data.openId
      },
      success: function (res) {
        that.setData({
          lianxu: res.data.data.lianxu,
          yangmao: res.data.data.yangmao,
          yaoqing: res.data.data.yaoqing,
        })
      }
    })
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
      url: baseUrl + 'm=wttapi&a=getuserinfo',
      method: "POST",
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      data: {
        openid: that.data.openId
      },
      success: function (res) {
        that.setData({
          lianxu: res.data.data.lianxu,
          yangmao: res.data.data.yangmao,
          yaoqing: res.data.data.yaoqing,
        })
        wx.stopPullDownRefresh();
      }
    })
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  // onShareAppMessage: function() {

  // }
})
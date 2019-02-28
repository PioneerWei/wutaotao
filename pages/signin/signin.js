const app = getApp()
const baseUrl = app.globalData.baseUrl
Page({

  /**
   * 页面的初始数据
   */
  data: {
    openId: ' ',
    min: 1,
  },
  signIn: function(e) {
    var that = this
    wx.request({
      url: baseUrl + 'm=wttapi&a=qiandao',
      method: 'POST',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      data: {
        openid: that.data.openId
      },
      success: function(res) {
        that.setData({
          qiandao: res.data.qiandao
        })
        if (res.data.code) {
          that.setData({
            signinBtn: false,
            signinText: '今日已签到'
          })
        } else {
          that.setData({
            signinBtn: true,
            signinText: '立即签到'
          })
        }
      }
    })
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
      url: baseUrl + 'm=wttapi&a=is_qiandao',
      method: 'POST',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      data: {
        openid: that.data.openId
      },
      success: function(res) {
        that.setData({
          qiandao: res.data.qiandao
        })
        if (res.data.code) {
          that.setData({
            signinBtn: false,
            signinText: '今日已签到'
          })
        } else {
          that.setData({
            signinBtn: true,
            signinText: '立即签到'
          })
        }
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
      url: baseUrl + 'm=wttapi&a=is_qiandao',
      method: 'POST',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      data: {
        openid: that.data.openId
      },
      success: function(res) {
        that.setData({
          qiandao: res.data.qiandao
        })
        if (res.data.code == 0) {
          that.setData({
            signinBtn: true,
            signinText: '立即签到'
          })
        } else if (res.data.code == 1) {
          that.setData({
            signinBtn: false,
            signinText: '今日已签到'
          })
        }
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
  // onShareAppMessage: function () {

  // }
})
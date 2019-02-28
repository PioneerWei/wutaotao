const app = getApp()
const baseUrl = app.globalData.baseUrl
Page({

  /**
   * 页面的初始数据
   */
  data: {
    openId: ' ',
    collectList: [],
    isGuoqi: false,
    page: 2,
    showEmpty: false,
    isLoading: false,
    isloadingMore: false
  },
  toDetails: function(e) {
    var pid = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '../categorydetails/categorydetails?id=' + pid,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this
    this.setData({
      openId: wx.getStorageSync('openid')
    })
    wx.request({
      url: baseUrl + 'm=wttapi&a=favlist',
      method: 'POST',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      data: {
        openid: that.data.openId
      },
      success: function(res) {
        that.setData({
          collectList: res.data.data,
          isLoading: true
        })
        if (res.data.data == 0) {
          that.setData({
            showEmpty: true
          })
        } else {
          that.setData({
            showEmpty: false
          })
        }
        if (res.data.data.length < 20) {
          that.setData({
            isloadingText: true
          })
        } else {
          that.setData({
            isloadingText: false
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
      url: baseUrl + 'm=wttapi&a=favlist',
      method: 'POST',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      data: {
        openid: that.data.openId
      },
      success: function(res) {
        that.setData({
          collectList: res.data.data
        })
        if (res.data.data == 0) {
          that.setData({
            showEmpty: true
          })
        } else {
          that.setData({
            showEmpty: false
          })
        }
        if (res.data.data.length < 20) {
          that.setData({
            isloadingText: true
          })
        } else {
          that.setData({
            isloadingText: false
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
    var that = this
    if (that.data.collectList.length >= 20) {
      setTimeout(function() {
        that.setData({
          isloadingMore: true
        })
        wx.request({
          url: baseUrl + 'm=wttapi&a=favlist',
          method: 'POST',
          header: {
            "Content-Type": "application/x-www-form-urlencoded"
          },
          data: {
            openid: that.data.openId,
            page: that.data.page
          },
          success: function(res) {
            var newContent = that.data.collectList.concat(res.data.data)
            that.setData({
              collectList: newContent,
              page: that.data.page * 1 + 1,
              isloadingMore: false
            })
            if (res.data.data.length != 0) {
              that.setData({
                isloadingText: false
              })
            } else {
              that.setData({
                isloadingText: true
              })
            }
          },
          fail: function(res) {
            wx.showToast({
              title: '数据异常',
              icon: 'none'
            })
          }
        })
      }, 1000)
    }
  },

  /**
   * 用户点击右上角分享
   */
  // onShareAppMessage: function () {

  // }
})
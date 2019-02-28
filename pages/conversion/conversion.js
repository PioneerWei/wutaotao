const app = getApp()
const baseUrl = app.globalData.baseUrl
Page({

  /**
   * 页面的初始数据
   */
  data: {
    conversionLi:[],
    status: ' ',
    statusshow: ' ',
    page:2,
    isLoading:false,
    isloadingMore:false
  },
  contoCondeta:function(e){
    var pid = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '../conversiondetails/conversiondetails?id=' + pid,
    })
  },
  toTask:function(e){
    wx.navigateTo({
      url: '../dailytask/dailytask',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
    wx.request({
      url: baseUrl+'m=wttapi&a=duihuanlist',
      method:'POST',
      header:{
        "Content-Type": "application/x-www-form-urlencoded"
      },
      data:{
        openid: wx.getStorageSync('openid')
      },
      success:function(res){
        that.setData({
          conversionLi: res.data.data,
          yangmao: res.data.yangmao,
          isLoading: true
        })
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
  onReady: function () {
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    var that = this;
    wx.request({
      url: baseUrl + 'm=wttapi&a=duihuanlist',
      method: 'POST',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      data: {
        openid: wx.getStorageSync('openid')
      },
      success: function (res) {
        that.setData({
          conversionLi: res.data.data,
          yangmao: res.data.yangmao
        })
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
  onReachBottom: function () {
    var that = this
    if (that.data.conversionLi.length >= 20){
      setTimeout(function () {
        that.setData({
          isloadingMore: true
        })
        wx.request({
          url: baseUrl + 'm=wttapi&a=duihuanlist',
          method: 'POST',
          header: {
            "Content-Type": "application/x-www-form-urlencoded"
          },
          data: {
            page: that.data.page
          },
          success: function (res) {
            var newContent = that.data.conversionLi.concat(res.data.data)
            that.setData({
              conversionLi: newContent,
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
          fail: function (res) {
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
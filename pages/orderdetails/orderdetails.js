const app = getApp()
const baseUrl = app.globalData.baseUrl
Page({

  /**
   * 页面的初始数据
   */
  data: {
    openId: ' ',
    orderid: ' '
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this
    that.setData({
      openId: wx.getStorageSync('openid'),
      orderid: options.id
    })
    wx.request({
      url: baseUrl + 'm=wttapi&a=orderinfo',
      method: 'POST',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      data: {
        openid: that.data.openId,
        orderid: that.data.orderid
      },
      success: function(res) {
        that.setData({
          address_name: res.data.data.address_name,
          address_telephone: res.data.data.address_telephone,
          address_address: res.data.data.address_address,
          title: res.data.data.title,
          shengyu_yangmao: res.data.data.shengyu_yangmao,
          image: res.data.data.image,
          dateline: res.data.data.dateline,
          address_telephone: res.data.data.address_telephone,
          orderno: res.data.data.orderno,
          yangmao: res.data.data.yangmao,
          status: res.data.data.status,
          wuliu_company: res.data.data.wuliu_company,
          wuliu_sno: res.data.data.wuliu_sno
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
      url: baseUrl + 'm=wttapi&a=orderinfo',
      method: 'POST',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      data: {
        openid: that.data.openId,
        orderid: that.data.orderid
      },
      success: function(res) {
        that.setData({
          address_name: res.data.data.address_name,
          address_telephone: res.data.data.address_telephone,
          address_address: res.data.data.address_address,
          title: res.data.data.title,
          shengyu_yangmao: res.data.data.shengyu_yangmao,
          image: res.data.data.image,
          dateline: res.data.data.dateline,
          address_telephone: res.data.data.address_telephone,
          orderno: res.data.data.orderno,
          yangmao: res.data.data.yangmao,
          status: res.data.data.status,
          wuliu_company: res.data.data.wuliu_company,
          wuliu_sno: res.data.data.wuliu_sno

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
  // onShareAppMessage: function () {

  // }
})
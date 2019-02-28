const app = getApp()
const baseUrl = app.globalData.baseUrl
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pid: ' ',
    status: ' ',
    avatar: ' '
  },
  converBtn: function(e) {
    var that = this
    this.setData({
      openId: wx.getStorageSync('openid')
    })
    wx.request({
      url: baseUrl + 'm=wttapi&a=duihuan',
      method: 'POST',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      data: {
        pid: that.data.pid,
        openid: that.data.openId
      },
      success: function(res) {
        if (that.data.status == 1) {
          switch (res.data.code) {
            case 0:
              wx.showToast({
                title: '用户未登录'
              })
              break;
            case -1:
              wx.showToast({
                title: '用户不存在'
              })
              break;
            case -2:
              wx.showToast({
                title: '抱歉，同一商品，每人每周限成功兑换一次',
                icon: 'none'
              })
              break;
            case -3:
              wx.showToast({
                title: '抱歉，您的羊毛余额不足，请继续加油',
                icon: 'none'
              })
              break;
            case -4:
              wx.showToast({
                title: '抱歉，您慢一步，当前商品已兑完',
                icon: 'none'
              })
              break;
            default:
              wx.navigateTo({
                url: '../confirmorder/confirmorder?id=' + that.data.pid,
              })
          }
        } else {
          wx.showToast({
            title: '不满足条件',
            icon: 'none'
          })
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    var pid = options.id;
    that.setData({
      pid: options.id
    })
    wx.request({
      url: baseUrl + 'm=wttapi&a=duihuandetail',
      method: 'POST',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      data: {
        pid: pid
      },
      success: function(res) {
        var avatar = []
        var detail_rich = res.data.data.detail.replace(/\<img/gi, '<img class="rich-img" ')
        that.setData({
          pro_name: res.data.data.pro_name,
          statusshow: res.data.data.statusshow,
          image: res.data.data.image,
          yangmao: res.data.data.yangmao,
          duihuan_rule: res.data.data.duihuan_rule,
          detail: detail_rich,
          status: res.data.data.status,
          shengyu_kucun: res.data.data.shengyu_kucun,
          xiaoliang: res.data.data.xiaoliang,
          goumai_avatar: res.data.data.goumai_avatar,
          avatarNumber: res.data.data.goumai_avatar.length
        })
        if (res.data.data.status == 0) {
          that.setData({
            sttusshow: "未开始"
          })
        }
        if (res.data.data.status == 1) {
          that.setData({
            sttusshow: "立即兑换"
          })
        }
        if (res.data.data.status == 2) {
          that.setData({
            sttusshow: "已兑完"
          })
        }
        if (res.data.data.goumai_avatar.length == 0) {
          that.setData({
            isShowDeta: true
          })
        } else {
          that.setData({
            isShowDeta: false
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
      url: baseUrl + 'm=wttapi&a=duihuandetail',
      method: 'POST',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      data: {
        pid: that.data.pid
      },
      success: function(res) {
        var avatar = []
        var detail_rich = res.data.data.detail.replace(/\<img/gi, '<img class="rich-img" ')
        that.setData({
          pro_name: res.data.data.pro_name,
          statusshow: res.data.data.statusshow,
          image: res.data.data.image,
          yangmao: res.data.data.yangmao,
          duihuan_rule: res.data.data.duihuan_rule,
          detail: detail_rich,
          status: res.data.data.status,
          shengyu_kucun: res.data.data.shengyu_kucun,
          xiaoliang: res.data.data.xiaoliang,
          goumai_avatar: res.data.data.goumai_avatar,
          avatarNumber: res.data.data.goumai_avatar.length
        })
        if (res.data.data.status == 0) {
          that.setData({
            sttusshow: "未开始"
          })
        }
        if (res.data.data.status == 1) {
          that.setData({
            sttusshow: "立即兑换"
          })
        }
        if (res.data.data.status == 2) {
          that.setData({
            sttusshow: "已兑完"
          })
        }
        if (res.data.data.goumai_avatar.length == 0) {
          that.setData({
            isShowDeta: true
          })
        } else {
          that.setData({
            isShowDeta: false
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
  // onShareAppMessage: function() {

  // }
})
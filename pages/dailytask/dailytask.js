const app = getApp()
const baseUrl = app.globalData.baseUrl
Page({

  /**
   * 页面的初始数据
   */
  data: {
    openId: ' '
  },
  //关注服务号
  attentService: function(e) {
    var that=this
    wx.navigateTo({
      url: '../attservice/attservice',
    })
  },
  //关注订阅号
  attentSubscr:function(e){
    wx.navigateTo({
      url: '../sersub/sersub',
    })
  },
  //去分享
  goShare:function(e){
    wx.navigateTo({
      url: '../everydayshare/everydayshare',
    })
  },
  //去阅读
  goRead:function(){
    wx.navigateTo({
      url: '../readinto/readinto',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this
    that.setData({
      openId: wx.getStorageSync('openid'),
      uid: wx.getStorageSync('uid')
    })
    wx.request({
      url: baseUrl + 'm=wttapi&a=getuserinfo',
      method: 'POST',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      data: {
        openid: that.data.openId
      },
      success: function(res) {
        that.setData({
          yangmao: res.data.data.yangmao
        })
      }
    })
    wx.request({
      url: baseUrl + 'm=wttapi&a=checkyangmao',
      method: 'POST',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      data: {
        openid: that.data.openId
      },
      success: function (res) {
        if (res.data.data[1]) {
          that.setData({
            isAttentSig: true,
            attentText3: '已签到'
          })
        } else {
          that.setData({
            isAttentSig: false,
            attentText3: '去签到'
          })
        }
        if(res.data.data[2]){
          that.setData({
            isAttentSer:true,
            attentText1:'已关注'
          })
        }else{
          that.setData({
            isAttentSer: false,
            attentText1: '去关注'
          })
        }
        if (res.data.data[3]) {
          that.setData({
            isAttentSub: true,
            attentText2: '已关注'
          })
        } else {
          that.setData({
            isAttentSub: false,
            attentText2: '去关注'
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
      url: baseUrl + 'm=wttapi&a=getuserinfo',
      method: 'POST',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      data: {
        openid: that.data.openId
      },
      success: function (res) {
        that.setData({
          yangmao: res.data.data.yangmao
        })
      }
    })
    wx.request({
      url: baseUrl + 'm=wttapi&a=checkyangmao',
      method: 'POST',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      data: {
        openid: that.data.openId
      },
      success: function (res) {
        if (res.data.data[1]) {
          that.setData({
            isAttentSig: true,
            attentText3: '已签到'
          })
        } else {
          that.setData({
            isAttentSig: false,
            attentText3: '去签到'
          })
        }
        if (res.data.data[2]) {
          that.setData({
            isAttentSer: true,
            attentText1: '已关注'
          })
        } else {
          that.setData({
            isAttentSer: false,
            attentText1: '去关注'
          })
        }
        if (res.data.data[3]) {
          that.setData({
            isAttentSub: true,
            attentText2: '已关注'
          })
        } else {
          that.setData({
            isAttentSub: false,
            attentText2: '去关注'
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
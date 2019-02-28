// pages/logintel/logintel.js
const app = getApp();
const baseUrl = app.globalData.baseUrl
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isShow:false
  },
  toTestlogin:function(e){
    wx.navigateTo({
      url: '../testlogin/testlogin',
    })
  },
  postPhone:function(){
    wx.request({
      data: {
        openid: wx.getStorageSync('openid'),
        telephone: wx.getStorageSync('telephone')
      },
      url: baseUrl + 'm=api&a=userinfo',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      method: 'POST',
      success: function (tele) {
      },
      fail: function () {
        console.log('请求失败');
      }
    });
  },
  //授权
  getPhoneNumber: function(e) {
    var that = this
    if (e.detail.errMsg === 'getPhoneNumber:ok') {
      wx.request({
        url: baseUrl+'m=api&a=decodewxdata',
        method: 'POST',
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        data: {
          openid: that.data.openid,
          encryptedData: e.detail.encryptedData,
          iv: e.detail.iv,
          wttkey: 'decodewxdatawttkey',
          sign: ''
        },
        success: function(ress) {
          let tel = JSON.parse(ress.data.output).phoneNumber
          wx.setStorageSync('telephone', tel)
          wx.showLoading({
            title: '正在登录...'
          });
          that.postPhone()
          that.onBack()
        }
      })
    } else {
      that.onBack()
    }

  },
  onBack: function () {
    let _backToPath = wx.getStorageSync('BACK_TO_PATH');
    if (_backToPath) {
      if (_backToPath.pathType === 'tabbar') {
        console.log('test tabbar')
        getApp().globalData.indexUid = this.data.byuid
        wx.switchTab({
          url: _backToPath.path
        });
      } else {
        wx.redirectTo({
          url: _backToPath.path
        });
      }
    } else {
      wx.navigateTo({
        url: '../index/index',
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getLoginCode()
    this.setData({
      byuid:options.byuid
    })
  },
  //获取code
  getLoginCode: function() {
    var that = this;
    return new Promise((resolve, reject) => {
      wx.login({
        success: (res) => {
          wx.request({
            url: baseUrl+'m=api&a=getwxuserinfo',
            method: 'POST',
            header: {
              'content-type': 'application/x-www-form-urlencoded'
            },
            data: {
              jscode: res.code,
              wttkey: '65ddca7b8354c7f7d4262d4d152878ab'
            },
            success: function(ress) {
              that.setData({
                jscode: res.code,
                openid: ress.data.output.openid
              })
              if (ress.data.testtype == 0){
                that.setData({
                  isShow:false
                })
              }else{
                that.setData({
                  isShow: true
                })
              }
            }
          })
          resolve();
        },
        fail: () => {
          reject();
        }
      });
    });
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
    wx.removeStorageSync('BACK_TO_PATH');
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})
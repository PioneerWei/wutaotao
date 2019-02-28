// pages/login/login.js
const app = getApp();
let LOGIN_CODE = '';
let byuid = '';
const baseUrl = app.globalData.baseUrl
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.hideShareMenu();

    byuid = options.byuid || byuid;
    this.setData({
      byuid: byuid
    })
    this.getLoginCode();

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
   * 自定义函数--wx.login获取解密用的code
   */
  getLoginCode: function() {
    var that = this;
    return new Promise((resolve, reject) => {
      wx.login({
        success: (res) => {
          LOGIN_CODE = res.code;
          wx.setStorageSync('jscode', res.code);
          resolve();
        },
        fail: () => {
          reject();
        }
      });
    });
  },
  /**
   * 自定义函数--获取openid
   * @param {} login_code
   */
  getOpenId: function(login_code) {
    var that = this;
    return new Promise((resolve, reject) => {
      wx.request({
        url: baseUrl + 'm=api&a=getwxuserinfo',
        data: {
          jscode: login_code,
          // wttkey: 'jscodewttkey',
          sign: 'c8a85e93023953c2478dab304001fe7c0bd41f37' + 'jscode' + login_code + '65ddca7b8354c7f7d4262d4d152878ab' + 'jscodewttkey' + 'c8a85e93023953c2478dab304001fe7c0bd41f37'
        },
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        method: 'POST',
        success: function(res) {
          if (res.data.code == 1) {
            let _openid = res.data.output.openid;
            wx.setStorageSync('openid', _openid);

            resolve({
              'openid': _openid
            });
          } else {
            wx.showToast({
              title: '网络请求出错，请重试',
              icon: 'none',
              mask: true,
              duration: 2000
            });
            reject('获取openid返回值出错');
          }


        },
        fail: function() {
          console.log('获取openid请求失败');
          reject();
        }
      })
    });
  },

  /**
   * 自定义函数--获取用户的uid
   * @param {} openid
   * @param {} nickname
   * @param {} avatar
   */
  getUid: function(openid, nickname, avatar) {
    return new Promise((resolve, reject) => {
      wx.request({
        data: {
          openid: openid,
          nickname: nickname,
          gender: '',
          city: '',
          province: '',
          country: '',
          avatar: avatar,
          wttkey: 'userinfowttkey',
          sign: '',
          byuid: byuid,
          unionid: wx.getStorageSync('unionid')
        },
        url: baseUrl + 'm=api&a=userinfo',
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        method: 'POST',
        success: function(res) {
          if (res.data.code == 1) {
            wx.setStorageSync('uid', res.data.uid);
            resolve();
          } else {
            console.log('无数据');
            reject();
          }
        },
        fail: function() {
          console.log('请求失败');
        }
      });
    });
  },

  /**
   * 自定义函数--登录按钮的bind event
   */

  onGotUserInfo: function(e) {
    var that = this
    if (e.detail.errMsg === 'getUserInfo:ok') {
      let nickname = e.detail.userInfo.nickName;
      let avatar = e.detail.userInfo.avatarUrl;
      this.getOpenId(LOGIN_CODE).then((res) => {
          wx.request({
            url: baseUrl + 'm=api&a=decodewxdata',
            method: 'POST',
            header: {
              'content-type': 'application/x-www-form-urlencoded'
            },
            data: {
              openid: wx.getStorageSync('openid'),
              encryptedData: e.detail.encryptedData,
              iv: e.detail.iv,
              wttkey: 'decodewxdatawttkey',
              sign: ''
            },
            success: function(ress) {
              let _unionid = JSON.parse(ress.data.output).unionId
              wx.setStorageSync('unionid', _unionid)
              return that.getUid(res.openid, nickname, avatar);
            }
          })
        })

        .then(() => {
          wx.setStorageSync('nickname', nickname);
          wx.setStorageSync('avatar', avatar);
          wx.navigateTo({
            url: '../logintel/logintel?byuid=' + that.data.byuid,
          })
        })
        .catch((error) => {
          wx.hideLoading();
        })
    }
  }


})
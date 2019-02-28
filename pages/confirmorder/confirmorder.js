const app = getApp()
const baseUrl = app.globalData.baseUrl
Page({

  /**
   * 页面的初始数据
   */
  data: {
    openId: ' ',
    pid: ' ',
    bookid: ' ',
    orderid: ' '
  },
  //用户选择收货地址
  chooseAddress: function() {
    var that = this
    if (wx.chooseAddress) {
      wx.chooseAddress({
        success: function(res) {
          that.setData({
            "name": res.userName,
            "telephone": res.telNumber,
            "province": res.provinceName,
            "city": res.cityName,
            "country": '中国',
            "add_postalCode": res.postalCode,
            "area": res.countyName,
            "address": res.detailInfo,
            //具体收货地址显示
            flag: false,

          })
        },
        fail: function(err) {
          console.info("收货地址授权失败");
          wx.showToast({
            title: '授权失败，您将无法进行下单支付;重新授权请删除小程序后再次进入',
            icon: 'success',
            duration: 20000
          })
        }
      })
    } else {
      console.log('当前微信版本不支持chooseAddress');
    }
  },
  //添加收货地址
  addAddress: function() {
    var that = this
    if (wx.chooseAddress) {
      wx.chooseAddress({
        success: function(res) {
          wx.request({
            url: baseUrl + 'm=wttapi&a=addaddress',
            method: 'POST',
            header: {
              "Content-Type": "application/x-www-form-urlencoded"
            },
            data: {
              "openid": that.data.openId,
              "name": res.userName,
              "telephone": res.telNumber,
              "province": res.provinceName,
              "city": res.cityName,
              "country": '中国',
              "add_postalCode": res.postalCode,
              "area": res.countyName,
              "address": res.detailInfo,
            },
            success: function(ress) {
              that.setData({
                "name": res.userName,
                "telephone": res.telNumber,
                "province": res.provinceName,
                "city": res.cityName,
                "country": '中国',
                "add_postalCode": res.postalCode,
                "area": res.countyName,
                "address": res.detailInfo,
                //具体收货地址显示
                flag: false,
                bookid: ress.data.bookid,
                showAdd: true
              })
            }
          })
        },
        fail: function(err) {
          console.log(JSON.stringify(err))
        }
      })

    } else {
      console.log('当前微信版本不支持chooseAddress');
    }
  },
  //确认按钮
  confirmOrder: function(e) {
    var that = this
    wx.request({
      url: baseUrl + 'm=wttapi&a=finalconfirm',
      method: 'POST',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      data: {
        pid: that.data.pid,
        openid: that.data.openId,
        bookid: that.data.bookid
      },
      success: function(res) {
        that.setData({
          orderid: res.data.orderid
        })
        if (res.data.code == 0) {
          wx.showToast({
            title: '用户未登录'
          })
        } else if (res.data.code == -1) {
          wx.showToast({
            title: '用户不存在'
          })
        } else if (res.data.code == -2) {
          wx.showToast({
            title: '抱歉，同一商品，每人每周限成功兑换一次',
            icon: 'none'
          })
        } else if (res.data.code == -3) {
          wx.showToast({
            title: '抱歉，您的羊毛余额不足，请继续加油',
            icon: 'none'
          })

        } else if (res.data.code == -4) {
          wx.showToast({
            title: '抱歉，您慢一步，当前商品已兑完',
            icon: 'none'
          })
        } else if (res.data.code == -5) {
          wx.showToast({
            title: '未传递地址id',
            icon: 'none'
          })
        } else if (res.data.code == -6) {
          wx.showToast({
            title: '地址并不存在',
            icon: 'none'
          })
        } else {
          if (wx.getStorageSync('telephone') != "") {
            wx.navigateTo({
              url: '../conversuccess/conversuccess?id=' + that.data.orderid,
            })
          } else {
            wx.setStorageSync('BACK_TO_PATH', {
              pathType: 'goBuy',
              path: '/pages/categorydetails/categorydetails?uid=' + wx.getStorageSync('uid') + '&id=' + that.data.pid + '&openid=' + wx.getStorageSync('openid'),
            });
            return wx.redirectTo({
              url: '/pages/logintel/logintel'
            });
          }

        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this
    this.setData({
      openId: wx.getStorageSync('openid'),
      pid: options.id
    })
    //地址
    wx.request({
      url: baseUrl + 'm=wttapi&a=address',
      method: 'POST',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      data: {
        openid: that.data.openId,
        pid: that.data.pid
      },
      success: function(res) {
        if (res.data.data == 0) {
          that.setData({
            showAdd: false
          })
        } else {
          that.setData({
            showAdd: true,
            name: res.data.data.name,
            address: res.data.data.address,
            area: res.data.data.area,
            city: res.data.data.city,
            province: res.data.data.province,
            telephone: res.data.data.telephone,
            bookid: res.data.data.bookid
          })
        }
      }
    })
    //商品详情
    wx.request({
      url: baseUrl + 'm=wttapi&a=confirmorder',
      method: 'POST',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      data: {
        openid: that.data.openId,
        pid: that.data.pid
      },
      success: function(res) {
        that.setData({
          image: res.data.data.image,
          title: res.data.data.title,
          image: res.data.data.image,
          yangmao: res.data.data.yangmao,
          cur_integral: res.data.data.cur_integral
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
    var that = this //地址
    wx.request({
      url: baseUrl + 'm=wttapi&a=address',
      method: 'POST',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      data: {
        openid: that.data.openId,
        pid: that.data.pid
      },
      success: function(res) {
        if (res.data.data == 0) {
          that.setData({
            showAdd: false
          })
        } else {
          that.setData({
            showAdd: true,
            name: res.data.data.name,
            address: res.data.data.address,
            area: res.data.data.area,
            city: res.data.data.city,
            province: res.data.data.province,
            telephone: res.data.data.telephone,
            bookid: res.data.data.bookid
          })
        }
      }
    })
    //商品详情
    wx.request({
      url: baseUrl + 'm=wttapi&a=confirmorder',
      method: 'POST',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      data: {
        openid: that.data.openId,
        pid: that.data.pid
      },
      success: function(res) {
        that.setData({
          image: res.data.data.image,
          title: res.data.data.title,
          image: res.data.data.image,
          yangmao: res.data.data.yangmao,
          cur_integral: res.data.data.cur_integral
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
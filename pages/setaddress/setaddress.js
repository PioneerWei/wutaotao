const app = getApp()
const baseUrl = app.globalData.baseUrl
Page({

  /**
   * 页面的初始数据
   */
  data: {
    openId:' '
  },
  //用户选择收货地址
  chooseAddress: function () {
    var that = this
    if (wx.chooseAddress) {
      wx.chooseAddress({
        success: function (res) {
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
        fail: function (err) {
          console.log(JSON.stringify(err));
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
  addAddress: function () {
    var that = this
    // console.log(that.data.name)
    if (wx.chooseAddress) {
      //console.log(this.data.name)
      //return
      wx.chooseAddress({
        success: function (res) {
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
            success: function (ress) {
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
          console.log(JSON.stringify(res))
        },
        fail: function (err) {
          console.log(JSON.stringify(err))
        }
      })

    } else {
      console.log('当前微信版本不支持chooseAddress');
    }
   
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    if (wx.getStorageSync('openid') != '') {
      this.setData({
        openId: wx.getStorageSync('openid')
      })
    }
    wx.request({
      url: baseUrl + 'm=wttapi&a=address',
      method: 'POST',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      data: {
        openid: that.data.openId
      },
      success: function (res) {
        // console.log(res)
        that.setData({
          address: res.data.data.address,
          area: res.data.data.area,
          city: res.data.data.city,
          name: res.data.data.name,
          province: res.data.data.province,
          telephone: res.data.data.telephone
        })
        if(res.data.data == 0){
          that.setData({
            showAdd:false
          })
        }else{
          that.setData({
            showAdd: true
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
    var that = this
    wx.request({
      url: baseUrl + 'm=wttapi&a=address',
      method: 'POST',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      data: {
        openid: that.data.openId
      },
      success: function (res) {
        // console.log(res)
        that.setData({
          address: res.data.data.address,
          area: res.data.data.area,
          city: res.data.data.city,
          name: res.data.data.name,
          province: res.data.data.province,
          telephone: res.data.data.telephone
        })
        if (res.data.data == 0) {
          that.setData({
            showAdd: false
          })
        } else {
          that.setData({
            showAdd: true
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
    
  },

  /**
   * 用户点击右上角分享
   */
  // onShareAppMessage: function () {
    
  // }
})
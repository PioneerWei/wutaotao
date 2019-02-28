const app = getApp()
const baseUrl = app.globalData.baseUrl
Page({

  /**
   * 页面的初始数据
   */
  data: {
    ccid: ' ',
    bid: 0,
    activeCurrent: 0,
    isShare: false,
    contentHeight: ' ',
    detailList: [],
    detailValue: [],
    detailContent: [],
    page: 2,
    showEmpty: false,
    openId: ' ',
    isGuoqi: ' ',
    clientHeight: ' ',
    clientWidth: ' ',
    isTab: false
  },
  //分享海报
  listShare: function() {
    var that = this;
    var y = 81;
    //canvas兼容不同机型
    var rpx;
    wx.getSystemInfo({
      success: function(res) {
        rpx = res.windowWidth / 375
      }
    })
    that.setData({
      isShare: true,
      isAlert: false
    })
    wx.showLoading({
      title: '加载中',
    })
    //绘制海报内容
    var ctx = wx.createCanvasContext('listShare');
    wx.request({
      url: baseUrl + 'm=wttapi&a=share_seclist',
      method: 'POST',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      data: {
        ccid: that.data.ccid
      },
      success: (res) => {
        wx.getImageInfo({
          src: '../../images/list.png',
          success: function(resbg) {
            ctx.drawImage('../../' + resbg.path, 0, 0, 600 * rpx, 900 * rpx)
            ctx.setTextAlign("center")
            ctx.setFillStyle("#ffffff")
            ctx.font = 'normal bold 18px sans-serif'
            ctx.setShadow(0, 4, 2, '#ef5000');
            ctx.setFontSize(44)
            ctx.fillText(res.data.catname, 300 * rpx, 85 * rpx)
            ctx.setShadow(0, 0, 0, 'white');
            wx.getImageInfo({
              src: res.data.data[0].brandimg,
              success: function(titImg) {
                ctx.drawImage(titImg.path, 80 * rpx, 225 * rpx, 50 * rpx, 50 * rpx)
                ctx.save()
                ctx.setFillStyle("#000000")
                ctx.setFontSize(28)
                ctx.fillText(res.data.data[0].brandname, 170 * rpx, 260 * rpx)
                ctx.setFontSize(18)
                ctx.setFillStyle("#999999")
                ctx.fillText('今日低价', 345 * rpx, 258 * rpx)
                ctx.setFillStyle("#ff6262")
                ctx.setFontSize(28)
                ctx.fillText(res.data.data[0].priceshow, 460 * rpx, 260 * rpx)
                ctx.save()
                res.data.data[1].forEach(function(item, index) {
                  wx.getImageInfo({
                    src: item.brandimg,
                    success: function(forImg) {
                      ctx.drawImage(forImg.path, 80 * rpx, (324 + y * index) * rpx, 50 * rpx, 50 * rpx)
                      ctx.save()
                      ctx.setTextAlign("left")
                      ctx.setFillStyle("#000000")
                      ctx.setFontSize(18)
                      ctx.fillText(item.brandname, 150 * rpx, (355 + y * index) * rpx)
                      ctx.setFontSize(18)
                      ctx.setFillStyle("#999999")
                      ctx.fillText("今日低价", 315 * rpx, (355 + y * index) * rpx)
                      ctx.setFillStyle("#ff6262")
                      ctx.setFontSize(24)
                      ctx.fillText(item.priceshow, 400 * rpx, (355 + y * index) * rpx)
                    }
                  })
                  ctx.save()
                })
                wx.request({
                  url: baseUrl + 'm=wttapi&a=qrcodeHBN',
                  method: "POST",
                  header: {
                    "Content-Type": "application/x-www-form-urlencoded"
                  },
                  data: {
                    openid: that.data.openId,
                    scene: wx.getStorageSync('uid') + '&' + that.data.ccid,
                    width: 120,
                    page: '/pages/categorylist/categorylist'
                  },
                  success: function(codeImg) {
                    wx.getImageInfo({
                      src: codeImg.data.image,
                      success: function(detaCodeImg) {
                        ctx.drawImage(detaCodeImg.path, 240 * rpx, 680 * rpx, 120 * rpx, 120 * rpx)
                        ctx.draw(false, setTimeout(function() {
                          wx.canvasToTempFilePath({
                            canvasId: 'listShare',
                            success: function(res) {
                              wx.hideLoading()
                              that.setData({
                                isAlert: true,
                                prurl: res.tempFilePath,
                              })
                            },
                            fail: function(res) {
                              console.log(res)
                            }
                          })
                        }, 500))
                      }
                    })
                  }
                })
              }
            })
          }
        })
      }
    })
  },
  //关闭海报
  closePoster: function() {
    this.setData({
      isShare: false
    })
    wx.hideLoading()
  },
  //保存到手机
  createPoster: function() {
    var that = this
    wx.saveImageToPhotosAlbum({
      filePath: that.data.prurl,
      success(res) {
        wx.showToast({
          title: '图片已保存',
        })
      },
      fail: function(res) {
        console.log(res)
      }
    })
  },
  //点击切换swiper
  clickTab: function(e) {
    var that = this
    var tabWidth = that.data.clientWidth / 4
    var current = e.currentTarget.dataset.num
    if (current == that.data.activeCurrent){
      that.setData({
        activeCurrent: current,
        isTab: true
      })
    }else{
      that.setData({
        activeCurrent: current,
        tabScroll: (current - 2) * tabWidth,
        detailValue: '',
        detailContent: '',
        hidd: true,
        isTab: false
      })
    }
  },
  //滑动结束
  changeEnd: function(e) {
    var that = this
    var current = e.detail.current
    var tabWidth = that.data.clientWidth / 4
    if (e.detail.source == 'touch') {
      if (e.detail.current == 0 && that.data.activeCurrent > 1) {
        that.setData({
          activeCurrent: that.data.activeCurrent,
          isTab: false,
          detailValue: '',
          detailContent:''
        })
      } else {
        that.setData({
          activeCurrent: current,
          tabScroll: (current - 2) * tabWidth,
          isTab: false,
          detailValue: '',
          detailContent: ''
        })
      }
    }
    wx.request({
      url: baseUrl + 'm=wttapi&a=getseclist2',
      method: 'POST',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      data: {
        ccid: that.data.ccid,
        bid: e.detail.currentItemId
      },
      success: function(res) {
        var detailValue = [];
        var detailContent = [];
        for (var i = 0; i < res.data.data.length; i++) {
          if (res.data.data[i].is_zuiyou) {
            detailValue.push(res.data.data[i])
          } else {
            detailContent.push(res.data.data[i])
          }
        }
        that.setData({
          page: 2,
          bid: e.detail.currentItemId,
          detailValue: detailValue,
          detailContent: detailContent,
          hidd:false,
          isTab: true
        })
        if (detailValue.length == 0) {
          that.setData({
            showEmpty: true,
          })
        } else {
          that.setData({
            showEmpty: false,
          })
        }
        if (that.data.detailContent.length < 20) {
          that.setData({
            isloadingMore: true
          })
        } else {
          that.setData({
            isloadingMore: false
          })
        }
      }
    })
  },
  //跳转详情页
  litoDeta: function(e) {
    var pid = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '../categorydetails/categorydetails?id=' + pid,
    })

  },
  //回到首页
  backHome: function() {
    wx.reLaunch({
      url: '../index/index',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    that.setData({
      openId: wx.getStorageSync('openid'),
    })
    if (options.scene) {
      let scene = decodeURIComponent(options.scene)
      let uid = scene.split('&')[0]
      let id = scene.split('&')[1]
      if (!wx.getStorageSync('openid')) { //未登录状态
        wx.setStorageSync('BACK_TO_PATH', {
          pathType: 'details',
          path: '/pages/categorylist/categorylist?uid=' + uid + '&id=' + id,
        });
        return wx.redirectTo({
          url: '/pages/login/login?byuid=' + uid
        });
      }
      if (uid != null || uid != undefined) {
        wx.request({
          url: baseUrl + 'm=wttapi&a=addyangmao',
          method: 'POST',
          header: {
            "Content-Type": "application/x-www-form-urlencoded"
          },
          data: {
            openid: that.data.openId,
            byuid: uid,
            type: 4
          },
          success: function(res) {

          }
        })
      }
      that.setData({
        ccid: id,
        isLoading: false
      })
    } else {
      that.setData({
        ccid: options.id,
        isLoading: false
      })
      if (!wx.getStorageSync('openid')) { //未登录状态
        wx.setStorageSync('BACK_TO_PATH', {
          pathType: 'details',
          path: '/pages/categorylist/categorylist?uid=' + options.uid + '&id=' + options.id,
        });
        return wx.redirectTo({
          url: '/pages/login/login?byuid=' + options.uid
        });
      }
      if (options.uid != null || options.uid != undefined) {
        wx.request({
          url: baseUrl + 'm=wttapi&a=addyangmao',
          method: 'POST',
          header: {
            "Content-Type": "application/x-www-form-urlencoded"
          },
          data: {
            openid: that.data.openId,
            byuid: options.uid,
            type: 4
          },
          success: function(res) {

          }
        })
      }
    }
    wx.getSystemInfo({
      success: function(res) {
        let clientHeight = res.windowHeight,
          clientWidth = res.windowWidth,
          rpxR = 750 / clientWidth;
        var calc = clientHeight * rpxR;
        that.setData({
          windowHeight: calc,
          clientHeight: clientHeight,
          clientWidth: clientWidth
        });
      }
    });
    wx.request({
      url: baseUrl + 'm=wttapi&a=seclist2',
      method: 'POST',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      data: {
        ccid: that.data.ccid
      },
      success: function(res) {
        that.setData({
          detailList: res.data.data[1],
          title: res.data.data.title,
          detailNumber: res.data.data[2],
          isTab:true,
          isLoading:true
        })
        wx.setNavigationBarTitle({
          title: that.data.title
        })
        let detailValue = [];
        let detailContent = [];
        for (var i = 0; i < res.data.data[2].length; i++) {
          if (res.data.data[2][i].is_zuiyou) {
            detailValue.push(res.data.data[2][i])
            that.setData({
              detailValue: detailValue
            })
          } else {
            detailContent.push(res.data.data[2][i])
            that.setData({
              detailContent: detailContent
            })
          }
        }
        if (that.data.detailValue.length == 0) {
          that.setData({
            showEmpty: true
          })
        } else {
          that.setData({
            showEmpty: false
          })
        }
        if (res.data.data[2].length < 20) {
          that.setData({
            isloadingMore: true
          })
        } else {
          that.setData({
            isloadingMore: false
          })
        }
      }
    })
  },
  /** 
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

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

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  listLower: function() {
    var that = this
    if (that.data.detailNumber.length >= 20) {
      wx.request({
        url: baseUrl + 'm=wttapi&a=getseclist2',
        method: 'POST',
        header: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        data: {
          ccid: that.data.ccid,
          bid: that.data.bid,
          page: that.data.page
        },
        success: function(res) {
          let newContent = that.data.detailContent.concat(res.data.data)
          that.setData({
            detailContent: newContent,
            page: that.data.page * 1 + 1,
          })
          if (res.data.data.length < 20) {
            that.setData({
              isloadingMore: true
            })
          } else {
            that.setData({
              isloadingMore: false
            })
          }
        },
        fail: function(res) {
          console.log(res)
          wx.showToast({
            title: '数据异常',
            icon: 'none'
          })
        }
      })
    }
  },
  // onReachBottom: function() {


  // },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {
    var that = this
    return {
      title: `超值推荐：【${that.data.title}】品类，全部品牌今日全网低价`,
      imageUrl: '/images/listshare.png',
      path: '/pages/categorylist/categorylist?uid=' + wx.getStorageSync('uid') + '&id=' + that.data.ccid,
    }
  }
})
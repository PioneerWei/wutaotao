//index.js
//获取应用实例
const app = getApp()
let global_timer;
let global_listItemTop = [];
const baseUrl = app.globalData.baseUrl;
Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    scrollNav: [],
    scrollContent: [],
    num: 0,
    isShare: false,
    loading: 1,
    openId: ' ',
    uid: ' ',
    activeCurrent: 0,
    idx: 0,
    isLoadingMore: false
  },
  //跳转列表页
  intoList: function(e) {
    var id = e.currentTarget.dataset.id
    var name = e.currentTarget.dataset.name
    wx.navigateTo({
      url: '../categorylist/categorylist?id=' + id + '&name=' + name,
    })
  },
  //去赚羊毛
  goTask: function(e) {
    wx.navigateTo({
      url: '../dailytask/dailytask',
    })
  },
  //兑换商品
  goConversion:function(e){
    wx.reLaunch({
      url: '../conversion/conversion',
    })
  },
  //分享海报
  indexShare: function() {
    var that = this
    //canvas兼容不同机型
    var rpx;
    wx: wx.getSystemInfo({
      success: function(res) {
        rpx = res.windowWidth / 375
      }
    })
    that.setData({
      isShare: true,
      isAlert: false
    });
    wx.showLoading({
      title: '加载中'
    })
    //绘制画布内容
    wx.request({
      url: baseUrl + 'm=wttapi&a=getsharedata',
      method: 'POST',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: function(res) {
        var ctx = wx.createCanvasContext('indexshare');
        wx.getImageInfo({
          src: '../../images/indexshare.png',
          success: function(ress) {
            ctx.drawImage('../../' + ress.path, 0, 0, 600 * rpx, 900 * rpx)
            ctx.setFillStyle('#FFFFFF')
            ctx.setFontSize(26)
            ctx.fillText("卫生卷纸", 147 * rpx, 347 * rpx)
            ctx.fillText("抽纸", 147 * rpx, 452 * rpx)
            ctx.fillText("更多品类", 147 * rpx, 558 * rpx)
            ctx.setFillStyle('#ffd5b4')
            ctx.setFontSize(24)
            ctx.setTextAlign('center')
            ctx.fillText(res.data.data[0].priceshow, 402 * rpx, 334 * rpx)
            ctx.fillText(res.data.data[1].priceshow, 402 * rpx, 440 * rpx)
            ctx.save()
            // 绘制小程序码
            wx.request({
              url: baseUrl + 'm=wttapi&a=qrcodeHBN',
              method: 'POST',
              header: {
                "Content-Type": "application/x-www-form-urlencoded"
              },
              data: {
                openid: that.data.openId,
                scene: wx.getStorageSync('uid'),
                width: 120,
                page: '/pages/index/index'
              },
              success: function(down) {
                wx.getImageInfo({
                  src: down.data.image,
                  success: function(ss) {
                    ctx.setTextAlign('center')
                    ctx.drawImage(ss.path, 240 * rpx, 720 * rpx, 120 * rpx, 120 * rpx)
                    ctx.draw(false, setTimeout(function() {
                      wx.canvasToTempFilePath({
                        canvasId: 'indexshare',
                        success: function(res) {
                          wx.hideLoading()
                          that.setData({
                            isAlert: true,
                            prurl: res.tempFilePath,
                          });
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
  },
  //关闭分享海报
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
  onLoad: function(options) {
    var that = this
    that.setData({
      openId: wx.getStorageSync('openid'),
    })
    //判断登录状态
    if (options.scene) {
      let uid = decodeURIComponent(options.scene)
      if (!wx.getStorageSync('openid')) { //未登录状态
        wx.setStorageSync('BACK_TO_PATH', {
          pathType: 'tabbar',
          path: '/pages/index/index',
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
    } else {
      if (!wx.getStorageSync('openid')) { //未登录状态
        wx.setStorageSync('BACK_TO_PATH', {
          pathType: 'tabbar',
          path: '/pages/index/index',
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

    //轮播图
    wx.request({
      url: baseUrl + 'm=wttapi&a=indexlunbo',
      success: function(res) {
        that.setData({
          moveImage: res.data.data.imges
        })
      }
    })

    //首页内容
    wx.request({
      url: baseUrl + 'm=wttapi&a=getcategories',
      method: "POST",
      data:{
        openid:that.data.openId
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: function(res) {
        that.setData({
          content: res.data.data.categories,
          duihuan: res.data.data.duihuan,
          yangmao: res.data.data.yangmao
        })
      }
    })

    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  onReady: function() {

  },
  onShow: function() {

  },
  //下拉刷新
  onPullDownRefresh: function() {
    var that = this;
    wx.request({
      url: baseUrl + 'm=wttapi&a=getcategories',
      method: "POST",
      data: {
        openid: that.data.openId
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: function (res) {
        that.setData({
          content: res.data.data.categories,
          duihuan: res.data.data.duihuan,
          yangmao: res.data.data.yangmao
        })
        wx.stopPullDownRefresh();
      }
    })

  },
  //分享按钮
  onShareAppMessage: function() {
    return {
      title: '精选生活必需品牌好物，筛选每日全网低价',
      imageUrl: '/images/shareImg.png',
      path: '/pages/index/index?uid=' + wx.getStorageSync('uid'),
    }
  }
})
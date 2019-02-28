const app = getApp()
const baseUrl = app.globalData.baseUrl
Page({
  /**
   * 页面的初始数据
   */
  data: {
    jd_app_id: 'wx1edf489cb248852c',
    extra_data: {
      unionid: '1000794638',
      customerinfo: ''
    },
    isAlertcopy: false,
    isShare: false,
    posterImg: "images/bg@2x.png",
    jump_type: ' ',
    jump_url: ' ',
    skuid: ' ',
    pid: ' ',
    isCollect: false,
  },
  //跳至详情页
  toDetails: function(e) {
    let id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '../categorydetails/categorydetails?id=' + id,
    })
  },
  //处理文字多出省略号显示
  dealWords: function(options) {
    options.ctx.setFontSize(options.fontSize); //设置字体大小
    var allRow = Math.ceil(options.ctx.measureText(options.word).width / options.maxWidth);
    //实际总共能换多少行
    var count = allRow >= options.maxLine ? options.maxLine : allRow; //实际能分多少行与设置的最大显示行数比，谁小就用谁做循环次数
    var endPos = 0; //当前字符串的截断点
    for (var j = 0; j < count; j++) {
      var nowStr = options.word.slice(endPos); //当前剩余的字符串
      var rowWid = 0; //每一行当前宽度  
      if (options.ctx.measureText(nowStr).width > options.maxWidth) { //如果当前的字符串宽度大于最大宽度，然后开始截取
        for (var m = 0; m < nowStr.length; m++) {
          rowWid += options.ctx.measureText(nowStr[m]).width; //当前字符串总宽度
          if (rowWid > options.maxWidth) {
            if (j === options.maxLine - 1) { //如果是最后一行
              options.ctx.fillText(nowStr.slice(0, m - 1) + '...', options.x, options.y + (j + 1) * 40); //(j+1)*18这是每一行的高度    
            } else {
              options.ctx.fillText(nowStr.slice(0, m), options.x, options.y + (j + 1) * 40);
            }
            endPos += m; //下次截断点
            break;
          }
        }
      } else { //如果当前的字符串宽度小于最大宽度就直接输出
        options.ctx.fillText(nowStr.slice(0), options.x, options.y + (j + 1) * 40);
      }
    }
  },
  //海报分享
  catdetailsShare: function() {
    var that = this;
    //canvas兼容不同机型
    var rpx;
    wx: wx.getSystemInfo({
      success: function(res) {
        rpx = res.windowWidth / 375
      }
    })
    this.setData({
      isShare: true,
      isAlert: false
    })
    wx.showLoading({
      title: '加载中',
    })
    //绘画
    var ctx = wx.createCanvasContext('detailsShare');
    wx.getImageInfo({
      src: '../../images/catdetils.png',
      success: function(res) {
        ctx.drawImage("../../" + res.path, 0, 0, 600 * rpx, 900 * rpx)
        ctx.save()
        ctx.setTextAlign("center")
        that.dealWords({
          ctx: ctx, //画布上下文
          fontSize: 30, //字体大小
          word: that.data.pro_title, //需要处理的文字
          maxWidth: 436 * rpx, //一行文字最大宽度
          x: 300 * rpx, //文字在x轴要显示的位置
          y: 410 * rpx, //文字在y轴要显示的位置
          maxLine: 2 //文字最多显示的行数
        })
        ctx.save()
        ctx.setFontSize(30)
        ctx.setFillStyle("#ff6262")
        that.dealWords({
          ctx: ctx, //画布上下文
          fontSize: 30, //字体大小
          word: that.data.pro_price_des, //需要处理的文字
          maxWidth: 436 * rpx, //一行文字最大宽度
          x: 300 * rpx, //文字在x轴要显示的位置
          y: 495 * rpx, //文字在y轴要显示的位置
          maxLine: 1 //文字最多显示的行数
        })
        ctx.save()
        ctx.setFontSize(22)
        ctx.setFillStyle("#000000")
        ctx.fillText(that.data.zhehoudanjia, 300 * rpx, 575 * rpx, 436 * rpx)
        ctx.setFillStyle("#999999")
        ctx.fillText(that.data.pingtai, 300 * rpx, 625 * rpx, 436 * rpx)
        ctx.save()
        wx.getImageInfo({
          src: that.data.pro_image[0],
          success: function(titImg) {
            ctx.drawImage(titImg.path, 170 * rpx, 128 * rpx, 260 * rpx, 260 * rpx)
            ctx.save()
            wx.request({
              url: baseUrl + 'm=wttapi&a=qrcodeHBN',
              method: "POST",
              header: {
                "Content-Type": "application/x-www-form-urlencoded"
              },
              data: {
                openid: that.data.openId,
                scene: wx.getStorageSync('uid') + '&' + that.data.pid,
                width: 120,
                page: '/pages/categorydetails/categorydetails'
              },
              success: function(codeImg) {
                wx.getImageInfo({
                  src: codeImg.data.image,
                  success: function(detaCodeImg) {
                    ctx.drawImage(detaCodeImg.path, 240 * rpx, 680 * rpx, 120 * rpx, 120 * rpx)
                    ctx.draw(false, setTimeout(function() {
                      wx.canvasToTempFilePath({
                        canvasId: 'detailsShare',
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
  //关闭海报分享
  closePoster: function() {
    this.setData({
      isShare: false
    })
    wx.hideLoading()
  },
  //显示复制弹框
  copyalert: function() {
    this.setData({
      isAlertcopy: true
    });
  },
  //关闭复制弹框
  iKnow: function() {
    this.setData({
      isAlertcopy: false
    });
  },
  //关闭购买弹框
  closeAlert: function(e) {
    this.setData({
      isBuyalert: false
    });
  },
  //返回首页
  backHome: function() {
    wx.reLaunch({
      url: '../index/index',
    })
  },
  //购买方式
  zhuShangPin: function(e) {
    let that = this;
    if (that.data.jump_type == 1) {
      wx.navigateToMiniProgram({
        appId: 'wx1edf489cb248852c',
        path: '/pages/product/product?wareId=' + that.data.skuid + '&unionId=1000794638',
        envVersion: 'release',
        success(res) {

        }
      });
    } else {
      wx.setClipboardData({
        data: that.data.jump_url,
        success: function(res) {
          wx.hideToast()
          that.setData({
            isAlertcopy: true,
            aletName:'主商品'
          })
        }
      })
    }

  },
  couDanPin: function(e) {
    let that = this;
    if (that.data.jump_type == 1) {
      wx.navigateToMiniProgram({
        appId: 'wx1edf489cb248852c',
        path: '/pages/product/product?wareId=' + e.currentTarget.dataset.skuid + '&unionId=1000794638',
        envVersion: 'release',
        success(res) {

        }
      });
    } else {
      wx.setClipboardData({
        data: e.currentTarget.dataset.link,
        success: function(res) {
          wx.hideToast()
          that.setData({
            isAlertcopy: true,
            aletName: '凑单品'
          })
        }
      })
    }
  },
  youHuiQuan: function(e) {
    let that = this;
    wx.setClipboardData({
      data: e.currentTarget.dataset.link,
      success: function (res) {
        wx.hideToast()
        that.setData({
          isAlertcopy: true,
          aletName: '优惠券'
        })
      }
    })
  },
  huoDong: function(e) {
    let that = this;
    wx.setClipboardData({
      data: e.currentTarget.dataset.link,
      success: function(res) {
        wx.hideToast()
        that.setData({
          isAlertcopy: true,
          aletName: '活动'
        })
      }
    })
  },
  //去购买
  goBuy: function(e) {
    var that = this;
    var url = that.data.jump_url;
    if (wx.getStorageSync('telephone') != "") {
      if (that.data.coudan_type) {
        that.setData({
          isBuyalert: true
        })
      } else {
        if (that.data.jump_type == 1) {
          wx.navigateToMiniProgram({
            appId: 'wx1edf489cb248852c',
            path: '/pages/product/product?wareId=' + that.data.skuid + '&unionId=1000794638',
            envVersion: 'release',
            success(res) {

            }
          });
        } else {
          wx.setClipboardData({
            data: that.data.jump_url,
            success: function(res) {
              wx.hideToast()
              that.setData({
                isAlertcopy: true,
                aletName: '购买'
              })
            }
          })
        }

      }
    } else {
      wx.setStorageSync('BACK_TO_PATH', {
        pathType: 'goBuy',
        path: '/pages/categorydetails/categorydetails?uid=' + wx.getStorageSync('uid') + '&id=' + that.data.pid + '&openid=' + wx.getStorageSync('openid'),
      });
      return wx.redirectTo({
        url: '/pages/logintel/logintel?id=' + e.currentTarget.dataset.id
      });
    }

  },
  //收藏
  Collect: function(e) {
    var that = this
    wx.request({
      url: baseUrl + 'm=wttapi&a=setfav',
      method: 'POST',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      data: {
        pid: that.data.pid,
        openid: that.data.openId
      },
      success: function(res) {
        that.setData({
          isCollect: true
        })
        wx.showToast({
          title: '收藏成功',
        })
      }
    })
  },
  //取消收藏
  delCollect: function(e) {
    var that = this
    wx.request({
      url: baseUrl + 'm=wttapi&a=cancelfav',
      method: 'POST',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      data: {
        pid: that.data.pid,
        openid: that.data.openId
      },
      success: function(res) {
        that.setData({
          isCollect: false
        })
        wx.showToast({
          title: '已取消收藏',
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    this.setData({
      openId: wx.getStorageSync('openid'),
    })
    if (options.scene) {
      let scene = decodeURIComponent(options.scene)
      let uid = scene.split('&')[0]
      let id = scene.split('&')[1]
      if (!wx.getStorageSync('openid')) { //未登录状态
        wx.setStorageSync('BACK_TO_PATH', {
          pathType: 'details',
          path: '/pages/categorydetails/categorydetails?uid=' + uid + '&id=' + id,
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
        pid: id,
        isLoading:false
      })
    } else {
      that.setData({
        pid: options.id,
        isLoading:false
      })
      if (!wx.getStorageSync('openid')) { //未登录状态
        wx.setStorageSync('BACK_TO_PATH', {
          pathType: 'details',
          path: '/pages/categorydetails/categorydetails?uid=' + options.uid + '&id=' + options.id,
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
    //详情信息
    wx.request({
      url: baseUrl + 'm=wttapi&a=youhuidetail',
      method: 'POST',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      data: {
        pid: that.data.pid,
        openid: that.data.openId,
        type: 7
      },
      success: function(res) {
        var gonglue_rich = res.data.data.gonglue.replace(/\<img/gi, '<img class="rich-img" ')
        that.setData({
          goumailiyou: res.data.data.goumailiyou,
          zhehoudanjia: res.data.data.zhehoudanjia,
          pro_title: res.data.data.pro_title,
          pingtai: res.data.data.pingtai,
          pro_price_des: res.data.data.pro_price_des,
          gonglue: gonglue_rich,
          pro_image: res.data.data.pro_image,
          jump_type: res.data.data.jump_type,
          jump_url: res.data.data.jump_url,
          skuid: res.data.data.skuid,
          read_reward: res.data.data.read_reward,
          coudan_type: res.data.data.coudan_type,
          pname: res.data.data.pname,
          coudanpin: res.data.coudan_data[1],
          youhuiquan: res.data.coudan_data[3],
          huodong: res.data.coudan_data[2],
          isLoading:true
        })
        if (res.data.data.is_guoqi) {
          that.setData({
            guoqiStatu: false
          })
        } else {
          that.setData({
            guoqiStatu: true
          })
        }
        if (res.data.is_shoucang) {
          that.setData({
            isCollect: true
          })
        } else {
          that.setData({
            isCollect: false
          })
        }
        if (res.data.coudan_data[1].length == 0){
          that.setData({
            isShowCou:true
          })
        }else{
          that.setData({
            isShowCou: false
          })
        }
        if (res.data.coudan_data[3].length == 0) {
          that.setData({
            isShowYou: true
          })
        } else {
          that.setData({
            isShowYou: false
          })
        }
        if (res.data.coudan_data[2].length == 0) {
          that.setData({
            isShowHuo: true
          })
        } else {
          that.setData({
            isShowHuo: false
          })
        }
      }
    })
    //其他品牌
    wx.request({
      url: baseUrl + 'm=wttapi&a=brandother',
      method: 'POST',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      data: {
        pid: that.data.pid
      },
      success: function(res) {
        that.setData({
          brandOther: res.data.data
        })
        if (res.data.data.length == 0) {
          that.setData({
            isShow: false
          })
        } else {
          that.setData({
            isShow: true
          })
        }
      }
    })
    //相关推荐
    wx.request({
      url: baseUrl + 'm=wttapi&a=xiangguantuijian',
      method: 'POST',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      data: {
        pid: that.data.pid
      },
      success: function(res) {
        that.setData({
          relatedRec: res.data.data
        })
        if (res.data.data == 0) {
          that.setData({
            isAboutshow: false
          })
        } else {
          that.setData({
            isAboutshow: true
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
    //详情信息
    wx.request({
      url: baseUrl + 'm=wttapi&a=youhuidetail',
      method: 'POST',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      data: {
        pid: that.data.pid,
        openid: that.data.openId
      },
      success: function(res) {
        var gonglue_rich = res.data.data.gonglue.replace(/\<img/gi, '<img class="rich-img" ')
        that.setData({
          goumailiyou: res.data.data.goumailiyou,
          zhehoudanjia: res.data.data.zhehoudanjia,
          pro_title: res.data.data.pro_title,
          pingtai: res.data.data.pingtai,
          pro_price_des: res.data.data.pro_price_des,
          gonglue: gonglue_rich,
          pro_image: res.data.data.pro_image,
          jump_type: res.data.data.jump_type,
          jump_url: res.data.data.jump_url,
          skuid: res.data.data.skuid
        })
        if (res.data.data.is_guoqi) {
          that.setData({
            guoqiStatu: false
          })
        } else {
          that.setData({
            guoqiStatu: true
          })
        }
        if (res.data.is_shoucang) {
          that.setData({
            isCollect: true
          })
        } else {
          that.setData({
            isCollect: false
          })
        }
      }
    })
    //其他品牌
    wx.request({
      url: baseUrl + 'm=wttapi&a=brandother',
      method: 'POST',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      data: {
        pid: that.data.pid
      },
      success: function(res) {
        that.setData({
          brandOther: res.data.data
        })
        if (res.data.data.length == 0) {
          that.setData({
            isShow: false
          })
        } else {
          that.setData({
            isShow: true
          })
        }
      }
    })
    //相关推荐
    wx.request({
      url: baseUrl + 'm=wttapi&a=xiangguantuijian',
      method: 'POST',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      data: {
        pid: that.data.pid
      },
      success: function(res) {
        that.setData({
          relatedRec: res.data.data
        })
        if (res.data.data == 0) {
          that.setData({
            isAboutshow: false
          })
        } else {
          that.setData({
            isAboutshow: true
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
  onShareAppMessage: function() {
    var that = this
    return {
      title: `全网超值：${that.data.pro_title}`,
      imageUrl: that.data.prurl,
      path: '/pages/categorydetails/categorydetails?uid=' + wx.getStorageSync('uid') + '&id=' + that.data.pid,
    }
  }
})
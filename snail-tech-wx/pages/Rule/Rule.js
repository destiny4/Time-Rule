// pages/Rule/Rule.js
const app = getApp()
var utils=require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    leftctx: {},
    rightctx: {},
    planData:[],
    completeData: [],
    planHeight:[],
    completeHeight:[],
    windowWidth: wx.getSystemInfoSync().windowWidth,
    windowHeight: wx.getSystemInfoSync().windowHeight,
    dialogwidth: wx.getSystemInfoSync().windowWidth,
    dialogheight: wx.getSystemInfoSync().windowHeight,
    filePath:'',
    //完成度左边距
    left:0,
    //画布高度
    useHeight:0,
    //时间尺间隔
    space:10,
    dialogContent: {},
    date: utils.formatDate(new Date()),
    showDate:'',
    //日期选择左边距  
    pickerLeft:0,
    //气泡左边距
    leftTipsWidth:0,
    rightTipsWidth:0,
    //登陆信息
    topHeight:117,
    motto:'时间不在于你拥有多少，而在于怎样使用',
    userInfo: {},
    hasUserInfo: false,
    longTapFlg:false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },  
  disablescroll:function(e){
    return false;
  },
  bindDateChange(e) {
    this.setData({
      date: e.detail.value,
      showDate: utils.getMonthDayWeek(e.detail.value)
    })
  },
  checkPlanData:function(data){
    return data.phid==this.dialog.data.content.phid
  },
  // 新增按钮
  btnTap(e) {
    var time=utils.formatTime(new Date())
    wx.setStorageSync('content', {
      phid: 0,
      beginTime: time,
      endTime: time,
      remindTime: time,
      plan: '',
      otype: 'add',
      owner:'left'
    })
    wx.navigateTo(
      { url: "../plan/plan"}
    )
  },
  // 点击了弹出框的取消
  handleCancelDialog() {

  },
  // 点击了弹出框的确认
  handleConfirmDialog(data) {
    var index=-1;
    if (data.owner == 'left') {
       index = this.data.planData.findIndex(function (value) {
        return value.phid == data.phid
      }) 
    }
    else {
      index = this.data.completeData.findIndex(function (value) {
        return value.phid == data.phid
      }) 
    }
   
    if(data.otype=='add'){
      if(data.owner=='left'){
        this.data.planData.push(data);
      }
      else{
        this.data.completeData.push(data);
      }
    }
    else if (data.otype == 'edit'){
      if (data.owner == 'left') {
        this.data.planData[index] = data
      }
      else {
        this.data.completeData[index] = data
      }
    }
    else{
      if (data.owner == 'left') {
        this.data.planData.splice(index, 1)
      }
      else {
        this.data.completeData.splice(index, 1)
      }
    }
    if (data.owner == 'left') {
      this.data.leftctx.draw();
      this.drawLeftTips(this.data.planData);
    }
    else {
      this.data.rightctx.draw();
      this.drawRightTips(this.data.completeData);
    }
  },
  //获取登陆信息
  getLoginInfo:function(){
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
  getUserInfo: function (e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.request({
      url: 'http://192.168.21.81:8080/user/get', // 仅为示例，并非真实的接口地址
      data: {
        userid: 'xty'
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      method:'GET',
      success(res) {
        console.log(res.data)
      }
    })
    this.setData({
      leftctx: wx.createCanvasContext('left', this),
      rightctx:wx.createCanvasContext('right', this),
      showDate: utils.getMonthDayWeek(this.data.date)
    })
    this.drawTimeRule();
    this.drawCompleteArc();
    this.getLoginInfo();
    var data = {
      phid:5,
      plan: "起床喝一杯水，晨跑一小时。",
      beginTime: "1:00",
      endTime: '2:30',
      remindTime:'1:00'
    }
    var data2={
      phid: 1,
      plan: '断剑重铸之日，骑士归来之时！',
      beginTime: "5:20",
      endTime: '6:40',
      remindTime: '5:20'
    }
    var data3 = {
      phid: 2,
      plan: "吾随疾风前行，身后一曲流星。",
      beginTime: "1:20",
      endTime: '2:50'
    }
    var data4 = {
      phid: 3,
      plan: '过去的我常常在追赶自己！',
      beginTime: "4:40",
      endTime: '6:10'
    }
    this.data.planData.push(data)
    this.data.planData.push(data2)
    this.drawLeftTips(this.data.planData);
    this.data.completeData = [data3,data4]
    this.drawRightTips(this.data.completeData);
  },
  getTimeHeight:function(beginTime,endTime){
    var space=this.data.space
    var timeBegin = beginTime.split(":")
    var timeEnd = endTime.split(":")
    var timeBeginHeight = 22 + (parseInt(timeBegin[0]) * 60 + parseInt(timeBegin[1]))*space/12
    var num1 = parseInt(timeBegin[0]) * 60 + parseInt(timeBegin[1])
    var num2 = parseInt(timeEnd[0]) * 60 + parseInt(timeEnd[1])
    var num = (num2-num1)/12
    var timeEndHeight = timeBeginHeight + space * num
    var time={
      timeBeginHeight: timeBeginHeight,
      timeEndHeight: timeEndHeight
    }
    return time;
  },
  //画左边计划框
  drawLeftTips: function (planData) {
    this.data.planHeight=[];
    for (var index = 0; index < planData.length; index++) {
      var data = planData[index]

      //定位时间
      var timeHeight = this.getTimeHeight(data.beginTime, data.endTime)
      //添加进计划时间数组
      this.data.planHeight.push({
        begin: timeHeight.timeBeginHeight+this.data.topHeight,
        end: timeHeight.timeEndHeight + this.data.topHeight
      })
      var startX = Math.ceil(this.data.windowWidth / 2) - 28;
      this.data.leftctx.setFillStyle('#FF8A0C')
      this.data.leftctx.fillRect(startX, timeHeight.timeBeginHeight, 10, timeHeight.timeEndHeight - timeHeight.timeBeginHeight)
      this.data.leftctx.beginPath()

      this.data.leftctx.setFontSize(12)
      var totalWidth = Math.ceil(this.data.windowWidth / 2) - 20;
      var contentRowWidth = totalWidth - 40;
      var totalHeight = 0;
      var height = timeHeight.timeBeginHeight;
      var radius = 7;
      var width = 20 + radius;
      var contentWidth = this.data.leftctx.measureText(data.plan).width;
      totalHeight = Math.ceil(contentWidth / (contentRowWidth - 25)) * 20 + 10;
      //箭头高度
      var arrowHeight = totalHeight / 2;
      var arrow = 5.0;
      //箭头高度

      this.data.leftctx.setStrokeStyle("#FF8A0C")
      this.data.leftctx.setFillStyle('#FF9900');
      //左上角
      this.data.leftctx.arc(width, height + radius, radius, Math.PI, 1.5 * Math.PI)
      this.data.leftctx.lineTo(contentRowWidth + 20 - radius, height)
      //右上角
      this.data.leftctx.arc(contentRowWidth + 20 - radius, height + radius, radius, 1.5 * Math.PI, 2 * Math.PI)
      this.data.leftctx.lineTo(contentRowWidth + 20, height + arrowHeight);
      this.data.leftctx.lineTo(contentRowWidth + 20 + 10, height + arrowHeight + arrow * 0.66);
      this.data.leftctx.lineTo(contentRowWidth + 20, height + arrowHeight + arrow);
      this.data.leftctx.lineTo(contentRowWidth + 20, height + totalHeight - radius)
      //右下角
      this.data.leftctx.arc(contentRowWidth + 20 - radius, height + totalHeight - radius, radius, 0, 0.5 * Math.PI)
      this.data.leftctx.lineTo(width, height + totalHeight)
      //坐下角
      this.data.leftctx.arc(width, height + totalHeight - radius, radius, 0.5 * Math.PI, 1 * Math.PI)
      this.data.leftctx.lineTo(20, height + radius)
      this.data.leftctx.setLineDash([5, 5], 5)
      //绘制内容文本
      var content = data.plan.split('');
      var row = '';
      for (var i = 0; i < content.length; i++) {
        if (this.data.leftctx.measureText(row + content[i]).width > contentRowWidth - 25) {
          this.data.leftctx.fillText(row, 20 + 13, height += 20);
          row = content[i];
        }
        else {
          row += content[i];
        }
      }
      this.data.leftctx.fillText(row, 20 + 13, height += 20)
      this.data.leftctx.stroke()
      this.data.leftctx.draw(true)
    }
    
  },
  //画右边计划框
  drawRightTips: function (completeData) {
    this.data.completeHeight=[]
    for (var index = 0; index < completeData.length; index++) {
      var data = completeData[index]   

      //定位时间
      var timeHeight = this.getTimeHeight(data.beginTime, data.endTime)
      //添加进计划时间数组
      this.data.completeHeight.push({
        begin: timeHeight.timeBeginHeight + this.data.topHeight,
        end: timeHeight.timeEndHeight + this.data.topHeight
      })
      this.data.rightctx.setFillStyle('#E95403')
      this.data.rightctx.fillRect(0, timeHeight.timeBeginHeight, 10, timeHeight.timeEndHeight - timeHeight.timeBeginHeight)
      this.data.rightctx.beginPath()

      this.data.rightctx.setFontSize(12)
      var totalWidth = Math.ceil(this.data.windowWidth / 2) - 20;
      var contentRowWidth = totalWidth - 40;
      var totalHeight = 0;
      var height = timeHeight.timeBeginHeight;
      var radius = 7;
      //计算右偏移量
      var addWidth = 23;
      var width = addWidth + radius;
      var contentWidth = this.data.rightctx.measureText(data.plan).width;
      totalHeight = Math.ceil(contentWidth / (contentRowWidth - 25)) * 20 + 10;
      //箭头高度
      var arrowHeight = totalHeight / 2;
      var arrow = 5.0;
      //箭头高度

      this.data.rightctx.setStrokeStyle("#E95403")
      //左上角
      this.data.rightctx.arc(width + 3, height + radius, radius, Math.PI, 1.5 * Math.PI)
      this.data.rightctx.lineTo(contentRowWidth + 20 - radius, height)
      //右上角
      this.data.rightctx.arc(contentRowWidth + 20 - radius, height + radius, radius, 1.5 * Math.PI, 2 * Math.PI)
      this.data.rightctx.lineTo(contentRowWidth + 20, height + totalHeight - radius)
      //右下角
      this.data.rightctx.arc(contentRowWidth + 20 - radius, height + totalHeight - radius, radius, 0, 0.5 * Math.PI)
      this.data.rightctx.lineTo(width, height + totalHeight)
      //左下角
      this.data.rightctx.arc(width, height + totalHeight - radius, radius, 0.5 * Math.PI, 1 * Math.PI)
      this.data.rightctx.lineTo(addWidth, height + arrowHeight + arrow);
      this.data.rightctx.lineTo(addWidth - 10, height + arrowHeight + arrow * 0.66);
      this.data.rightctx.lineTo(addWidth, height + arrowHeight);
      this.data.rightctx.lineTo(addWidth, height + radius)
      this.data.rightctx.setLineDash([5, 5], 5)
      //绘制内容文本
      this.data.rightctx.setFillStyle('#FF9900');
      var content = data.plan.split('');
      var row = '';
      for (var i = 0; i < content.length; i++) {
        if (this.data.rightctx.measureText(row + content[i]).width > contentRowWidth - 25) {
          this.data.rightctx.fillText(row, addWidth + 13, height += 20);
          row = content[i];
        }
        else {
          row += content[i];
        }
      }
      this.data.rightctx.fillText(row, addWidth + 13, height += 20)
      this.data.rightctx.stroke()
      this.data.rightctx.draw(true)
    }
   
  },
  /**
  * 初始化时间尺
  */
  drawTimeRule: function () {
    var windowWidth = this.data.windowWidth;
    var windowHeight = this.data.windowWidth;
    var startX = 0;
    const ctx = wx.createCanvasContext('rule', this);
    ctx.setFontSize(16);
    var dateLength = ctx.measureText(this.data.date);
    this.setData({
      pickerLeft: Math.ceil(windowWidth / 2) - 5 - Math.ceil((dateLength.width-40) / 2),
      leftTipsWidth: Math.ceil((windowWidth - 40) / 2)+1.5,
      rightTipsWidth: windowWidth - (Math.ceil((windowWidth - 40) / 2) + 2)-40
    })
    var hour = 24, space=this.data.space, height = 32 + space * 120;
    this.setData({
      useHeight: height
    })
    ctx.setFillStyle('#48D2A0');
    ctx.fillRect(startX, 0, 40, height);
    ctx.setStrokeStyle("#ffffff");
    ctx.setLineWidth(1);
    ctx.moveTo(startX-1, 0);
    ctx.lineTo(startX-1, height);
    ctx.stroke();
    ctx.setFontSize(15);
    for (var i = 0; i <= 24 * 5; i++) {
      var ruleColor = '#ffffff';
      var rest = i % 5;
      var s = i / 5;
      var lineWidth = 0;
      var height = 22 + space * i;
      if (rest == 0) {
        lineWidth = 5;
        ctx.setFillStyle('#ffffff');
        if (s < 10) {
          ctx.fillText(s, startX + 16, height+5);
        }
        else {
          ctx.fillText(s, startX + 11, height+5);
        }
      }
      ctx.setStrokeStyle(ruleColor);
      ctx.setLineWidth(1);
      ctx.moveTo(startX, height);
      ctx.lineTo(startX + 6 + lineWidth, height);
      ctx.moveTo(startX + 40, height);
      ctx.lineTo(startX + 34 - lineWidth, height);
      ctx.stroke();
    }
    ctx.draw();
  },
  //画完成度
  drawCompleteArc:function(){
    var windowWidth = this.data.windowWidth;
    var windowHeight = this.data.windowWidth;
    var _this=this;
    var startX = windowWidth-45;
    const ctx = wx.createCanvasContext('complete', this);
    ctx.beginPath();
    ctx.arc(startX, 45, 25, 0, 2 * Math.PI);
    ctx.setFillStyle('#FF8A0C');
    ctx.fill();
    ctx.beginPath();
    ctx.arc(startX, 45, 25, 0, (2*86 * Math.PI)/100);
    ctx.lineTo(startX, 45);
    ctx.setFillStyle('#00CA9D');
    ctx.fill();
    ctx.beginPath();
    ctx.setFillStyle('#00CA9D');
    ctx.setFontSize(12);
    var content="完成86%";
    ctx.fillText(content,startX-25,86,50);
  
    ctx.draw(true, setTimeout(function () {
      wx.canvasToTempFilePath({
        x: startX - 25,
        y: startX - 25,
        width: 50,
        height: 100,
        // destWidth: 50,
        // destHeight: 100,
        canvasId: 'complete',
        success: function (res) {
          _this.setData({
            filePath: res.tempFilePath,
            left: 100
          })
        },
        fail: function (res) {
          console.log(res);
        }
      })
    }, 500));
    
  },
  leftTipsTap:function(e){
    if(this.data.longTapFlg){
      this.setData({
        longTapFlg:false
      })
      return ;
    }
    var index = this.data.planHeight.findIndex(function (value) {
      return value.begin <= e.detail.y && value.end >= e.detail.y
    })
    if(index<0)return;
    this.data.planData[index].otype='edit'
    this.data.planData[index].owner = 'left'
    wx.setStorageSync('content', this.data.planData[index])
    wx.navigateTo(
      { url: "../plan/plan" }
    )
  },
  leftTipsLongTap:function(e){
    var _this=this;
    this.setData({
      longTapFlg:true
    })
    var height = e.touches[0].y+117;
    var index = this.data.planHeight.findIndex(function (value) {
      return value.begin <= height && value.end >= height
    })
    if (index < 0) return;
    this.data.planData[index].otype = 'delete'
    this.data.planData[index].owner = 'left'
    wx.showActionSheet({
      itemList: ['删除'],
      success(e) {
        _this.handleConfirmDialog(_this.data.planData[index])
      }
    })
  },
  rightTipsTap: function (e) {
    if (this.data.longTapFlg) {
      this.setData({
        longTapFlg: false
      })
      return;
    }
    var index = this.data.completeHeight.findIndex(function (value) {
      return value.begin <= e.detail.y && value.end >= e.detail.y
    })
    if (index < 0) return;
    this.data.completeData[index].otype = 'edit'
    this.data.completeData[index].owner = 'right'
    wx.setStorageSync('content', this.data.completeData[index])
    wx.navigateTo(
      { url: "../plan/plan" }
    )
  },
  rightTipsLongTap: function (e) {
    var _this = this;
    this.setData({
      longTapFlg: true
    })
    var height = e.touches[0].y + 117;
    var index = this.data.completeHeight.findIndex(function (value) {
      return value.begin <= height && value.end >= height
    })
    if (index < 0) return;
    this.data.completeData[index].otype = 'delete'
    this.data.completeData[index].owner = 'left'
    wx.showActionSheet({
      itemList: ['删除'],
      success(e) {
        _this.handleConfirmDialog(_this.data.completeData[index])
      }
    })
  },
  lastDay:function(){
    var date = utils.addDay(this.data.date, -1)
    this.setData({
      date:date,
      showDate: utils.getMonthDayWeek(date)
    })
  },
  nextDay:function(){
    var date = utils.addDay(this.data.date, 1)
    this.setData({
      date: date,
      showDate: utils.getMonthDayWeek(date)
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.dialog = this.selectComponent("#dialog");
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

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
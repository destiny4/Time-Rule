// components/dialog/dialog.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    title: {
      type: String,
      // 初始值
      value: '请确认提交信息'
    },
    content: {
      type: Object,
      value:{
        phid:0,
        beginTime:"8:01",
        endTime: "10:01",
        remark:'',
        plan:'',
        otype:'add'
      }
    },
    confirmText: {
      type: String,
      value: '确定'
    },
    cancelText: {
      type: String,
      value: '取消'
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    showDialog: false,
    _imageUrl: '/images/btn_ok_unable.png',
    disable:false
  },

  /**
   * 组件的方法列表
   */
  methods: {
    show() {
      this._checkData()
      this.setData({
        showDialog: true
      })
    },
    hide() {
      this.setData({
        showDialog: false
      })
    },
    /*
    * 内部私有方法建议以下划线开头
    * triggerEvent 用于触发事件
    */
    _cancel() {
      //触发取消回调
      this.triggerEvent("cancel")
    },
    _confirm() {
      //触发成功回调
      if(this.data.disable){
        this.hide()
      }
      this.triggerEvent("confirm",this.data.content);
    },
    _beginTimeChange:function(e){
      var data = this.data.content
      data.beginTime = e.detail.value
      this.setData({
        content: data
      })
      this._checkData();
    },
    _endTimeChange:function(e){
      var data = this.data.content
      data.endTime = e.detail.value
      this.setData({
        content: data
      })
      this._checkData();
    },
    _planBlur:function(e){
      var data = this.data.content
      data.plan = e.detail.value
      this.setData({
        content: data
      })
      this._checkData();
    },
    _remarkBlur: function (e) {
      var data = this.data.content
      data.remark = e.detail.value
      this.setData({
        content: data
      })
      this._checkData();
    },
    _checkData:function(){
      var data=this.data.content
      if (data.beginTime != '' && data.endTime != '' && data.remark != '' && data.plan != ''){
        this.setData({
          _imageUrl: '/images/btn_ok_able.png',
          disable:true
        })
      }
      else{
        this.setData({
          _imageUrl: '/images/btn_ok_unable.png'
        })
      }
    },
    _maskTap:function(){
      this.hide()
    },
    _alertTap:function(){

    }
  }
})

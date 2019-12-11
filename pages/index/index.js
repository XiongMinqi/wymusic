const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    indicatorDots: true,
    vertical: false,
    interval: 10,
    duration: 500,
    value: "",
    banner: [],
    id: 0,
    pid: 0,
    words: false,//当搜索有结果时显示
    num: 1,
    histories: [],
    history: [],
  },
  //点击热搜搜索
  searchWord(e){
    console.log(e)
    this.setData({
      value:e.currentTarget.dataset.value,
      words:true
    })
    this.searches()
  },
  // 点击历史搜索
  historylist(e){
    console.log(e)
    this.setData({
      value: e.currentTarget.dataset.item,
      words: true
    })
    this.searches()
  },
  //清空搜索历史
  clear(){
    wx.removeStorageSync("history")
    let histories = wx.getStorageSync("history")
    this.setData({
      histories
    })
  },
  // 热搜
  hot(){
    wx.showLoading({
      title: '加载中...',
    })
    app.globalData.fly.get(`/search/hot/detail`).then(res => {
      wx.hideLoading()
      let hotlist = res.data.data
      this.setData({
        hotlist
      })
      // console.log(res)
      // console.log(this.data.hotlist, "hotlist")
    }).catch(err => {
      console.log(err)
      wx.hideLoading()
    })
  },
  // 歌手详情
  musician(e) {
    console.log(e)
    let input = e.currentTarget.dataset.item
    let histories = wx.getStorageSync("history")
    this.setData({
      input,
      histories,
      history: histories
    })
    console.log(this.data.histories)
    // console.log(this.data.value)
    console.log(this.data.input)
    if (this.data.histories.length === 0) {
      console.log("本地没数据")
      this.data.history = []
      this.data.history.push(this.data.value)
      wx.setStorageSync("history", this.data.history)
    } else if (this.data.histories && this.data.histories.length < 6 && this.data.value !== "") {
      console.log("小于六")
      if (this.data.histories.indexOf(this.data.value) === -1) {
        this.data.history.unshift(this.data.value);
      }
      wx.setStorageSync("history", this.data.history)
      console.log(this.data.history)
    } else if (this.data.histories && this.data.histories.length >= 6 && this.data.value !== "") {
      console.log("大于六")
      if (this.data.histories.indexOf(this.data.value) === -1) {
        this.data.history.pop();
        this.data.history.unshift(this.data.value);
      }
      wx.setStorageSync("history", this.data.history)
    }
    wx.navigateTo({
      url: `/pages/search/search?value=${this.data.input}`,
    })
  },
  // 歌曲播放
  musicdetail(e) {
    console.log(e)
    let inputitem = e.currentTarget.dataset.item
    let histories = wx.getStorageSync("history")
    this.setData({
      inputitem,
      histories,
      history: histories
    })
    console.log(this.data.value)
    if (this.data.histories.length === 0) {
      // console.log("本地没数据")
      this.data.history = []
      this.data.history.push(this.data.value)
      wx.setStorageSync("history", this.data.history)
    } else if (this.data.histories && this.data.histories.length < 6 && this.data.value !== "") {
      // console.log("小于六")
      if (this.data.histories.indexOf(this.data.value) === -1) {
        this.data.history.unshift(this.data.value);
      }
      wx.setStorageSync("history", this.data.history)
      console.log(this.data.history)
    } else if (this.data.histories && this.data.histories.length >= 6 && this.data.value !== "") {
      // console.log("大于六")
      if (this.data.histories.indexOf(this.data.value) === -1) {
        this.data.history.pop();
        this.data.history.unshift(this.data.value);
      }
      wx.setStorageSync("history", this.data.history)
    }
     wx.navigateTo({
       url: `/pages/search/search?value=${this.data.inputitem}`,
    })
  },
  onCancel() {
    this.setData({
      num: 1
    })
  },
  onsearch(){
    this.setData({
      num: 0
    })
  },
  oninput(e) {
    console.log(e)
    this.setData({
      value: e.detail,
      num: 0
    })
  },
  // 搜索共同方法
  searches(){
    if (this.data.value === '') {
      let histories = wx.getStorageSync("history")
      this.setData({
        words: false,
        histories
      })
      // console.log(this.data.histories)
    } else if (this.data.value !== '') {
      wx.showLoading({
        title: '搜索中...',
      })
      app.globalData.fly.get(`/search/suggest?keywords= ${this.data.value}`).then(res => {
        wx.hideLoading()
        let result = res.data.result
        this.setData({
          result
        })
        console.log(res)
        console.log(this.data.result, "result")
      }).catch(err => {
        console.log(err)
        wx.hideLoading()
      })
    }
  },
  // 搜索
  onSearch(e) {
    // console.log(e)
      this.setData({
        value: e.detail,
        words: true
      })
    this.searches()
  },
  searchvalue(e){
    console.log(e)
    let value = e.currentTarget.dataset.item
    this.setData({
      value
    })
    wx.navigateTo({
      url: `/pages/search/search?value=${this.data.value}`,
    })
  },
  //轮播图
  getShuffling() {
    wx.showLoading({
      title: '加载中...',
    })
    app.globalData.fly.get(`/banner`).then(res => {
      wx.hideLoading()
      let banner = res.data.banners
      this.setData({
        banner
      })
      // console.log(res)
      // console.log(this.data.banner, "banner")
    }).catch(err => {
      console.log(err)
      wx.hideLoading()
    })
  },
  playvedio(e) {
    console.log(e)
    let id = e.currentTarget.dataset.item.targetId
    let pid = e.currentTarget.dataset.item.encodeId
    this.setData({
      id,
      pid
    })
    wx.navigateTo({
      url: `/pages/playing/playing?playid=${this.data.id}&indexflag=true`,
    })
    console.log(this.data.id)
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getShuffling()
    this.hot()
    let histories = wx.getStorageSync("history")
    this.setData({
      histories
    })
    // console.log(this.data.histories)
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
// pages/posts/posts_detail/posts_detail.js
const local_detail_data = require("../../../data/detail_data.js");
// 获取全局变量
const app = getApp();

Page({

    /**
     * 页面的初始数据
     */
    data: {
        qizhiBtn: false
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        // 获取链接的id
        var detailId = options.id;
        // console.log(detailId);

        //把数据传入data
        this.setData({
            local_detail_data: local_detail_data.detail_list,
            detailId: detailId
        });

        this.shoucangCache();
        this.onIsMusic();
    },

    // 收藏缓存
    shoucangCache: function () {
        /**
         *本地缓存cache
         *重要思路:使用缓存时，不用先想该缓存有没有，该怎么创建。可以先想该怎么调用缓存（假设已经存在）
         */
        var shoucangCache = wx.getStorageSync("shoucangCacheList");
        // 判断缓存是否存在
        if (shoucangCache) {
            var shoucang_item = shoucangCache[this.data.detailId];
            this.setData({
                qizhiBtn: shoucang_item
            });
        }
        else {
            // 如果缓存不存在，创建缓存。并存入值
            var shoucangCache = {};
            shoucangCache[this.data.detailId] = false;
            wx.setStorageSync("shoucangCacheList", shoucangCache);
        }
    },

    // 音乐监听函数
    onIsMusic: function () {
        var that = this;

        // 获取全局音乐控制变量
        if (app.globalData.g_isMusicBtn && app.globalData.g_isMusicId == this.data.detailId) {
            this.setData({
                isMusicBtn: true
            });
        }

        // 监听音乐的播放和暂停
        wx.onBackgroundAudioPlay(function () {
            that.setData({
                isMusicBtn: true
            });
            app.globalData.g_isMusicBtn = true;
        });
        wx.onBackgroundAudioPause(function () {
            that.setData({
                isMusicBtn: false
            });
            app.globalData.g_isMusicBtn = false;
        });
        // 监听音乐自然停止
        wx.onBackgroundAudioStop(function () {
            that.setData({
                isMusicBtn: false
            });
            app.globalData.g_isMusicBtn = false;
        })
    },

    onShoucangBtn: function (event) {
        // 读取收藏缓存
        var shoucangCache = wx.getStorageSync("shoucangCacheList");
        // 找到是否收藏的键值
        var shoucang_item = shoucangCache[this.data.detailId];
        // 取反，收藏编程 未收藏
        shoucang_item = !shoucang_item;
        // 将取反的值重新赋值缓存键值，文章是否保存
        shoucangCache[this.data.detailId] = shoucang_item;

        // 把改变的缓存值，重新保存。记住文章保存与否。
        wx.setStorageSync("shoucangCacheList", shoucangCache);

        // （重点）更改数据绑定，从而实现图片转换
        this.setData({
            qizhiBtn: shoucang_item
        });

        // 提示弹窗，提示用户是否收藏 增加用户体验。
        wx.showToast({
            title: shoucang_item ? '收藏成功！' : '取消收藏！',
            duration: 800
        })

        // this.onShowModal(shoucang_item, shoucangCache);

    },
    /*比较showToast和showModal 的逻辑*/
    // onShowModal: function (shoucang_item, shoucangCache) {
    //     var that = this;//在下面的success函数中，this发生改变了。

    //     wx.showModal({
    //         title: shoucang_item ? '收藏' : '取消收藏！',
    //         content: shoucang_item ? '你要收藏该文章吗？' : '你要取消收藏该文章吗？',
    //         showCancel: true,
    //         cancelText: '取消',
    //         cancelColor: '#CCC',
    //         confirmText: '确认',
    //         success: function (res) {
    //             if (res.confirm == true) {
    //                 wx.setStorageSync("shoucangCacheList", shoucangCache);
    //                 // （重点）更改数据绑定，从而实现图片转换
    //                 that.setData({
    //                     qizhiBtn: shoucang_item
    //                 });

    //                 // 提示弹窗，提示用户是否收藏 增加用户体验。
    //                 wx.showToast({
    //                     title: shoucang_item ? '收藏成功！' : '取消收藏！',
    //                     duration: 800
    //                 })
    //             }
    //         }
    //     })
    // }

    // 分享按钮函数
    onSheetBtn: function () {
        var that = this;
        var itemList = ['分享到微信好友', '分享到朋友圈', '分享到QQ', '分享到QQ空间'];

        wx.showActionSheet({
            itemList: itemList,
            itemColor: '#405F80',
            success: function (res) {

                //res.cancel  用户是否点击了取消按钮。
                //res.tapIndex 用户点击的数组的第几项，从0开始的。
                if (res.cancel) {
                    console.log("取消的逻辑业务。");
                }
                else {
                    wx.showModal({
                        title: '分享' + that.data.local_detail_data[that.data.detailId].detail_title,
                        content: '你要' + itemList[res.tapIndex] + '吗？'
                    })
                }


            }
        })
    },

    //音乐按钮播放控制
    onMusicBtn: function () {
        var isMusicBtn = this.data.isMusicBtn;
        // 把点击模板id 赋值给全局变量id
        app.globalData.g_isMusicId = this.data.detailId;

        var detail_music = this.data.local_detail_data[this.data.detailId].detail_music;

        if (isMusicBtn) {
            wx.pauseBackgroundAudio();
            this.setData({
                isMusicBtn: false
            });
        }
        else {
            wx.playBackgroundAudio({
                dataUrl: detail_music.dataUrl,
                title: detail_music.title,
                coverImgUrl: detail_music.coverImgUrl
            })

            this.setData({
                isMusicBtn: true
            });
        }
    }
})
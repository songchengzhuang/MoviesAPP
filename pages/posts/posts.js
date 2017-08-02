// require还不支持绝对路径。
const local_posts_data = require("../../data/posts_template.js");
const posts_swiper_img = require("../../data/posts_swiper.js");

Page({

    /**
     * 页面的初始数据
     */
    data: {

    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

        this.setData({
            posts_list: local_posts_data.posts_list,
            posts_swiper_img: posts_swiper_img.swiper_img_src
        });

        // 加载文章数 缓存
        this.txtDetailNumCache();
    },

    onDetailTap: function (event) {

        //自定义指令的值data-
        var detailId = event.currentTarget.dataset.detailId;

        wx.navigateTo({
            url: 'posts_detail/posts_detail?id=' + detailId,
        })

        this.txtDetailNum(detailId);
    },

    // 绑定文章观看数量函数
    txtDetailNum: function (detailId) {
        //获取缓存
        var txtDetailNum = wx.getStorageSync("txtDetailNumList");
        var detailNum_item = txtDetailNum[detailId] - 0;
        // 这里减0，为的让detailNum_item是 数字形式，是js的隐藏属性。

        // 点击一下 点赞数量加1
        detailNum_item += 1;
        txtDetailNum[detailId] = detailNum_item;
        wx.setStorageSync("txtDetailNumList", txtDetailNum);

        // 数据绑定
        this.setData({
            txtDetailNum: txtDetailNum
        });
    },


    /**
     * 理解事件冒泡、捕获
     * currentTarget和target的不同，(点击事件)
     * currentTarget指的事件捕获的组件，target指的点击的组件(冒泡)，
     * 及 currentTarget指的swiper，target指的image(点击元素本身)。
     */
    onSwiperTop: function (event) {
        //自定义指令的值data-
        var detailId = event.target.dataset.detailId;

        wx.navigateTo({
            url: 'posts_detail/posts_detail?id=' + detailId,
        })

        this.txtDetailNum(detailId);
    },

    // 缓存文章数
    txtDetailNumCache: function () {
        /**
        *本地缓存cache
        *重要思路:使用缓存时，不用先想该缓存有没有，该怎么创建。可以先想该怎么调用缓存（假设已经存在）
        */
        var txtDetailNum = wx.getStorageSync("txtDetailNumList");
        // 判断缓存是否存在
        if (txtDetailNum) {
            this.setData({
                txtDetailNum: txtDetailNum
            });
        }
        else {
            // 如果缓存不存在，创建缓存。并存入值
            var txtDetailNum = {};
            for (var i = 0; i < this.data.posts_list.length; i++) {
                txtDetailNum[i] = 0;
            }

            wx.setStorageSync("txtDetailNumList", txtDetailNum);

            this.setData({
                txtDetailNum: txtDetailNum
            });
        }
    },

    // 清除小程序缓存
    clearHuancun: function () {
        wx.clearStorage();
        // 弹窗提示
        wx.showToast({
            title: '清除缓存成功！',
            duration: 800
        })
    }

})
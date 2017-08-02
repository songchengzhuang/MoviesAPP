// 获取 全局变量
var app = getApp();
const moviesAPI = require("../moviesPublic/moviesPublic.js");

Page({

    /**
     * 页面的初始数据
     */
    data: {
        navTitle: '',
        urlStart: 0,
        movieMovUrl: '',
        newMovies: [],
        orMoreMve: false,//判断是 第一次加载 还是下滑更多电影加载
        isFreshing: false//防止下拉到底 多次执行 
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var moreMovTit = options.navTitle;
        this.setData({
            navTitle: moreMovTit
        });

        // 获取更多电影
        var movieMovUrl = '';
        switch (moreMovTit) {
            case '正在上映':
                movieMovUrl = app.globalData.movieBase + "/v2/movie/in_theaters";
                break;
            case '即将上映':
                movieMovUrl = app.globalData.movieBase + "/v2/movie/coming_soon";
                break;
            case '豆瓣电影':
                movieMovUrl = app.globalData.movieBase + "/v2/movie/top250";
                break;
        }

        this.data.movieMovUrl = movieMovUrl;

        //
        //this.movieList(movieMovUrl);

        // 调用获取豆瓣数据的  公共方法。
        moviesAPI.movieList(movieMovUrl, this.movieData);
    },
    /**
     * 生命周期函数--监听页面加载完成时执行
     */
    onReady: function () {
        // 动态改变导航名
        wx.setNavigationBarTitle({
            title: this.data.navTitle
        })
    },

    // 提取豆瓣的电影信息
    movieData: function (movies) {
        var newMovies = [];
        var head = movies.title.substring(0, 4);

        for (var num in movies.subjects) {
            var subject = movies.subjects[num];

            var movie_data = {
                alt: subject.alt,
                imageUrl: subject.images.large,
                title: subject.title,
                pingfen: subject.rating.average,
                movieId: subject.id
            }

            newMovies.push(movie_data);
        }
        // console.log('下滑测试')
        //通过判断，拼接 旧的数据和新更新的数据。
        if (newMovies.length == 0) {
            // 关闭 正在加载提示
            wx.hideNavigationBarLoading();
            // 提示弹窗，提示用户是否收藏 增加用户体验。
            wx.showToast({
                title: '已全部加载！',
                duration: 1500
            })
            return;
        }
        else {
            var totalMovies = [];

            if (this.data.orMoreMve) {
                // 拼接两个 新旧电影数组
                totalMovies = this.data.newMovies.concat(newMovies);
            }
            else {
                totalMovies = newMovies;
                this.data.orMoreMve = true;
            }

            this.setData({
                newMovies: totalMovies,
            });

            this.data.urlStart += 20;
            //
            this.data.isFreshing = false;
            // 关闭 正在加载提示
            wx.hideNavigationBarLoading();
            //关闭下拉 更新
            wx.stopPullDownRefresh();
        }
    },

    //实现 底部上划添加 更多电影
    onReachBottom: function () {
        if (this.data.isFreshing) {

            return;
        }
        else {
            var newMoreMovUrl = this.data.movieMovUrl + '?start=' + this.data.urlStart + '&&count=20';
            moviesAPI.movieList(newMoreMovUrl, this.movieData);

            // 出现正在加载的提示。
            wx.showNavigationBarLoading();

            this.data.isFreshing = true;
        }
    },

    //实现 顶部下拉 刷新电影数据,onPullDownRefresh是框架给的
    onPullDownRefresh: function () {
        var firstMoreUrl = this.data.movieMovUrl + '?start=0&&count=20';
        this.data.newMovies = [];
        this.data.orMoreMve = true;
        this.data.urlStart = 0;
        moviesAPI.movieList(firstMoreUrl, this.movieData);

        // 出现正在加载的提示。
        wx.showNavigationBarLoading();
    },

    // 电影详情的点击事件
    onMovieDetail: function (event) {
        var movieId = event.currentTarget.dataset.movieId;

        wx.navigateTo({
            url: '../movieDetail/movieDetail?movieId=' + movieId
        })
    }
})
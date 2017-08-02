// pages/movies/movieDetail/movieDetail.js
const moviesAPI = require("../moviesPublic/moviesPublic.js");
var app = getApp();

Page({

    /**
     * 页面的初始数据
     */
    data: {
        movieShow: false,
        hideImg: true
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var movieId = options.movieId;
        var movieDetailUrl = app.globalData.movieBase + "/v2/movie/subject/" + movieId;

        moviesAPI.movieList(movieDetailUrl, this.movieData);
        // 控制 海报自动隐藏
        setTimeout(this.hideImg, 3000);
    },
    // 控制 海报自动隐藏
    hideImg: function () {
        this.setData({
            hideImg: false
        });
    },

    movieData: function (movieDet) {

        // 循环出数据中的导演
        var director = [];
        for (var dirItems in movieDet.directors) {
            var dirItem = movieDet.directors[dirItems];

            director.push(dirItem.name);
        }
        // 循环出数据中的演员
        var casts = [];
        var castsImg = [];
        for (var castsItems in movieDet.casts) {
            var castsItem = movieDet.casts[castsItems];
            casts.push(castsItem.name);
            castsImg.push(castsItem.avatars.medium);
        }

        // 整合数据
        var movie_data = {
            movieImg: movieDet.images.large,
            movieName: movieDet.title.substring(0, 4),
            moviePlace: movieDet.countries,
            movieTime: movieDet.year,
            peopleLike: movieDet.wish_count,
            peopleComment: movieDet.reviews_count,
            originalName: movieDet.original_title,
            pingfen: movieDet.rating.average,
            movieDirector: director.join("、"),
            movieStar: casts.join("/"),
            movieKind: movieDet.genres.join("、"),
            movieTxt: movieDet.summary,
            starImg: castsImg
        }

        this.setData(movie_data);
    },
    // 显示隐藏电影
    showMovie: function () {
        var movieShow = this.data.movieShow;
        movieShow = !movieShow;
        this.setData({
            movieShow: movieShow
        });
    }
})
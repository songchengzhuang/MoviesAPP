//获取豆瓣电影api的数据的公共方法。

function movieList(movieUrl, callBack) {

    wx.request({
        url: movieUrl,
        method: "GET",
        header: {
            // 这里就是填application/json报错。不填 都不报错
            "Content-Type": "application/xml"
        },
        success: function (res) {

            //调用电影信息提取函数
            callBack(res.data);
        },
        fail: function (error) {
            console.log(error);
        },
    })
}

module.exports = {
    movieList: movieList
}
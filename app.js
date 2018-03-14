App({

    globalData: {
        g_isMusicBtn: false,
        g_isMusicId: -1,
        movieBase: "https://douban.uieee.com"
    },

    /**
     * 当小程序初始化完成时，会触发 onLaunch（全局只触发一次）
     */
    onLaunch: function () {
        wx.onBackgroundAudioPlay(function () {
            this.isMusicBtn = true;
        });
        wx.onBackgroundAudioPause(function () {
            this.isMusicBtn = false;
        });
    }
})

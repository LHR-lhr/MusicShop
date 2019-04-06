(function (window) {
    function Player($audio) {
        return new Player.prototype.init($audio);
    }
    Player.prototype = {
        constructor: Player,
        init: function ($audio) {
            this.$audio = $audio;
            this.audio = $audio.get(0);
        },
        musicList: [],
        currentId: -1,
        currentIndex:-1,
        playMusic: function (id,index) {
            var ele=this.$audio,ele1=this.audio;
            if (this.currentId == id) {
                //同一首音乐
                if (this.audio.paused) {
                    this.audio.play();
                } else {
                    this.audio.pause();
                }
            } else {
                //非同一首
                var song = {}, songlist = [], xcode,src;
                $.ajax({
                    url: 'http://ting.baidu.com/data/music/links',
                    type: 'GET',
                    data: {
                        songIds: id,
                        format: 'json'
                    },
                    dataType: 'JSONP',
                    success: function (data) {
                        console.log(data);
                        for (var key in data) {
                            if (key == 'data') {
                                song = data[key];
                                for (var key1 in song) {
                                    if (key1 == 'songList') {
                                        songlist = song[key1];
                                    } else if (key1 == 'xcode') {
                                        xcode = song[key1];
                                    }
                                }
                                $('.song_info_pic').find('img').attr('src', songlist[0].songPicBig);//显示歌曲图片
                                $('.mask_bg').css('background',"url('"+songlist[0].songPicBig+"')");
                                $('.song_info_ablum').find('a').text(songlist[0].albumName);
                                //计算歌曲时间并显示
                                var minutes = parseInt((songlist[0].time) / 60);
                                if (minutes < 10) {
                                    minutes = '0' + minutes;
                                }
                                var seconds = songlist[0].time - minutes * 60;
                                var time = minutes + ' : ' + seconds;
                                $('.songTime').text(time);
                            }                        }
                        var msg = songlist[0].showLink.split('?');
                        src = msg[0] + '?xcode=' + xcode;
                        //百度API似乎不允许跨域播放，服务器返回代码403
                        ele.attr("src", src);
                        ele1.load().play();
                    }
                })
                this.currentId=id;
                this.currentIndex=index;
            }
        },
        preIndex:function () {
            var index=this.currentIndex-1;
            if(index<0){
                index=this.musicList.length-1;
                console.log(index);
            }
            return index;
        },
        nextIndex:function () {
            var index=this.currentIndex+1;
            if(index>this.musicList.length-1){
                index=0;
            }
            return index;
        },
        changeMusic:function (index) {
            //删除对应数据
            this.musicList.splice(index,1);
            //判断当前删除的是否在正在播放的音乐之前
            if(index<this.currentIndex){
                this.currentIndex=this.currentIndex-1;
            }
        }
    };
    Player.prototype.init.prototype=Player.prototype;
    window.Player=Player;
})(window);
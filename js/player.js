(function (window) {
    function Player($audio) {
        return new Player.prototype.init($audio);
    }
    Player.prototype = {
        constructor:Player,
        musicList:[],
        init:function ($audio) {
            this.$audio=$audio;
            this.audio=$audio.get(0);
        },
        currentId:-1,
        playMusic:function (id) {
            if(this.currentId==id){
                //同一首音乐
                if(this.audio.paused){
                    this.audio.play();
                }else{
                    this.audio.pause();
                }
            }else{
                //非同一首
                var song={},songlist=[],xcode;
                $.ajax({
                    url:'http://ting.baidu.com/data/music/links',
                    type: 'GET',
                    data: {
                        songIds:id,
                        format: 'json'
                    },
                    dataType:'JSONP',
                    success:function (data) {
                        console.log(data);
                        for(var key in data){
                            if(key=='data'){
                                song=data[key];
                                for(var key1 in song){
                                    if(key1=='songList'){
                                        songlist=song[key1];
                                    }else if(key1=='xcode'){
                                        xcode=song[key1];
                                    }
                                }
                                $('.song_info_pic').find('img').attr('src',songlist[0].songPicBig);//显示歌曲图片
                                //计算歌曲时间并显示
                                var minutes=parseInt((songlist[0].time)/60);
                                if(minutes<10){
                                    minutes='0'+minutes;
                                }
                                var seconds=songlist[0].time-minutes*60;
                                var time=minutes+' : '+seconds;
                                $('.songTime').text(time);
                            }
                        }
                        var msg=songlist[0].showLink.split('?');
                        var src=msg[0]+'?xcode='+xcode;
                        console.log(src);
                        console.log(this.$audio);
                        this.$audio.attr("src",src);
                        this.audio.play();
                        //百度API似乎不允许跨域播放，服务器返回代码403
                       // this.$audio.attr("src",songlist[0].showLink);
                        //this.audio.load().play();
                    }
                })
            }
        }
    }
    Player.prototype.init.prototype=Player.prototype;
    window.Player=Player;
})(window);
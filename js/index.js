$(function () {
    //自定义滚动条
    var index=0;
    $('.content_list').mCustomScrollbar();
    var $audio=$('audio');
    var player=new Player($audio);

    //监听歌曲移入移出事件:事件委托
    $('.content_list').delegate('.list_music','mouseenter',function () {
        $(this).find('.list_menu').stop().fadeIn(100);
        $(this).find('.list_time a').stop().fadeIn(100);
        //隐藏时长
        $(this).find('.list_time span').stop().fadeOut(100);
    })
    $('.content_list').delegate('.list_music','mouseleave',function () {
        $(this).find('.list_menu').stop().fadeOut(100);
        $(this).find('.list_time a').stop().fadeOut(100);
        //显示时长
        $(this).find('.list_time span').stop().fadeIn(100);
    })
    //监听复选框点击事件
    $('.content_list').delegate('.list_check','click',function () {
        $(this).toggleClass('list_checked');
    })
    //添加子菜单播放按钮监听
    var $musicPlay=$('.music_play');
    $('.content_list').delegate('.list_menu_play','click',function () {
        var $item=$(this).parents('.list_music');
        $(this).toggleClass('list_menu_play2');
        $item.siblings().find('.list_menu_play').removeClass('list_menu_play2');
        if($(this).attr('class').indexOf('list_menu_play2')!=-1){
            $musicPlay.addClass('music_play2');
            $item.find('div').css('color','#fff');
            $item.siblings().find('div').css('color','rgba(255,255,255,0.5)');
        }else{
            $musicPlay.removeClass('music_play2');
            $item.find('div').css('color','rgba(255,255,255,0.5)');
        }
        $item.find('.list_number').toggleClass('list_number2');
        $item.siblings().find('.list_number').removeClass('list_number2');
        var id=$item.attr('id');
        var name=$item.find('.list_name').text();
        var singer=$item.find('.list_singer').text();
        var ablum=$item.find('.list_singer').data('song-album');
        $('.song_info_name').find('a').text(name);
        $('.songName').text(name);
        $('.song_info_singer').find('a').text(singer);
        $('.songSinger').text(singer);
        $('.song_info_ablum').find('a').text(ablum);
        //player.playMusic(id);

    })
    $musicPlay.on('click',function () {
        $(this).toggleClass('music_play2');
    })
    $musicPlay.on('click',function () {
        $(this).toggleClass('music_play2');
    })
    $musicPlay.on('click',function () {
        $(this).toggleClass('music_play2');
    })
    $('.register li:first').on('click',function (e) {
        var str=$('.search').val();
        var info={};
        var song=[],album=[],artist=[];
        if(!(str===null)){
            $.ajax({
                url:'http://tingapi.ting.baidu.com/v1/restserver/ting',
                type:'GET',
                data:{
                    format:'json',
                    from:'webapp_music',
                    method:'baidu.ting.search.catalogSug',
                    query:str
                },
                dataType:'JSONP',
                success:function (data) {
                    var songinfo=eval('('+JSON.stringify(data)+')');
                    for(var key in songinfo){
                        if(key==='song'){
                            song=songinfo[key];
                            console.log(song);
                        }
                        else if(key==='album'){
                            album=songinfo[key];
                        }
                        else if(key==='artist'){
                            artist=songinfo[key];
                        }
                    }
                    player.musicList=song;
                    setPlayer(song,album,artist);
                },
                error:function () {
                    console.log('w(ﾟДﾟ)w地址好像出了差错');
                    alert('w(ﾟДﾟ)w地址好像出了差错');
                }
            })
        }

    })
    function setPlayer(song,album,artist) {
        for (let i=0;i<song.length;i++){
            let songname=song[i].songname;
            let songartist=song[i].artistname;
            let songid=song[i].songid;
            let songalbum=album[i].albumname;
            var $item=$("<li class=\"list_music\" id="+songid+">\n" +
                "                        <div class=\"list_check\"><i></i></div>\n" +
                "                        <div class=\"list_number\">"+(i+1+index)+"</div>\n" +
                "                        <div class=\"list_name\">"+ songname+" " +
                "                            <div class=\"list_menu\">\n" +
                "                                <a href=\"javascript:;\" title=\"播放\" class='list_menu_play'></a>\n" +
                "                                <a href=\"javascript:;\" title=\"添加\"></a>\n" +
                "                                <a href=\"javascript:;\" title=\"下载\"></a>\n" +
                "                                <a href=\"javascript:;\" title=\"分享\"></a>\n" +
                "                            </div>\n" +
                "                        </div>\n" +
                "                        <div class=\"list_singer\" data-song-album="+songalbum+">"+songartist+"</div>\n" +
                "                        <div class=\"list_time\">\n" +
                "                            <span>"+songalbum+"</span>\n" +
                "                            <a href=\"javascript:;\" title=\"删除\"></a>\n" +
                "                        </div>\n" +
                "                    </li>")

            var $musicList =$('.content_list ul');
            $musicList.append($item);
        }
        index=index+song.length;
    }
});

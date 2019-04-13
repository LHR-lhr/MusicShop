$(function () {
    //自定义滚动条
    var index=0;
    $('.content_list').mCustomScrollbar();
    //播放相关
    var $audio=$("audio");
    var player=new Player($audio);

    //音乐进度条相关
    var $progressBar=$('.music_progress_bar');
    var $progressLine=$('.music_progress_line');
    var $progressDot=$('.music_progress_dot');
    var progress=Progress($progressBar,$progressLine,$progressDot);
    //音量进度条相关
    var $vocieBar=$('.music_voice_bar');
    var $vocieLine=$('.music_voice_line');
    var $vocieDot=$('.music_voice_dot');
    var progress1=Progress($vocieBar,$vocieLine,$vocieDot);
    progress.progressClick();
    progress.progressMove();
    progress1.progressClick();
    progress1.progressMove();
    //监听事件
    initEvents();
    function initEvents(){
        //主页点击
        $('#content').find('span').click(function () {
            $('#mask_bg').hide('slow');
        })
        $('#content').find('input').click(function () {
            $('#content').find('span').trigger('click');
        })
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
            var id=$item.attr('id'),index=$item.get(0).index;
            var name=$item.find('.list_name').text();
            var singer=$item.find('.list_singer').text();
            $('.song_info_name').find('a').text(name);
            $('.songName').text(name);
            $('.song_info_singer').find('a').text(singer);
            $('.songSinger').text(singer);
            player.playMusic(id,index);

        })
        //监听底部控制区域播放按钮的点击
        $musicPlay.on('click',function () {
            if(player.currentId==-1){
                //没有播放过音乐
                $('.list_music').eq(0).find('.list_menu_play').trigger('click');
            }else{
                $('.list_music').eq(player.currentIndex).find('.list_menu_play').trigger('click');
            }
        })
        //监听底部控制区域上一首按钮的点击
        $('.music_pre').on('click',function () {
            $('.list_music').eq(player.preIndex()).find('.list_menu_play').trigger('click');
        })
        //监听底部控制区域下一首按钮的点击
        $('.music_next').on('click',function () {
            $('.list_music').eq(player.nextIndex()).find('.list_menu_play').trigger('click');
        })
        //监听删除按钮的点击事件
        $('.content_list').delegate('.list_menu_del',"click",function () {
            //找到被点击的音乐
            var $item = $(this).parents('.list_music');
            //判断当前删除的是否是正在播放的
            if($item.get(0).index==player.currentIndex){
                $('.music_next').trigger('click');
            }
            $item.remove();
            player.changeMusic($item.get(0).index);
            //重新排序
            $('.list_music').each(function (index,ele) {
                ele.index=index;
                $(ele).find('.list_number').text(index+1);
            })
        })
        //搜索音乐
        $('.register li:first').on('click',function () {
            var str=$('.search').val();
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
                        console.log(songinfo);
                        for(var key in songinfo){
                            if(key==='song'){
                                song=songinfo[key];
                            }
                            else if(key==='album'){
                                album=songinfo[key];
                            }
                        }
                        player.musicList=song;
                        setPlayer(song);
                    },
                    error:function () {
                        console.log('w(ﾟДﾟ)w地址好像出了差错');
                        alert('w(ﾟДﾟ)w地址好像出了差错');
                    }
                })
            }
        })
    }
    //歌曲列表动态生成
    function setPlayer(song) {
        for (let i=0;i<song.length;i++){
            let songname=song[i].songname;
            let songartist=song[i].artistname;
            let songid=song[i].songid;
            let songalbum=song[i].info;
            var $item=$("<li class=\"list_music\" id="+songid+" data-id="+(i+index)+">\n" +
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
                "                            <a href=\"javascript:;\" title=\"删除\" class=\"list_menu_del\"></a>\n" +
                "                        </div>\n" +
                "                    </li>")

            var $musicList =$('.content_list ul');
            $musicList.append($item);
            $item.get(0).index=i+index;
        }
        //index=index+song.length;
    }
});

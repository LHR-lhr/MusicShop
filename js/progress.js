(function (window) {
    function Progress($progressBar,$progressLine,$progressDot) {
        return new Progress.prototype.init($progressBar,$progressLine,$progressDot);
    }
    Progress.prototype = {
        constructor: Progress,
        init: function ($progressBar,$progressLine,$progressDot) {
            this.$progressBar=$progressBar;
            this.$progressLine=$progressLine;
            this.$progressDot=$progressDot;
        },
        progressClick:function () {
            var $this=this;
            //监听背景的点击
            this.$progressBar.on('click',function (e) {
                let normalLeft=$(this).offset().left;
                //获取点击位置距离窗口的位置
                let eventLeft=e.pageX;
                //设置前景的宽度
                $this.$progressLine.css('width',eventLeft-normalLeft);
                $this.$progressDot.css('left',eventLeft-normalLeft);
            })
        },
        progressMove:function () {
            var $this=this;
            //监听鼠标按下事件
            this.$progressBar.mousedown(function () {
                let normalLeft=$(this).offset().left;
                //let parW=$(this).parent('.music_progress_info').width();
                let parW=$(this).parent().width();
                if(parW==105){
                    parW=70;
                }
                //监听鼠标移动事件
                $(document).mousemove(function (e) {
                    let eventLeft=e.pageX;
                    //设置前景的宽度
                    if(eventLeft<=normalLeft){
                        $this.$progressLine.css('width',0);
                        $this.$progressDot.css('left',0);
                    }else if(eventLeft-normalLeft>=parW){
                        $this.$progressLine.css('width',parw);
                        $this.$progressDot.css('left',parw);
                    }
                    else{
                        $this.$progressLine.css('width',eventLeft-normalLeft);
                        $this.$progressDot.css('left',eventLeft-normalLeft);
                    }
                })
            });
            //监听鼠标抬起事件
            $(document).mouseup(function () {
                $(document).off('mousemove')
            })
        }
    }
    Progress.prototype.init.prototype=Progress.prototype;
    window.Progress=Progress;
})(window);
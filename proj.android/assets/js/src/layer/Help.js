/**
 * help
 * @return {[type]} [description]
 */
var HelpScene = $.scene(function(){
    return {
        init: function(){
            BaseScene.initFrameCache();
            this._super();
            BaseScene.initBg.call(this);
            $.setBackgroundMusic(R.audio_bg);
            this.initNav();
            this.initHelp();
            this.initBackBtn();
            return true;
        },
        initNav: function(){
            var nav = BaseScene.initNavBg.call(this);
            var sprite = cc.Sprite.createWithSpriteFrameName("txt_help.png");
            sprite.setAnchorPoint(cc.p(0, 0));
            var left = (this.getWinSize().width - sprite.getContentSize().width)/2;
            sprite.setPosition(cc.p(left, 30));
            nav.addChild(sprite);
        },
        initHelp: function(){
            var sprite = cc.Sprite.create(R.img_help);
            var winSize = this.getWinSize();
            var contentSize = sprite.getContentSize();
            sprite.setPosition(cc.p(winSize.width/2, winSize.height/2));
            this.addChild(sprite);
        },
        initBackBtn: function(){
            var menu = BaseScene.getBackBtn.call(this, function(){
                BaseScene.btnClick();
                cc.Director.getInstance().popScene();
            });
            var winSize = this.getWinSize();
            menu.setPosition(winSize.width - 156, 5);
        }
    }
})
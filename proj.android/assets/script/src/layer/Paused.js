/**
 * 暂停
 * @return {[type]} [description]
 */
var PausedScene = $.scene(function(){
    var node = {
        restart: null
    }
    return {
        init: function(){
            this._super();
            BaseScene.initFrameCache();
            BaseScene.initBg.call(this);
            this.initNav();
            this.initMenuBtn();
            var left = (this.getWinSize().width - 270) / 2;
            BaseScene.initSoundBtn.call(this, left, 100);
            $.setBackgroundMusic(R.audio_bg);
            return true;
        },
        initNav: function(){
            var nav = BaseScene.initNavBg.call(this);
            var sprite = cc.Sprite.createWithSpriteFrameName("txt_paused.png");
            sprite.setAnchorPoint(cc.p(0, 0));
            var left = (this.getWinSize().width - sprite.getContentSize().width)/2;
            sprite.setPosition(cc.p(left, 30));
            nav.addChild(sprite);
        },
        restartCallback: function(){
            BaseScene.btnClick();
            var delay = cc.DelayTime.create(0.01);
            var actions = cc.Sequence.create(delay, cc.CallFunc.create(function(){
                var restartLayer = RestartScene.create();
                PausedScene.currentScene.addChild(restartLayer, 100, 100);
            }, this));
            this.runAction(actions);
        },
        initMenuBtn: function(){
            var winSize = this.getWinSize();
            var left = (winSize.width - 280)/2;
            var self = this;
            var menu = Menu.getMenu({
                pic: [
                    "btn_resume.png",
                    "btn_restart.png",
                    "btn_menu.png",
                ],
                context: this,
                callback: [function(){ //resume
                        BaseScene.btnClick();
                        var scene = $.tranScene(PlayScene.scene());
                        cc.Director.getInstance().replaceScene(scene);
                    }, this.restartCallback, function(){ //menu
                        BaseScene.btnClick();
                        var scene = $.tranScene(ListScene.scene());
                        cc.Director.getInstance().replaceScene(scene);
                    }
                ],
                position: [left, this.getWinSize().height - 300],
                marginTop: 30,
                frameType: true,
                selectedItem: function(p){
                    var cover = BaseScene.getCoverSprite();
                    var pSize = p.getContentSize();
                    cover.setContentSize(cc.size(pSize.width - 12, pSize.height - 12));
                    p.addChild(cover);
                    return p;
                }
            });
            this.addChild(menu);
        }
    }
})
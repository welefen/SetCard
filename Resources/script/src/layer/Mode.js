/**
 * 模式选择
 * @return {[type]} [description]
 */
var ModeScene = $.scene(function(){
    function ic(type){
        return function(){
            BaseScene.btnClick();
            GameData.set("currentMode", type);
            var scene = $.tranScene(ListScene.scene());
            cc.Director.getInstance().replaceScene(scene);
        }
    }
    return {
        init: function(){
            this._super();
            BaseScene.initBg.call(this);
            this.initNav();
            this.initMenuBtn();
            this.initBackBtn();
            $.setBackgroundMusic(R.audio_bg);
            return true;
        },
        initNav: function(){
            var nav = BaseScene.initNavBg.call(this);
            var sprite = cc.Sprite.createWithSpriteFrameName("txt_select_mode.png");
            sprite.setAnchorPoint(cc.p(0, 0));
            var left = (this.getWinSize().width - sprite.getContentSize().width)/2;
            sprite.setPosition(cc.p(left, 30));
            nav.addChild(sprite);
        },
        initMenuBtn: function(){
            var winSize = this.getWinSize();
            var left = (winSize.width - 280)/2;
            var menu = Menu.getMenu({
                pic: [
                    "btn_beginner.png",
                    "btn_easy.png",
                    "btn_medium.png",
                    "btn_hard.png",
                    "btn_expert.png"
                ],
                context: this,
                callback: [
                    ic("beginner"),
                    ic("easy"),
                    ic("medium"),
                    ic("hard"),
                    ic("expert")
                ],
                position: [left, this.getWinSize().height - 200],
                marginTop: 20,
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
        },
        initBackBtn: function(){
            BaseScene.getBackBtn.call(this, function(){
                BaseScene.btnClick();
                var scene = $.tranScene(MainScene.scene());
                cc.Director.getInstance().replaceScene(scene);
            })
        }
    }
})
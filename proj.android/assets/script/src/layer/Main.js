/**
 * 主菜单
 * @return {[type]} [description]
 */
var MainScene = $.scene(function(){
    return {
        init: function(){
            this._super();
            BaseScene.initFrameCache();
            BaseScene.initBg.call(this);
            this.initLogo();
            this.initMenu();
            BaseScene.initSoundBtn.call(this, 110, 60);
            $.setBackgroundMusic(R.audio_bg);
            return true;
        },
        initLogo: function(){
            var sprite = cc.Sprite.create(R.img_logo1);
            sprite.setAnchorPoint(cc.p(0, 0));
            var left = (this.getWinSize().width - sprite.getContentSize().width)/2;
            sprite.setPosition(cc.p(left, this.getWinSize().height - 290));
            this.addChild(sprite);
        },
        initMenu: function(){
            var winSize = this.getWinSize();
            var left = (winSize.width - 260)/2;
            var menu = Menu.getMenu({
                pic: ["btn_play.png", "btn_rate.png"],
                context: this,
                callback: [function(){
                    BaseScene.btnClick();
                    var scene = $.tranScene(ModeScene.scene());
                    cc.Director.getInstance().replaceScene(scene);
                }, function(){
                    BaseScene.btnClick();
                    try{
                        open('https://play.google.com/store/apps/details?id=com.weizoo.SetCard');
                    }catch(e){};
                    cc.log("open url");
                }],
                position: [left, 280],
                marginTop: 20,
                frameType: true,
                selectedItem: function(p){
                    var cover = BaseScene.getCoverSprite();
                    var pSize = p.getContentSize();
                    cover.setContentSize(cc.size(pSize.width - 12, pSize.height - 12));
                    p.addChild(cover);
                    return p;
                }
            })
            this.addChild(menu);
        }
    }
})
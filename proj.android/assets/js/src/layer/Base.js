/**
 * 基础的scene，提供一些公用的方法
 * 但没有使用继承
 * 可以通过call的方式来使用
 * @return {[type]} [description]
 */
var BaseScene = function(){
    var _initFrameCache = false;
    return {
        initFrameCache: function(){
            if (_initFrameCache) {
                return true;
            };
            var cache = cc.SpriteFrameCache.getInstance();
            cache.addSpriteFrames(R.plist_cards, R.img_cards);
            cache.addSpriteFrames(R.plist_num, R.img_num);
            cache.addSpriteFrames(R.plist_num1, R.img_num1);
            cache.addSpriteFrames(R.plist_txt, R.img_txt);
            cache.addSpriteFrames(R.plist_icon, R.img_icon);
            cache.addSpriteFrames(R.plist_btn, R.img_btn);
            cache.addSpriteFrames(R.plist_num2, R.img_num2);
            cache.addSpriteFrames(R.plist_num3, R.img_num3);
        },
        //初始化背景图
        initBg: function(){
            var bgSprite = cc.Sprite.create(R.img_bg);
            bgSprite.setAnchorPoint(cc.p(0, 0));
            this.addChild(bgSprite);
            return bgSprite;
        },
        //顶部导航条
        initNavBg: function(){
            var sprite = cc.Sprite.create(R.img_nav_bg);
            sprite.setAnchorPoint(cc.p(0, 0));
            var winSize = cc.Director.getInstance().getWinSize();
            sprite.setPosition(cc.p(0, winSize.height - sprite.getContentSize().height));
            this.addChild(sprite);
            return sprite;
        },
        //音效开关
        initSoundBtn: function(x, y){
            var pic = ["btn_sound.png", "btn_bg_sound.png", "btn_help.png"];
            var soundOff = GameData.get("soundOff") | 0;
            if (soundOff) {
                pic[0] = "btn_sound_disabled.png";
            };
            var bgSoundOff = GameData.get("bgSoundOff") | 0;
            if (bgSoundOff) {
                pic[1] = "btn_bg_sound_disabled.png";
            };
            var menu = Menu.getMenu({
                pic: pic,
                context: this,
                callback: [function(item){
                    var soundOff = GameData.get("soundOff") | 0;
                    soundOff = 1 - soundOff;
                    GameData.set("soundOff", soundOff);
                    var pic = "btn_sound.png";
                    if (soundOff == 1) {
                        pic = "btn_sound_disabled.png";   
                    }
                    item.setNormalImage($.frameSprite(pic));
                }, function(item){
                    var soundOff = GameData.get("bgSoundOff") | 0;
                    soundOff = 1 - soundOff;
                    GameData.set("bgSoundOff", soundOff);
                    var pic = "btn_bg_sound.png";
                    if (soundOff == 1) {
                        pic = "btn_bg_sound_disabled.png";
                        $.removeBackgroundMusic();
                    }else{
                         $.setBackgroundMusic();
                    }
                    item.setNormalImage($.frameSprite(pic));
                }, function(){
                    var scene = $.tranScene(HelpScene.scene());
                    cc.Director.getInstance().pushScene(scene);
                }],
                position: [x || 0, y || 0],
                marginLeft: 32,
                frameType: true
            });
            this.addChild(menu);
            return menu;
        },
        //覆盖层
        getCoverSprite: function(){
            var sprite = cc.Sprite.create(R.img_cover);
            var size = sprite.getContentSize();
            var rect = cc.rect(0, 0, size.width, size.height);
            var capInsets = cc.rect(3, 3, size.width - 6, size.height - 6);
            var s = cc.Scale9Sprite.create(R.img_cover, rect, capInsets);
            s.setPosition(cc.p(6, 6));
            s.setAnchorPoint(cc.p(0, 0));
            return s;
        },
        getBackBtn: function(callback){
            var winSize = this.getWinSize();
            var left = winSize.width - 146;
            var menu = Menu.getMenu({
                pic: "btn_back.png",
                context: this,
                callback: callback,
                position: [left, 0],
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
            return menu;
        },
        getTimeString: function(time){
            var minute = Math.floor(time / 60);
            if (minute >= 100) {
                return "99 99";
            };
            if (minute < 10) {
                minute = "0" + minute;
            }
            var second = time - minute * 60;
            if (second < 10) {
                second = "0" + second;
            }
            return minute + " " + second;
        },
        //是否是上一次尚未完成的游戏
        isLastGame: function(mode, level){
            var lastGame = GameData.getLastGame();
            return lastGame.mode == mode && lastGame.level == level && lastGame.time > 0;
        },
        getBestTime: function(mode, level, time){
            var list = GameData.data.finishGame[mode] || {};
            list = list[level] || {};
            var bestTime = list.bestTime || 0;
            if (!bestTime) {
                return time;
            };
            return Math.min(time, bestTime);
        },
        btnClick: function(){
            $.playEffect(R.audio_btn);
        }
    }
}();
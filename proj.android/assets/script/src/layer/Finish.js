/**
 * game finish
 * @return {[type]} [description]
 */
var FinishScene = $.scene(function(){
    var mode = "";
    var level = 0;
    var node = {
        bg: null
    };
    var gameData = {};
    var xingNum = null;
    return {
        init: function(){
            this._super();
            xingNum = null;
            BaseScene.initFrameCache();
            mode = GameData.getMode();
            level = GameData.getLevel();
            gameData = GameData.getLastGame();
            BaseScene.initBg.call(this);
            this.initNav();
            this.initData();
            this.initMenuBtn();
            this.saveData();
            $.setBackgroundMusic(R.audio_bg);
            return true;
        },
        saveData: function(){
            var xing = this.getXingNum();
            var time = gameData.time;
            GameData.setFinishGame(mode, level, time, xing);
        },
        //可以获取几个星
        //@TODO 具体的数值需要调整
        getXingNum: function(){
            if (xingNum !== null) {
                return xingNum;
            };
            if (gameData.time === 0) {
                return xingNum = 0;
            };
            var errNum = gameData.errNum;
            var useHint = Math.max((gameData.totalTipNum || 0) - gameData.tipNum, 0);
            if (errNum > 5) {
                return xingNum = 0;
            };
            if (errNum < 2 && useHint <= 3) {
                return xingNum = 3;
            };
            if (errNum <= 3 && useHint <= 5) {
                return xingNum = 2;
            };
            return xingNum = 1;
        },
        initNav: function(){
            var nav = BaseScene.initNavBg.call(this);

            var sprite = cc.Sprite.createWithSpriteFrameName("txt_level.png");
            sprite.setAnchorPoint(cc.p(0, 0));
            sprite.setPosition(cc.p(13, 54));
            nav.addChild(sprite);

            var sprite = cc.LabelAtlas.create('0123456789', R.img_num, 12, 17, '0');
            var string = '';
            var l = level + 1;
            if (l < 10) {
                string = '00'+ l;
            }else if (l < 100) {
                string = '0' + l;
            }else{
                string = l + ''
            }
            sprite.setString(string);
            sprite.setAnchorPoint(cc.p(0, 0));
            sprite.setPosition(cc.p(72, 55));
            nav.addChild(sprite);

            var file = "txt_" + mode + ".png";
            var sprite = cc.Sprite.createWithSpriteFrameName(file);
            var left = (this.getWinSize().width - sprite.getContentSize().width)/2;
            sprite.setAnchorPoint(cc.p(0, 0));
            sprite.setPosition(cc.p(left, 30));
            nav.addChild(sprite);
        },
        initData: function(){
            var bg = cc.Sprite.create(R.img_finish_bg);
            bg.setAnchorPoint(cc.p(0, 0));
            var winSize = this.getWinSize();
            var left = (winSize.width - bg.getContentSize().width) / 2;
            bg.setPosition(cc.p(left, winSize.height - 460));
            this.addChild(bg);
            node.bg = bg;

            var type = "congrats";
            var xingNum = this.getXingNum();
            if (xingNum === 0) {
                type = "pass";
            };
            var sprite = $.frameSprite("txt_" + type + ".png");
            var left = (bg.getContentSize().width - sprite.getContentSize().width)/2;
            sprite.setPosition(cc.p(left, 300));
            bg.addChild(sprite);

            this.initError();
            this.initHint();
            this.initBestTime();
            this.initTime();
            this.initXing();

        },
        initError: function(){
            var sprite = $.frameSprite("txt_error1.png", 139, 260);
            node.bg.addChild(sprite);

            var string = gameData.errNum + "";
            var sprite = cc.LabelAtlas.create('0123456789', R.img_num, 12, 17, '0');
            sprite.setString(string);
            sprite.setPosition(cc.p(220, 258));
            sprite.setAnchorPoint(cc.p(0, 0));
            node.bg.addChild(sprite);
        },
        initHint: function(){
            var sprite = $.frameSprite("txt_hints.png", 80, 230);
            node.bg.addChild(sprite);
            var num = Math.max((gameData.totalTipNum || 0) - gameData.tipNum, 0);

            var string = num + "";
            var sprite = cc.LabelAtlas.create('0123456789', R.img_num, 12, 17, '0');
            sprite.setString(string);
            sprite.setPosition(cc.p(220, 228));
            sprite.setAnchorPoint(cc.p(0, 0));
            node.bg.addChild(sprite);
        },
        initBestTime: function(){
            var sprite = $.frameSprite("txt_best_time1.png", 93, 200);
            node.bg.addChild(sprite);

            var bestTime = BaseScene.getBestTime(mode, level, gameData.time);
            var timeString = BaseScene.getTimeString(bestTime);
            var sprite = cc.LabelAtlas.create('0123456789', R.img_num, 12, 17, '0');
            sprite.setString(timeString);
            sprite.setPosition(cc.p(220, 200));
            sprite.setAnchorPoint(cc.p(0, 0));
            node.bg.addChild(sprite);

            var sprite = cc.Sprite.createWithSpriteFrameName("txt_colon1.png");
            sprite.setAnchorPoint(cc.p(0, 0));
            sprite.setPosition(cc.p(242, 197));
            node.bg.addChild(sprite);
        },
        initTime: function(){
            var sprite = $.frameSprite("txt_time1.png", 100, 120);
            node.bg.addChild(sprite);

            var timeString = BaseScene.getTimeString(gameData.time);
            var sprite = cc.LabelAtlas.create('0123456789', R.img_num3, 16, 20, '0');
            sprite.setString(timeString);
            sprite.setScale(1.2);
            sprite.setPosition(cc.p(210, 123));
            sprite.setAnchorPoint(cc.p(0, 0));
            node.bg.addChild(sprite);

            var sprite = cc.Sprite.createWithSpriteFrameName("txt_colon1.png");
            sprite.setAnchorPoint(cc.p(0, 0));
            sprite.setPosition(cc.p(249, 124));
            node.bg.addChild(sprite);
        },
        initXing: function(){
            var xingNum = this.getXingNum();
            //@TODO 动画
            cc.createArray(3).forEach(function(item, i){
                var left = 70 + i * 100;
                var sprite = $.frameSprite("icon_x_l_disabled.png", left, 30);
                node.bg.addChild(sprite);
                if (i < xingNum) {
                    var s = $.frameSprite("icon_x_l.png", left, 30);
                    node.bg.addChild(s);
                };
            });
        },
        initMenuBtn: function(){
            var winSize = this.getWinSize();
            var left = (winSize.width - 234)/2;
            var menu = Menu.getMenu({
                pic: [
                    "btn_next.png",
                    "btn_restart1.png",
                    "btn_menu1.png"
                ],
                context: this,
                callback: [function(){
                    GameData.nextLevel();
                    var scene = $.tranScene(PlayScene.scene());
                    cc.Director.getInstance().replaceScene(scene);
                },function(){
                    var scene = $.tranScene(PlayScene.scene());
                    cc.Director.getInstance().replaceScene(scene);
                }, function(){
                    var scene = $.tranScene(ListScene.scene());
                    cc.Director.getInstance().replaceScene(scene);
                }],
                position: [left, this.getWinSize().height - 540],
                marginTop: 10,
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
        onExit: function(){
            this._super();
            for(var name in node){
                if (node[name] && node[name].getContentSize) {
                    node[name].removeFromParent && node[name].removeFromParent(true);
                    node[name] = null;
                };
            }
        }
    }
})
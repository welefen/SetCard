/**
 * 列表
 * @return {[type]} [description]
 */
var ListScene = $.scene(function(){
    var mode = ""; //当前的模式
    var node = {
        scrollView: null,
        menu: null
    }
    var menuOffset = null;
    var countX = 0; //获取星星的总数
    var menuClick = true;
    return {
        init: function(){
            countX = 0;
            BaseScene.initFrameCache();
            this._super();
            BaseScene.initBg.call(this);
            mode = GameData.getMode();
            this.initNav();
            this.initData();
            this.initFoot();
            $.setBackgroundMusic(R.audio_bg);
            return true;
        },
        onTouchBegan: function(touch){
            var touchLocation = touch.getLocation();
            var local = node.scrollView.convertToNodeSpace(touchLocation);
            var pos = node.scrollView.getPosition();
            var r = cc.rect(pos.x, pos.y, 470, this.getWinSize().height - 150);
            if (cc.Rect.CCRectContainsPoint(r, local)) {
                menuClick = true;
            }else{
                menuClick = false;
            }
        },
        registerWithTouchDispatcher:function () {
            cc.Director.getInstance().getTouchDispatcher().addTargetedDelegate(this, -10);
        },
        initFoot: function(){
            BaseScene.getBackBtn.call(this, function(){
                BaseScene.btnClick();
                var scene = $.tranScene(ModeScene.scene());
                cc.Director.getInstance().replaceScene(scene);
            })
            var num = countX;
            var string = num + " " + ( 3 * GameData.levelCount );
            var sprite = cc.LabelAtlas.create('0123456789', R.img_num2, 21, 36, '0');
            sprite.setString(string);
            sprite.setAnchorPoint(cc.p(0, 0));
            sprite.setPosition(cc.p(12, 13));

            var left = 33;
            if (num > 9) {
                left = 54;
            };
            if (num > 99) {
                left = 75;
            };
            var slash = $.frameSprite('txt_slash.png', left, 14);
            this.addChild(slash);
            this.addChild(sprite);

            var left = string.length * 21 + 20;
            var sprite = $.frameSprite('icon_x.png', left, 19);
            this.addChild(sprite);
        },
        initNav: function(){
            var nav = BaseScene.initNavBg.call(this);
            var file = "txt_" + mode + ".png";
            var sprite = cc.Sprite.createWithSpriteFrameName(file);
            var left = (this.getWinSize().width - sprite.getContentSize().width)/2;
            sprite.setAnchorPoint(cc.p(0, 0));
            sprite.setPosition(cc.p(left, 30));
            nav.addChild(sprite);
        },
        menuItemCallback: function(item){
            if (!menuClick) {
                return false;
            };
            var offset = node.scrollView.getContentOffset();
            var duce = Math.abs(Math.abs(offset.y) - Math.abs(menuOffset.y));
            menuOffset = offset;
            //如果移动大于10px，则为移动
            if (duce > 10) {
                return true;
            };
            var level = item.level || 0;
            GameData.setLevel(level);
            $.playEffect(R.audio_sub_btn);
            var scene = $.tranScene(PlayScene.scene());
            cc.Director.getInstance().replaceScene(scene);
        },
        initData: function(){
            var instance = this;
            var winSize = this.getWinSize();
            var container = cc.Layer.create();
            container.setAnchorPoint(cc.p(0, 0));
            container.setPosition(cc.p(5, 50));
            container.setContentSize(cc.size(470, 105 * GameData.levelCount));
            
            var menu = cc.Menu.create();
            menu.setAnchorPoint(cc.p(0, 0));
            menu.setPosition(cc.p(0, 0));
            menu.setContentSize(cc.size(470, 105 * GameData.levelCount));

            var gameData = GameData.getFinishGameList(mode);
            
            cc.createArray(GameData.levelCount).forEach(function(item, i){
                var itemData = gameData[i] || {};
                var sprite = instance.getItemSprite(itemData, i);
                var selectedSprite = instance.getItemSelectedSprite(itemData, i);
                var menuItem = cc.MenuItemSprite.create(sprite, selectedSprite, instance.menuItemCallback, instance);
                menuItem.setAnchorPoint(cc.p(0, 0));
                menuItem.setPosition(cc.p(0, 105 *  (GameData.levelCount - i - 1)));
                menuItem.level = i;
                menu.addChild(menuItem);
            });
            node.menu = menu;
            container.addChild(menu);

            var scrollView = cc.ScrollView.create(cc.size(470, winSize.height - 150), container);
            scrollView.setAnchorPoint(cc.p(0, 0));
            scrollView.setPosition(cc.p(5, 70));
            scrollView.setDirection(cc.SCROLLVIEW_DIRECTION_VERTICAL);
            this.addChild(scrollView);
            node.scrollView = scrollView;

            var lastGame = GameData.getLastGame();
            if (mode == lastGame.mode) {
                var level = lastGame.level | 0;
                var offset = - (GameData.levelCount - level - 3) * 105 + 25;
                var minOffset = scrollView.minContainerOffset().y;
                offset = Math.min(0, Math.max(minOffset, offset));
                scrollView.setContentOffset({
                    x: 0,
                    y: offset
                });
            }else{
                scrollView.setContentOffset(scrollView.minContainerOffset());
            }
            menuOffset = scrollView.getContentOffset();
        },
        onEnter: function(){
            this._super();
            node.menu.setHandlerPriority(1);
            this.setTouchEnabled(true);
        },
        getItemSelectedSprite: function(itemData, index){
            var sprite = this.getItemSprite(itemData, index, true);
            var cover = BaseScene.getCoverSprite();
            var pSize = sprite.getContentSize();
            cover.setContentSize(cc.size(pSize.width - 12, pSize.height - 12));
            sprite.addChild(cover);
            return sprite;
        },  
        getItemSprite: function(itemData, index, notAdd){
            //是否已经完成
            var isFinish = itemData.lastTime && itemData.bestTime && itemData.grade;
            if (isFinish && !notAdd) {
                countX += itemData.grade | 0;
            };

            var sprite = cc.Sprite.create(R.img_btn_item_bg);
            var left = (this.getWinSize().width - sprite.getContentSize().width)/2;
            sprite.setAnchorPoint(cc.p(0, 0));
            sprite.setPosition(cc.p(0, 0));
            //序号
            var radius = cc.Sprite.createWithSpriteFrameName('icon_radius.png');
            radius.setAnchorPoint(cc.p(0, 0));
            radius.setPosition(cc.p(10, 22));
            sprite.addChild(radius);
            var num = cc.LabelAtlas.create('0123456789', R.img_num, 12, 17, '0');
            num.setString(index + 1 + "");
            num.setAnchorPoint(cc.p(0, 0));
            var left = 22;
            if (index > 8) {
                left = 13
            }
            if(index > 98){
                left = 5;
            }
            num.setPosition(cc.p(left, 20));
            num.setScale(1.3);
            radius.addChild(num);
            //是否是上一次未完成的游戏
            if (BaseScene.isLastGame(mode, index)) {
                var radiusHover = $.frameSprite("icon_radius_hover.png", -5, -3);
                radius.addChild(radiusHover);
                var resume = $.frameSprite("txt_resume.png", 30, 31);
                resume.setAnchorPoint(cc.p(0.5, 0.5));
                resume.setRotation(-30);
                var actionBy1 = cc.RotateBy.create(1, 60);
                var actionBy2 = cc.RotateBy.create(1, -60);
                var action = cc.Sequence.create(actionBy1, actionBy2);
                var repeat = cc.RepeatForever.create(action);
                resume.runAction(repeat);
                radius.addChild(resume);
            };


            //last time
            var lastTime = $.frameSprite("txt_last_time.png", 90, 65);
            sprite.addChild(lastTime);
            //best time
            var bestTime = $.frameSprite("txt_best_time.png", 220, 65);
            sprite.addChild(bestTime);

            if (isFinish) {
                var time = cc.LabelAtlas.create('0123456789', R.img_num3, 16, 20, '0');
                time.setAnchorPoint(cc.p(0, 0));
                time.setString(BaseScene.getTimeString(itemData.lastTime));
                time.setPosition(cc.p(99, 30));
                sprite.addChild(time);

                var timeColon = cc.Sprite.createWithSpriteFrameName("txt_colon1.png");
                timeColon.setAnchorPoint(cc.p(0, 0));
                timeColon.setPosition(cc.p(130, 30));
                sprite.addChild(timeColon);
            }else{
                var noTime = $.frameSprite("txt_no_time.png", 90, 30);
                sprite.addChild(noTime);
            }
           
            if (isFinish) {
                var time = cc.LabelAtlas.create('0123456789', R.img_num3, 16, 20, '0');
                time.setAnchorPoint(cc.p(0, 0));
                time.setString(BaseScene.getTimeString(itemData.bestTime));
                time.setPosition(cc.p(230, 30));
                sprite.addChild(time);

                var timeColon = cc.Sprite.createWithSpriteFrameName("txt_colon1.png");
                timeColon.setAnchorPoint(cc.p(0, 0));
                timeColon.setPosition(cc.p(261, 30));
                sprite.addChild(timeColon);
            }else{
                var noTime = $.frameSprite("txt_no_time.png", 220, 30);
                sprite.addChild(noTime);
            }

            cc.createArray(3).forEach(function(item, i){
                if ( isFinish && i < itemData.grade) {
                    var x = $.frameSprite("icon_x.png", 347 + i * 37, 55);
                }else{
                    var x = $.frameSprite("icon_x_disabled.png", 347 + i * 37, 55);
                }
                sprite.addChild(x);
            })

            var checkbox = $.frameSprite("icon_checkbox.png", 428, 20);
            sprite.addChild(checkbox);
            if (isFinish) {
                var checked = $.frameSprite("icon_checked.png", 420, 23);
                sprite.addChild(checked);
            };
            return sprite;
        },
        onExit: function(){
            this._super();
            for(var name in node){
                if (node[name] && node[name].getContentSize) {
                    node[name].removeFromParent(true);
                    node[name] = null;
                };
            }
        }
    }
})
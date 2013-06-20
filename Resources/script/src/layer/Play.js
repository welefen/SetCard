/**
 * play scene
 * @type {[type]}
 */
var PlayScene = $.scene(function(){
    var node = {
        menu: null,
        miniCards: [],
        level: null,
        nav: null,
        errNum: null,
        time: null,
        btnMenu: null,
        reduceNum: null
    };
    var tag = {
        tip: 100
    };
    var tipNums = {
        "beginner": 9,
        "easy": 7,
        "medium": 5,
        "hard": 4,
        "expert": 2
    }
    //总的可以消除的次数
    var totalReduceNum = 27;

    var updateTimeFn = null;
    return {
        mode: "", //模式
        level: 0, //当前哪一关

        errNum: 0, //错误数
        time: 0, //已经使用的时间
        reduceNum: 0, //已经消除的个数
        tipNum: 0, //提示的数目
        
        setLevel: function(level){
            if (level == this.level) {
                return true;
            };
            this.level = level;
            if (!node.level) {

            };
        },
        //移除小的卡牌
        removeMiniCards: function(){
            node.miniCards.forEach(function(item){
                item && item.removeFromParent(true);
            })
            node.miniCards = [];
        },
        //card选择后的回调
        cardSelectCallback: function(menuItem){
            var instance = this;
            var sprite = menuItem.getChildren()[0];
            if (sprite.isSelected) {
                return sprite.setSelected(false);
            };
            var length = CardManage.getCards().filter(function(item){
                var sprite = item.getChildren()[0];
                return sprite.isSelected;
            }).length;
            if (length < 3) {
                sprite.setSelected(!sprite.isSelected);
            };
            if (length == 2) {
                var result = CardManage.check();
                var selectedCards = CardManage.getSelectedCards();
                if (result) {
                    //消除cards
                    this.reduceCards(selectedCards);
                }else{
                    selectedCards.forEach(function(item){
                        var sprite = item.getChildren()[0];
                        sprite.shake(function(node){
                            node.setSelected(false);
                        });
                    })
                    this.addError();
                }
            };
        },
        //消除card
        reduceCards: function(selectedCards){
            var totalWidth = this.getWinSize().width;
            var cloneList = [];
            var instance = this;
            selectedCards.forEach(function(item, i){
                var sprite = item.getChildren()[0];
                var clone = sprite.clone();
                var pos = item.getPosition();
                instance.addChild(clone);
                clone.setPosition(pos);
                CardManage.remove(item);
                clone.moveRotate(cc.p(totalWidth - i * 35 - 158, 93), function(sprite){
                    var cardId = Card.getCard();
                    if (cardId === false && !CardManage.hasClear()) {
                        if (i == 2) {
                            instance.addReduceNum();
                            instance.gameFinish();
                        };
                        return true;
                    };
                    if (cardId !== false) {
                        instance.addCard(cardId, true);
                    };
                    cloneList.push(clone);
                    if (i == 2) {
                        $.playEffect(R.audio_unit_complete);
                        //instance.tipCallback();

                        instance.removeMiniCards();
                        node.miniCards.push.apply(node.miniCards, cloneList);
                        instance.addReduceNum();
                        //card是否已经使用完
                        if (Card.isFinish() && !CardManage.hasClear()) {
                            instance.gameFinish();
                        };
                    };
                });
            })
        },
        //游戏已经完成
        gameFinish: function(){
            this.unschedule(updateTimeFn);
            this.storeData();
            $.playEffect(R.audio_clap);
            var sprite = $.frameSprite("txt_complete.png");
            var width = sprite.getContentSize().width;
            var px = (this.getWinSize().width - width) / 2 ;
            sprite.setPosition(cc.p(0 - width, this.getWinSize().height / 2));
            this.addChild(sprite);
            var dx = 40;
            var actions = cc.Sequence.create(
                cc.MoveBy.create(0.2, cc.p(width + dx/2 + px, 0)),
                cc.MoveBy.create(0.1, cc.p(-dx, 0)),
                cc.MoveBy.create(0.1, cc.p(dx, 0)),
                cc.MoveBy.create(0.1, cc.p(-dx, 0)),
                cc.MoveBy.create(0.1, cc.p(dx, 0)),
                cc.MoveBy.create(0.1, cc.p(-dx, 0)),
                cc.MoveBy.create(0.1, cc.p(dx, 0)),
                cc.MoveBy.create(0.1, cc.p(-dx, 0)),
                cc.MoveBy.create(0.1, cc.p(dx/2, 0)),
                cc.CallFunc.create(function(){
                    cc.Director.getInstance().replaceScene(FinishScene.scene());
                }, this)
            );
            sprite.runAction(actions);
        },
        //添加一张卡牌
        addCard: function(cardId, animate){
            var sprite = CardSprite.create(cardId);
            var item = cc.MenuItemSprite.create( sprite, sprite, this.cardSelectCallback, this);
            //item.setAnchorPoint(cc.p(0, 0));
            item.setPosition(cc.p(0, 0));
            node.menu.addChild(item, 100);
            CardManage.add(item, animate);
        },
        //暂停回调
        pauseCallback: function(){
            BaseScene.btnClick();
            this.storeData();
            var scene = $.tranScene(PausedScene.scene());
            cc.Director.getInstance().replaceScene(scene);
        },
        //存储当前的数据
        storeData: function(){
            var data = {
                mode: this.mode,
                level: this.level,
                errNum: this.errNum,
                time: this.time,
                reduceNum: this.reduceNum,
                tipNum: this.tipNum,
                cardIndex: Card.getIndex(),
                cardIds: CardManage.getCardIds()
            }
            GameData.data.lastGame = data;
            GameData.flush();
        },
        //
        tipCallback: function(item){
            if (this.tipNum == 0) {
                return false;
            };
            BaseScene.btnClick();
            var clearCards = CardManage.getClearCards();
            if (!clearCards) {
                return false;
            };
            clearCards.forEach(function(index){
                var card = CardManage.getCardByIndex(index);
                var sprite = card.getChildren()[0];
                sprite.addHover();
            })

            this.removeTipNum();
            this.storeData();
        },
        init: function(){
            this._super();
            Card.init();
            CardManage.init();

            BaseScene.initFrameCache();
            BaseScene.initBg.call(this);
            this.initData();
            this.initNav();
            this.initCard();
            this.initMenu();
            $.setBackgroundMusic(R.audio_play_bg);
            if (Card.isFinish() && !CardManage.hasClear()) {
                this.gameFinish();
            };
            return true;
        },
        initMenu: function(){
            var btnMenu = Menu.getMenu({
                pic: ["btn_pause.png", "btn_tip.png"],
                context: this,
                callback: [this.pauseCallback, this.tipCallback],
                position: [10, 60],
                marginLeft: 5,
                frameType: true,
                selectedItem: function(p){
                    var cover = BaseScene.getCoverSprite();
                    var pSize = p.getContentSize();
                    cover.setContentSize(cc.size(pSize.width - 12, pSize.height - 12));
                    p.addChild(cover);
                    return p;
                },
                disabledItem: [false, true]
            })
            this.addChild(btnMenu);
            node.btnMenu = btnMenu;

            var string = this.tipNum + "";
            var sprite = cc.LabelAtlas.create('0123456789', R.img_num2, 21, 36, '0');
            sprite.setString(string);
            sprite.setScale(0.5);
            sprite.setPosition(cc.p(21, 25));
            sprite.setAnchorPoint(cc.p(0, 0));
            btnMenu.getChildren()[1].addChild(sprite, 100, tag.tip);
            if (this.tipNum == 0) {
                btnMenu.getChildren()[1].setEnabled(false);
            };


            //消除的数目
            var string = this.reduceNum + " " + totalReduceNum;
            var left = this.getWinSize().width;
            var sprite = cc.LabelAtlas.create('0123456789', R.img_num2, 21, 36, '0');
            sprite.setString(string);
            sprite.setAnchorPoint(cc.p(0, 0));
            sprite.setPosition(cc.p(left - string.length * 21 - 16, 73));
            this.addChild(sprite);
            node.reduceNum = sprite;
            //斜杠
            var slash = $.frameSprite('txt_slash.png', left - 78, 73);
            this.addChild(slash);
        },
        //减少提示的次数
        removeTipNum: function(){
            if (this.tipNum == 0) {
                return false;
            };
            this.tipNum--;
            var sprite = node.btnMenu.getChildren()[1].getChildByTag(tag.tip);
            sprite.setString(this.tipNum + "");
            if (this.tipNum == 0) {
                var tip = node.btnMenu.getChildren()[1];
                tip.setEnabled(false);
            };
        },
        //更新消除的数目
        addReduceNum: function(){
            if (this.reduceNum >= totalReduceNum) {
                return true;
            };
            this.reduceNum++;
            var string = this.reduceNum + " "+ totalReduceNum;
            node.reduceNum.setString(string);
            var left = this.getWinSize().width - string.length * 21 - 16;
            node.reduceNum.setPosition(cc.p(left, 73));
        },
        initData: function(){
            this.mode = GameData.getMode();
            this.level = GameData.getLevel();
            
            var cardIndex = 0;

            var levelData = GameData.getLevelData(this.mode, this.level);
            if (levelData.length == 0) {
                levelData = Card.generateList();
            };
            Card.setCardList(levelData);

            //继续上次未完成的游戏
            if (BaseScene.isLastGame(this.mode, this.level)) {
                var lastGame = GameData.getLastGame();
                this.time = lastGame.time | 0;
                this.errNum = lastGame.errNum | 0;
                this.reduceNum = lastGame.reduceNum | 0;
                this.tipNum = lastGame.tipNum | 0;
                cardIndex = lastGame.cardIndex;
                cardIndex -= lastGame.cardIds.length;
                var cardList = Card.getCardList();
                lastGame.cardIds.forEach(function(item, i){
                    cardList[cardIndex + i] = item;
                });
                Card.setCardList(cardList);
                Card.setIndex(cardIndex);
            }else{
                this.time = 0;
                this.errNum = 0;
                this.reduceNum = 0;
                this.tipNum = 0;
            }
            if (!this.time && !this.tipNum) {
                this.tipNum = tipNums[this.mode] || 0;
            };
            GameData.data.lastGame.totalTipNum = tipNums[this.mode] || 0;
        },
        //初始化卡牌
        initCard: function(){
            var instance = this;
            var menu = node.menu = cc.Menu.create();
            new Array(16).join('*').split('').forEach(function(){
                var cardId = Card.getCard();
                if (cardId === false) {
                    return true;
                };
                instance.addCard(cardId);
            })
            menu.setAnchorPoint(cc.p(0, 0));
            menu.setPosition(cc.p(0, 0));
            this.addChild(menu);
        },
        //顶部导航条
        initNav: function(){
            node.nav = BaseScene.initNavBg.call(this);

            this.initNavLevel();
            this.initNavError();
            this.initNavTime();
        },
        initNavLevel: function(){
            //level
            var sprite = cc.Sprite.createWithSpriteFrameName("txt_level.png");
            sprite.setAnchorPoint(cc.p(0, 0));
            sprite.setPosition(cc.p(13, 54));
            node.nav.addChild(sprite);
            var sprite = cc.LabelAtlas.create('0123456789', R.img_num, 12, 17, '0');
            var string = '';
            var level = this.level + 1;
            if (level < 10) {
                string = '00'+ level
            }else if (level < 100) {
                string = '0' + level;
            }else{
                string = level + ''
            }
            sprite.setString(string);
            sprite.setAnchorPoint(cc.p(0, 0));
            sprite.setPosition(cc.p(72, 55));
            node.nav.addChild(sprite);

            var sprite = cc.Sprite.createWithSpriteFrameName("txt_s_"+this.mode+".png");
            sprite.setAnchorPoint(cc.p(0, 0));
            sprite.setPosition(cc.p(13, 25));
            node.nav.addChild(sprite);
        },
        initNavError: function(){
            var sprite = cc.Sprite.createWithSpriteFrameName("txt_error.png");
            sprite.setAnchorPoint(cc.p(0, 0));
            sprite.setPosition(cc.p(200, 55));
            node.nav.addChild(sprite);

            var err = cc.Sprite.create();
            err.setAnchorPoint(cc.p(0,0));
            err.setPosition(cc.p(182, 27));
            node.nav.addChild(err);
            node.errNum = err;

            var instance = this;
            cc.createArray(5).forEach(function(item, i){
                var sprite = cc.Sprite.createWithSpriteFrameName("icon_e_disabled.png");
                sprite.setAnchorPoint(cc.p(0, 0));
                sprite.setPosition(cc.p(i * 24, 0));
                if (instance.errNum > i) {
                    var s = cc.Sprite.createWithSpriteFrameName("icon_e.png");
                    s.setAnchorPoint(cc.p(0, 0));
                    sprite.addChild(s);
                };
                err.addChild(sprite);
            })
        },
        initNavTime: function(){
            var sprite = cc.Sprite.createWithSpriteFrameName("txt_time.png");
            sprite.setAnchorPoint(cc.p(0, 0));
            sprite.setPosition(cc.p(380, 55));
            node.nav.addChild(sprite);

            var sprite = cc.LabelAtlas.create('0123456789', R.img_num1, 18, 20, '0');
            sprite.setAnchorPoint(cc.p(0, 0));
            sprite.setString(BaseScene.getTimeString(this.time));
            sprite.setPosition(cc.p(374, 25));
            node.nav.addChild(sprite);
            node.time = sprite;

            var sprite = cc.Sprite.createWithSpriteFrameName("txt_colon.png");
            sprite.setAnchorPoint(cc.p(0, 0));
            sprite.setPosition(cc.p(410, 25));
            node.nav.addChild(sprite);

            var instance = this;

            updateTimeFn = function(){
                instance.updateTime.call(instance);
            };
            this.schedule(updateTimeFn, 1);
        },
        //更新时间
        updateTime: function(){
            this.time++;
            node.time.setString(BaseScene.getTimeString(this.time));
        },
        //添加一个错误
        addError: function(){
            $.playEffect(R.audio_wrong_numer);
            this.errNum++;
            if (this.errNum > 5) {
                return false;
            };
            var child = node.errNum.getChildren()[this.errNum - 1];
            var s = cc.Sprite.createWithSpriteFrameName("icon_e.png");
            s.setAnchorPoint(cc.p(0, 0));
            child.addChild(s);
        },
        onExit: function(){
            this._super();
            this.storeData();
            this.removeMiniCards();
            CardManage.removeCards();
        }
    }
});
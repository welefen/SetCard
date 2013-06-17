/**
 * restart遮罩层
 * @return {[type]} [description]
 */
var RestartScene = $.scene(function(){
    var node = {
        menu: null,
        bg: null
    };
    return {
        init: function(){
            this._super();
            this.setTouchMode(cc.TOUCH_ONE_BY_ONE);
            this.setTouchEnabled(true);
            this.setTouchPriority(-129);
            this.initMask();
            this.initBg();
            this.initMenu();
            return true;
        },
        onTouchBegan: function(){
            return true;
        },
        onEnter: function(){
            this._super();
            node.menu.setHandlerPriority(-130);
        },
        initMask: function(){
            var layer = cc.LayerColor.create(cc.c4b(0, 0, 0, 128));
            this.addChild(layer);
        },
        initBg: function(){
            var winSize = this.getWinSize();
            var sprite = cc.Sprite.create(R.img_restart);
            var contentSize = sprite.getContentSize();
            sprite.setPosition(cc.p(winSize.width/2, winSize.height/2));
            this.addChild(sprite);
            node.bg = sprite;
            sprite.setScale(0);
            var actions = cc.Sequence.create(
                cc.ScaleTo.create(0.25, 1.25, 1.25),
                cc.ScaleTo.create(0.15, 1, 1)
            );
            sprite.runAction(actions);
        },
        restartCallback: function(){
            var data = {
                errNum: 0,
                time: 0,
                reduceNum: 0,
                tipNum: 0,
                cardIndex: 0,
                cardIds: []
            }
            for(var name in data){
                GameData.data.lastGame[name] = data[name];
            }
            GameData.flush();
            var scene = $.tranScene(PlayScene.scene());
            cc.Director.getInstance().replaceScene(scene);
        },
        initMenu: function(){
            var left = (node.bg.getContentSize().width - 240)/2;
            var self = this;
            var menu = Menu.getMenu({
                pic: ["btn_restart_1.png", "btn_cancel.png"],
                context: this,
                callback: [this.restartCallback, function(){
                    self.removeFromParent(true);
                }],
                position: [left, 20],
                marginLeft: 20,
                frameType: true,
                selectedItem: function(p){
                    var cover = BaseScene.getCoverSprite();
                    var pSize = p.getContentSize();
                    cover.setContentSize(cc.size(pSize.width - 12, pSize.height - 12));
                    p.addChild(cover);
                    return p;
                }
            })
            node.menu = menu;
            node.bg.addChild(menu);
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
});
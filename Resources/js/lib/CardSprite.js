/**
 * 
 * @param  {[type]} ){                 return {    }} [description]
 * @return {[type]}     [description]
 * 形状，颜色，空隙
 */
var CardSprite = $.sprite(function(){
    var tag = {
        selected: 100,
        hovered: 101
    }
    return {
        cardId: 0,
        isSelected: false,
        init: function(cardId){
            this._super();
            this.initWithFile(R.img_card_bg);
            this.setAnchorPoint(cc.p(0.5, 0.5));
            this.setCardId(cardId);
            return true;
        },
        clone: function(){
            return CardSprite.create(this.cardId);
        },
        removeHover: function(){
            var node = this.getChildByTag(tag.hovered);
            if (node) {
                node.removeFromParent(true);
            };
            return true;
        },
        //添加hover效果
        addHover: function(){
            this.setSelected(false);
            var node = this.getChildByTag(tag.hovered);
            if (node) {
                return this;
            };
            var sprite = cc.Sprite.create(R.img_card_hover_bg);
            var contentSize = this.getContentSize();
            sprite.setPosition(cc.p(contentSize.width /2, contentSize.height / 2));
            var action = cc.FadeIn.create(0.3);
            sprite.runAction(cc.Sequence.create(action));
            this.addChild(sprite, 100, tag.hovered);
        },
        //设置是否选中
        setSelected: function(selected){
            this.removeHover();
            if (this.isSelected == selected) {
                return true;
            };
            var node = this.getChildByTag(tag.selected);
            if (selected) {
                if (!node) {
                    var sprite = cc.Sprite.create(R.img_card_select_bg);
                    var contentSize = this.getContentSize();
                    sprite.setPosition(cc.p(contentSize.width / 2, contentSize.height / 2));
                    var action = cc.FadeIn.create(0.15);
                    sprite.runAction(cc.Sequence.create(action));
                    this.addChild(sprite, 100, tag.selected);
                }else{
                    node.setVisible(true);
                }
                this.isSelected = true;
            }else{
                if (node) {
                    node.setVisible(false);
                };
                this.isSelected = false;
            }
        },
        //正确时的动画
        moveRotate: function(pos, callback){
            var dur = 0.5;
            var moveTo = cc.MoveTo.create(dur, pos);
            var rotate = cc.RotateTo.create(dur, 270 + 360 * 1);
            var scale = cc.ScaleTo.create(dur, 0.37);
            var actions = [
                moveTo, rotate, scale
            ];
            var action = cc.Spawn.create.apply(cc.Spawn, actions);
            this.runAction(action);
            //并行下的回调
            var callbackAction = cc.Sequence.create.apply(cc.Sequence, [
                cc.DelayTime.create(dur * 1.1),
                cc.CallFunc.create(function(node){
                    callback && callback(node);
                }, this)
            ]);
            this.runAction(callbackAction);
        },
        //错误的时候闪动动画
        shake: function(callback){
            var moveLeftHalf = cc.MoveBy.create(0.05, cc.p(-5, 0));
            var moveLeft = cc.MoveBy.create(0.05, cc.p(-10, 0));
            var moveRight = cc.MoveBy.create(0.05, cc.p(10, 0));
            var actions = [
                moveLeftHalf, moveRight, moveLeft, 
                moveRight, moveLeft, moveRight,
                moveLeftHalf, 
                cc.CallFunc.create(function(node){
                    callback && callback(node);
                }, this)
            ];
            var action = cc.Sequence.create.apply(cc.Sequence, actions);
            this.runAction(action);
        },
        //添加时的动画
        popScale: function(){
            this.setScale(0);
            this.setAnchorPoint(cc.p(0.5, 0.5));
            var contentSize = this.getContentSize();
            this.setPosition(cc.p(contentSize.width / 2, contentSize.height / 2));
            var actions = [
                cc.ScaleTo.create(0.35, 1.2),
                cc.ScaleTo.create(0.15, 1)
            ];
            var action = cc.Sequence.create.apply(cc.Sequence, actions);
            this.runAction(action);
        },
        //设置卡牌的id
        setCardId: function(cardId){
            this.removeAllChildren(true);
            this.cardId = cardId;
            var info = this.getCardInfo();
            var instance = this;
            var file = Card.getFileName(cardId);
            var arr = new Array(info[0] + 1).join(',.').split(',');
            var length = arr.length;
            var totalWidth = this.getContentSize().width;
            arr.forEach(function(item, i){
                var sprite = cc.Sprite.createWithSpriteFrameName(file);
                var width = sprite.getContentSize().width;
                sprite.setAnchorPoint(cc.p(0,0));
                var left = (totalWidth - length * 35)/2 + 2;
                sprite.setPosition(cc.p(left + i * 35, 12));
                instance.addChild(sprite);
            })
        },
        getCardInfo: function(){
            return Card.getInfo(this.cardId);
        }
    }
})
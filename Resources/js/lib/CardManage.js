var CardManage = function(){
    var cards = [];
    var contentSize = null;
    var winSize = null;
    return {
        marginLR: 0, //左右的间距
        marginTop: 175,
        cardMarginTop: 15,
        init: function(){
            cards = [];
            contentSize = null;
            winSize = null;
        },
        removeCards: function(){
            cards.forEach(function(item){
                item && item.removeFromParent(true);
            });
            cards = [];
        },
        getCard: function(index){
            return cards[index];
        },
        //添加一个card
        add: function(cardSprite, animate){
            if (!contentSize) {
                contentSize = cardSprite.getContentSize();
            };
            if (!winSize) {
                winSize = cc.Director.getInstance().getWinSize();
            };
            var pos = -1;
            cards.some(function(item, i){
                if (item === null) {
                    pos = i;
                    return true;
                };
                return false;
            })
            if (pos === -1) {
                pos = cards.length;
            };
            cards[pos] = cardSprite;
            var marginLR = this.marginLR;
            var margin = 0;
            if (!marginLR) {
                marginLR = margin = (winSize.width - 3 * contentSize.width)/4;
            }else{
                margin = (winSize.width - 3 * contentSize.width - 2 * marginLR)/2;
            }
            var line = Math.floor(pos / 3);
            var col = pos - line * 3;
            var left = marginLR + col * contentSize.width + col * margin + contentSize.width / 2;
            var top = this.marginTop + line * contentSize.height + line *  this.cardMarginTop;
            top = winSize.height - top+ contentSize.height / 2;
            cardSprite.setPosition(cc.p(left, top));
            //展现添加时的动画
            if (animate) {
                cardSprite.getChildren()[0].popScale();
            };
        },
        remove: function(cardSprite){
            cards.some(function(item, i){
                if (cardSprite === item) {
                    item.removeFromParent(true);
                    cards[i] = null;
                    return true;
                };
            })
        },
        getCards: function(){
            return cards.filter(function(item){
                return !!item;
            });
        },
        getCardIds: function(){
            return cards.filter(function(item){
                return !!item;
            }).map(function(item){
                var sprite = item.getChildren()[0];
                return sprite.cardId;
            })
        },
        //通过id获取card
        getCardById: function(cardId){
            var sprite = null;
            cards.some(function(item){
                if (!item) {
                    return false;
                };
                var id = item.getChildren()[0].cardId;
                if (id == cardId) {
                    sprite = item;
                    return true;
                };
                return false;
            })
            return sprite;
        },
        removeSelected: function(){
            cards.forEach(function(item){
                if (!item) {
                    return false;
                };
                var sprite = item.getChildren()[0];
                sprite.setSelected(false);
            })
        },
        getSelectedCards: function(){
            return cards.filter(function(item){
                if (!item) {
                    return false;
                };
                var sprite = item.getChildren()[0];
                return sprite.isSelected;
            })
        },
        //检测当前选中的3张卡牌能否消除
        check: function(){
            var cardIds = [];
            cards.forEach(function(item){
                if (!item) {
                    return false;
                };
                var sprite = item.getChildren()[0];
                if (sprite.isSelected) {
                    cardIds.push(sprite.cardId);
                };
            })
            if (cardIds.length != 3) {
                return false;
            };
            var flag = Card.checkReduce.apply(this, cardIds);
            if (flag) {
                return true;
            }else{
                return false;
            }
        },
        getCardByIndex: function(index){
            return cards[index];
        },
        getClearCards: function(){
            return this.hasClear(true);
        },
        //检测当前卡牌列表里是否有3张可以消除的牌
        hasClear: function(returnCards){
            var length = cards.length;
            for(var i = 0; i < length; i++){
                if (!cards[i]) {
                    continue;
                };
                for(var j = i+1; j < length; j++){
                    if (!cards[j]) {
                        continue;
                    };
                    for(var k = j+1; k < length; k++){
                        if (!cards[k]) {
                            continue;
                        };
                        var cardIds = [cards[i], cards[j], cards[k]].map(function(item){
                            var sprite = item.getChildren()[0];
                            return sprite.cardId;
                        })
                        var flag = Card.checkReduce.apply(this, cardIds);
                        if (flag) {
                            return returnCards ? [i, j, k] : true;
                        };
                    }
                }
            }
            return false;
        }
    }
}()
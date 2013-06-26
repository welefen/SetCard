var Menu = (function() {
    //使用frameCache的方式
    var frameType = false;
    function getMenuItemWithPic(config) {
        var getSprite = function(pic) {
            if (typeof pic != 'string') {
                return pic;
            };
            var sprite = null;
            if (frameType) {
                sprite = cc.Sprite.createWithSpriteFrameName(pic);
            }else{
                sprite = cc.Sprite.create(pic);
            }
            sprite.setAnchorPoint(cc.p(0, 0));
            sprite.setPosition(cc.p(0, 0));
            return sprite;
        };
        var sprite = getSprite(config.pic);
        var item = cc.MenuItemSprite.create(sprite, sprite, config.callback, config.context);
        if (typeof config.selectedItem == 'function') {
            var selecteSprite = config.selectedItem(getSprite(config.pic));
            item.setSelectedImage(selecteSprite);
        }else{
            if(config.selectedItem) {
                item.setSelectedImage(getSprite(getSelectedImg(config.pic)));
            }
        }
        if (typeof config.disabledItem == 'function') {
            var selecteSprite = config.disabledItem(sprite);
            item.setSelectedImage(selecteSprite);
        }else{
            if(config.disabledItem) {
                item.setDisabledImage(getSprite(getDisabledImg(config.pic)));
            }
        }
        item.setAnchorPoint(cc.p(0, 0));
        item.setPosition(cc.p(0, 0));

        return item;
    };

    function getMenuItemWithStr(config) {
        var getSprite = function(pic) {
            if (typeof pic != 'string') {
                return pic;
            };
            var sprite = cc.Sprite.create(pic);
            var label = cc.LabelTTF.create(config.text, default_font, config.fontSize);

            var spriteSize = sprite.getContentSize(),
                labelSize = label.getContentSize();

            label.setAnchorPoint(cc.p(0, 0));
            label.setPosition(cc.p((spriteSize.width - labelSize.width) / 2, (spriteSize.height - labelSize.height) / 2 + 2));
            label.setColor(config.fontColor);
            sprite.addChild(label, 2);

            return sprite;
        };

        var item = cc.MenuItemSprite.create(getSprite(config.pic), getSprite(config.pic), config.callback, config.context);

        if(config.hasSelected) {
            item.setSelectedImage(getSprite(getSelectedImg(config.pic)));
        }

        if(config.hasDisabled) {
            item.setDisabledImage(getSprite(getDisabledImg(config.pic)));
        }

        item.setAnchorPoint(cc.p(0, 0));
        item.setPosition(cc.p(0, 0));

        return item;
    };

    function getDisabledImg(img) {
        if (typeof img != 'string') {
            return img;
        };
        return img.replace(/\.(png|jpg|gif)/i, "_disabled.$1");
    };

    function getSelectedImg(img) {
        if (typeof img != 'string') {
            return img;
        };
        return img.replace(/\.(png|jpg|gif)/i, "_selected.$1");
    };

    return {
        getMenu : function(config) {
            var defConfig = {
                pic         : R.img_btn,     //背景图片，可以传数组
                text        : '',            //文字，可以传数组
                callback    : cc.FN,         //回调函数，可以传数组
                fontSize    : 38,            //字体大小，text不为空时有用
                fontColor   : cc.c3b(0,0,0), //字体颜色，text不为空时有用
                marginLeft  : 0,             //左偏移
                marginTop   : 0,             //上偏移
                position    : [0, 0],        //menu位置
                selectedItem : false,
                disabledItem : false,
                frameType: false
            };

            config = cc.mix(defConfig, config || {}, true);

            frameType = config.frameType;

            var items = [];

            if(typeof config.pic == 'string') {
                config.defPic = config.pic;
                config.pic = [config.pic];
            } else {
                config.defPic = config.pic[0];
            }

            if(typeof config.callback == 'function') {
                config.callback = [config.callback];
            }

            if(typeof config.text == 'string') {
                config.text = [config.text];
            }

            if(typeof config.selectedItem == 'boolean' || typeof config.selectedItem == 'function') {
                config.defSelectedItem= config.selectedItem;
                config.selectedItem = [config.selectedItem];
            } else {
                config.defHasSelected = config.selectedItem[0];
            }

            if(typeof config.disabledItem == 'boolean' || typeof config.disabledItem == 'function') {
                config.defDisabledItem = config.disabledItem;
                config.disabledItem = [config.disabledItem];
            } else {
                config.defHasDisabled = config.disabledItem[0];
            }
            var length = Math.max(config.text.length, config.pic.length);
            for(var i = 0; i < length; i++) {
                var text = config.text[i],
                    pic = config.pic[i] || config.defPic,
                    callback = config.callback[i] || (function(ii) {
                            return function() {
                                alert(ii);
                            };
                        })(i),
                    selectedItem = typeof config.selectedItem[i] !== 'undefined' ? config.selectedItem[i] : config.defSelectedItem,
                    disabledItem = typeof config.disabledItem[i] !== 'undefined' ? config.disabledItem[i] : config.defDisabledItem,
                    item;
                if(text) {
                    item = getMenuItemWithStr({
                        pic : pic,
                        callback : callback,
                        context : config.context,

                        disabledItem : disabledItem,
                        selectedItem : selectedItem,

                        text : text,
                        fontSize : config.fontSize,
                        fontColor : config.fontColor,
                    });
                } else {
                    item = getMenuItemWithPic({
                        pic : pic,
                        callback : callback,
                        context : config.context,

                        disabledItem : disabledItem,
                        selectedItem : selectedItem,
                    });
                }

                if(i > 0) {
                    var lastItem = items[i - 1],
                        size = lastItem.getContentSize(),
                        marginLeft = config.marginLeft ? size.width + config.marginLeft : 0,
                        marginTop = config.marginTop ? size.height + config.marginTop : 0;

                    item.setPosition(cc.pAdd(cc.p(marginLeft, -marginTop), lastItem.getPosition()));
                }

                items.push(item);
            }

            var menu = cc.Menu.create.apply(this, items);
            menu.setAnchorPoint(cc.p(0, 0));
            menu.setPosition(cc.p(config.position[0], config.position[1]));

            return menu;
        }
    };
})();
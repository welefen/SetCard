;(function(){
    //修复cc.MenuItemSprite.create(sprite, sprite)在浏览器下重复使用报错的问题
    var create = cc.MenuItemSprite.create;
    cc.MenuItemSprite.create = function(){
       var sprite = arguments[0];
       var args = [].slice.call(arguments).map(function(item, i){
            if (i && item === sprite) {
                item = null;
            };
            return item;
       });
       return create.apply(create, args);
    }
})();
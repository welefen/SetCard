var default_font = "Times New Roman";
var str_version = "V 1.0.0";

var $ = function(){

}
var isHtml5 = true;
if (typeof location != 'undefined') {
	isHtml5 = true;
};

/**
 * create sprite
 * @return {[type]} [description]
 */
$.sprite = function(obj){
	obj = obj || {};
	if (typeof obj == 'function') {
		obj = new obj();
	};
	var ctor = obj.ctor;
	obj.ctor = function(){
		if (isHtml5) {
			this._super();
		};
		//js binding下使用
		cc.associateWithNative( this, cc.Sprite );
		ctor && ctor.call(this);
	}
	/*obj.runAction = function(){
		var args = [].slice.call(arguments);
		if (args.length == 1 && (args[0] instanceof cc.Sequence || args[0] instanceof cc.Spawn) ) {
			return this._super.apply(this, arguments);
		};
		var s = cc.Sequence;
		if (args[args.length - 1] === true) {
			s = cc.Spawn;
			args = args.slice(0, args.length - 1);
		};
		var $this = this;
		args = args.map(function(item){
			if (typeof item == 'function') {
				item = cc.CallFunc.create(item, $this);
			};
			return item;
		});
		var seq = s.create.apply(s, args);
		return this._super.apply(this, seq);
	}*/

	var sprite = cc.Sprite.extend(obj);
	sprite.create = function(){
		var s = new sprite();
		if (s && s.init.apply(s, arguments)) {
			return s;
		};
		return null;
	}
	return sprite;
}
/**
 * create scene
 * @param  {[type]} obj [description]
 * @return {[type]}     [description]
 */
$.scene = function(obj, layer){
	if (typeof obj == 'function') {
		obj = new obj();
	};
	var ctor = obj.ctor;
	obj.ctor = function(){
		if (isHtml5) {
			this._super();
		};
		cc.associateWithNative( this, cc[layer || "Layer"] );
		ctor && ctor.call(this);
	}
	obj.getWinSize = function(){
		return cc.Director.getInstance().getWinSize();
	}
	var extendLayer = cc[layer || "Layer"].extend(obj);
	extendLayer.create = function(){
		var layer = new extendLayer();
	    if (layer && layer.init.apply(layer, arguments)) {
	        return layer;
	    }
	    return null;
	}
	extendLayer.scene = function(){
		this.currentScene = cc.Scene.create();
	    var layer = extendLayer.create();
	    this.currentScene.addChild(layer);
	    return this.currentScene;
	}
	return extendLayer;
}
/**
 * 通过frame创建sprite
 * @param  {[type]} name [description]
 * @param  {[type]} left [description]
 * @param  {[type]} top  [description]
 * @return {[type]}      [description]
 */
$.frameSprite = function(name, left, top){
	var sprite = cc.Sprite.createWithSpriteFrameName(name);
	sprite.setAnchorPoint(cc.p(0, 0));
	sprite.setPosition(cc.p(left || 0, top || 0));
	return sprite;
}
$.tranScene = function(scene, dur){
	dur = dur || 0.5;
	return cc.TransitionMoveInR.create(dur, scene);
};

$.setBackgroundMusic = (function(){
	var _name = '';
	return function(name) {
		if (name) {
			_name = name;
		}else{
			name = _name;
		}
		var bgSoundOff = GameData.get("bgSoundOff") | 0;
		if (bgSoundOff) {
			return true;
		};
		if (!name) {
			return true;
		};
		cc.AudioEngine.getInstance().playMusic(name, true);
	}
})();

$.removeBackgroundMusic = function() {
	cc.AudioEngine.end();
};

$.playEffect = function(name) {
	var soundOff = GameData.get("soundOff") | 0;
	if (soundOff) {
		return true;
	};
	cc.AudioEngine.getInstance().playEffect(name, false);
};
$.getRandom = function(min, max){
    return min + Math.ceil(Math.random() * (max - min));
}
/**
 * 创建一个label
 * @param  {[type]} config [description]
 * @return {[type]}        [description]
 */
$.label = function(config){
	config = cc.mix({
		name: "",
		size: 14,
		left: 0,
		top: 0,
		width: 50,
		height: 24,
		align: cc.TEXT_ALIGNMENT_CENTER,
		color: cc.c3b(0, 0, 0)
	}, config || {}, true);

	var label = cc.LabelTTF.create(config.name, $.default_font, config.size);
    label.setAnchorPoint(cc.p(0, 0));
    label.setPosition(cc.p(config.left, config.top));
    label.setDimensions(cc.size(config.width, config.height))
    label.setHorizontalAlignment(config.align);
    label.setColor(config.color);
    return label;
}
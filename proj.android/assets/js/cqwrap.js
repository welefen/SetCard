/**
 * 通用方法
 */

(function(){

if(!cc.Assert){
    cc.Assert = function(cond, msg){
        if(!cond){
            throw new Error(msg);
        }
    }
}

cc.FN = function(){};

cc.mix = function(des, src, mixer) {
	mixer = mixer || function(d, s){
		if(typeof d === 'undefined'){
			return s;
		}
	}
	
	if(mixer == true){
		mixer = function(d, s){return s};
	} 		

	for (var i in src) {
		var v = mixer(des[i], src[i], i, des, src);
		if(typeof v !== 'undefined'){
			des[i] = v;
		}
	}

	return des;
};

var _extend = cc.Class.extend; //override
cc.Class.extend = function(){
	var cls = _extend.apply(cc.Class, arguments);
    cls.extend = arguments.callee;
	cls.implement = function(proto){
		if(arguments.length > 1){
			//从右往左加，这样支持 cls.implement(Interface, {implements...});
			for(var i = arguments.length - 1; i >= 0; i--){
				cls.implement(arguments[i]);
			}
			return;
		}
        if(typeof proto == "function"){
            //function的好处是可以创建一个闭包作用域，这样就不必暴露全局变量给实现了接口的类
            proto = proto(cls); 
        }
		cc.mix(cls.prototype, proto, function(d, s, i, des){
			cc.Assert(s != null || des[i] != null, "warning: abstract method not implemented");
			return d ? d : s;
		});
	};
	return cls;
};

cc.Interface = function(proto){
	return proto;	
};

cc.CustEvent = cc.Interface(function(){
	var handlers = {};

	return {
		on: function(event, handler){
			if(typeof event === 'object'){
				for(var i in event){
					this.on(i, event[i]);
				}
				return;
			}

			handlers[event] = handlers[event] || [];
			handlers[event].push(handler);
		},
		un: function(event, handler){
			if(typeof event === 'object'){
				for(var i in event){
					this.un(i, event[i]);
				}
				return;
			}

			var _handlers = handlers[event] || [];
			_handlers.some(function(o, i){
				if(o == handler){
					_handlers.splice(i, 1);
					return true;
				}
			});
		},
        clear: function(event){
            var _handlers = handlers[event] || [];
            _handlers.length = 0;
        },
        clearAll: function(){
            handlers = {};
        },
		fire: function(event, args){
			args = args || {};
			var msg = {
                data: args,
				type: event,
				target: this,
				returnValue: true,
				preventDefault: function(){
					args.returnValue = false;
				}
			};
			var _handlers = handlers[event] || [];
            _handlers = _handlers.concat(handlers['*'] || []);
			_handlers.forEach(function(o){
				o(msg);
			});
			return msg.returnValue;
		}
	};
});

cc.ActionInterval.extend = cc.Class.extend;
cc.MenuItem.extend = cc.Class.extend;


if(cc.Sprite && !cc.Sprite.prototype.initWithFile){
    
    var _init = cc.Sprite.prototype.init;

    cc.Sprite.prototype.initWithFile = function(){
        return _init.apply(this, arguments);
    }
}
if (cc.Director && !cc.Director.prototype.getTouchDispatcher) {
    cc.Director.prototype.getTouchDispatcher = function(){
        return this._touchDispatcher;
    }
};
/**
 * 创建一个特定长度的数组
 * @param  {[type]} length [description]
 * @return {[type]}        [description]
 */
cc.createArray = function(length){
    return new Array(length + 1).join('*').split('');
}

if(!cc.NotificationCenter){
    var _sharedNotificationCenter = null;

    cc.NotificationCenter = cc.Class.extend({
        _notifier: cc.CustEvent(), 
        addObserver: function(message, selector){
            this._notifier.on(message, selector);
        },
        removeObserver: function(message, selector){
            if(selector){
                this._notifier.un(message, selector);
            }else{
                this._notifier.clear(message);
            }
        },
        removeAllObservers: function(){
            this._notifier.clearAll();
        },
        postNotification: function(message, data){
            this._notifier.fire(message, data);
        } 
    });

    cc.NotificationCenter.getInstance = function(){
        if(!_sharedNotificationCenter){
            _sharedNotificationCenter = new cc.NotificationCenter();
        }
        return _sharedNotificationCenter;
    }
}

/*cc.NotificationCenter.getInstance().addObserver("*", function(evt){
    cc.log([evt.type,evt.data]);
});

cc.NotificationCenter.getInstance().postNotification("test", "abc");*/

})();
/**
 * 网络核心
 */
(function(){

var notifier = new cc.NotificationCenter();
if (!cc.WebSocket) {
	cc.WebSocket = WebSocket;
};

var NetClient = cc.Class.extend({
	_options : {
		hosts: [],
		uid: 'guest',
	},
	_id: 1,
	_socket : null,
	_callbacks : [],	//用来存放对应的回调

	configure: function(conf){
		conf = conf || {};

		cc.mix(this._options, conf, function(d, s, k){

			if(k == 'hosts'){

				return d.concat(s);
			}
			return s;
		});

		var hosts = this._options.hosts;
		cc.Assert(hosts && hosts.length > 0, 'no network hosts, please check the configure');

		if(hosts.length > 1){
			hosts.sort(function(){
				return Math.random() > 0.5;
			});
		}

		//cc.log(hosts[0]);
	},
	open: function(callback){
		var self = this; 

		if(self.readyState == cc.WebSocket.OPEN){
			if(self.fire('open')){
				callback && callback();
				notifier.postNotification('open');
			}
			return;			
		}

		var socket = new cc.WebSocket(this._options.hosts[0]);
		
		self.reopen = function(){
			self.open(callback);
		}

		socket.onopen = function(){
			self.send('token', {uid:self._options.uid});
			if(self.fire('open')){
				callback && callback();
				notifier.postNotification('open');
			}
		}

		socket.onmessage = function(evt){
			if(self.fire('message', evt.data)){
				var data = evt.data;
				if(data){
					data = JSON.parse(data);
					cc.Assert(data.jsonrpc == '2.0', 'invalid data: ' + JSON.stringify(data));
					
					var _callbacks = self._callbacks;

					//如果有回调，先调用回调函数
					if(data.id && _callbacks[data.id]){
						_callbacks[data.id](data);
						//delete _callbacks[data.id];
					}else if(typeof data.id == "string"){	//不带id的是服务端推送
						self.fire(data.id, data);
					}

					if(data.result){
						notifier.postNotification('message', data.result);
					}else{
						notifier.postNotification('error', data.error);
					}
				}
			}
		}

		socket.onclose = function(){
			if(self.fire('close')){
				notifier.postNotification('close');
			}
		}

		this._socket = socket;
	},
	send: function(method, message, callback){
		
		if(typeof message == 'function'){
			callback = message;
			message = {};
		}

		var data = {
			jsonrpc: '2.0',
			method: method,
			params: message,
			id: this._id++,
		};

		if(callback){
			this._callbacks[data.id] = callback;
		}
		this._socket.send(JSON.stringify(data));
	},
	close: function(){
		this._socket.close();
	}
});

NetClient.implement(cc.CustEvent);

NetClient.getNotifier = function(){
	return notifier;
}

NetClient.prototype.__defineGetter__("readyState", function(){
	return this._socket ? this._socket.readyState : cc.WebSocket.CLOSED;
});

var _netClient;
NetClient.getInstance = function(){
	if(!_netClient){
		_netClient = new NetClient();
	}
	return _netClient;
}

cc.NetClient = NetClient;

///start Test...
/*
var netClient = cc.NetClient.getInstance();
//netClient.configure({hosts:['ws://173.230.147.231:9090/'], uid:'test'});
netClient.configure({hosts:['ws://192.168.1.113:9090/'], uid:'test'});
netClient.open(function(){
	
	//获得当前用户数据
	netClient.send('getInfo', function(data){
		cc.log('getInfo --->' + JSON.stringify(data));
	});

	//加入房间
	netClient.send('join', {gid:1, roomType:2}, function(data){
		cc.log('join --->' + JSON.stringify(data));
	});

	//取牌
	netClient.send('deal', function(data){
		cc.log('deal --->' + JSON.stringify(data));
	});

	//出牌
	netClient.send('play', {cards:[1,1,1,1,2],score:1000}, function(data){
		cc.log('play --->' + JSON.stringify(data));
	});


});

//由服务端发起的通知
//广播 
netClient.on('broadcast', function(data){
	cc.log('broadcast --->' + JSON.stringify(data));
});

//由服务端发起的事件
netClient.on('event', function(data){
	cc.log('event --->' + JSON.stringify(data));
});


//断开了
netClient.on('close', function(){
	cc.log('reopen after 2 sec');
	setTimeout(function(){
		netClient.reopen();
	}, 2000);
});
*/

///end Test...

})();
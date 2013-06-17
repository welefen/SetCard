(function(){

var Player = cc.Class.extend({
	context: null,
	position: -1,

	ctor: function(userInfo){
		userInfo = userInfo || {
			name: 'player',
			coins: 1000,
			type: 'ai'	/*ai、 player、 remote*/
		};

		cc.mix(this, userInfo);
	},
	join: function(ctx){
		if(ctx.fire('join', {player: this})){
			//如果成功join
			this.context = ctx;
			this.fire('join', {context: ctx});
			return true;
		}
		return false;
	},
	leave: function(){
		var ctx = this.context;
		cc.Assert(ctx, 'no context, please join a game');

		if(ctx && ctx.fire('leave', {player: this})){
			
			this.fired('leave', {context: ctx});
			this.context = null;
			
			return true;
		}
		return false;
	},
	ready: function(){
		var ctx = this.context;
		cc.Assert(ctx, 'no context, please join a game');

		if(ctx && ctx.status == 'open'){
			if(ctx.fire('ready', {player: this})){
				this.fire('ready', {context: ctx});
				return true;
			}
		}
		return false;
	},
	//从context获得牌，需要触发context的deal事件
	getCards: function(){
		var ctx = this.context;
		cc.Assert(ctx, 'no context, please join a game');

		if(ctx && ctx.fire('deal', {player: this})){
			this.fire('deal', {context:ctx});
			return true;
		}
		return false;
	},
	putCards: function(cards){	//将手中的牌打出
		var ctx = this.context;
		cc.Assert(ctx, 'no context, please join a game');

		if(ctx && ctx.fire('check', {player:this, cards: cards})){
			if(ctx.fire('play', {player:this, cards: cards})){
				this.fire('play', {context: ctx});
				return true;
			}
		}
		return false;
	}
});

Player.implement(cc.CustEvent);

cc.mix(cc, {
	Player: Player
});


})();
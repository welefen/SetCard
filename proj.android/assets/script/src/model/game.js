(function(){

/**
 * 卡牌游戏控制器，拥有自己的生命周期
 *
 * var context = new GameContext(config);
 * 
 * var player = new Player();
 * player.jion(context);
 * 
 */

//private methods

function _getAllPlayers(ctx){
	return ctx.seats.filter(function(o){return o !== null});
}

function _countEmptySeat(ctx){
	return ctx.seats.length - _getAllPlayers(ctx).length;
}

//public
var GameContext = cc.Class.extend({
	status: 'closed', /* open、 playing、 closed */
	seats : [],					//座位
	game: null,

	ctor: function(config){
		this.init(config);
	},

	init: function(config){

		var defaultConfig = {
			cards : [],
			minPlayer : 2,
			maxPlayer : 8,

			server: null,	//网络信息
		};

		config = config || {};
		cc.mix(config, defaultConfig);
		cc.mix(this, config);
			
		this.seats = new Array(this.maxPlayer);	//创建所有的座位
		this.status = 'open';
		var self = this;

		this.on({
			join: function(evt){
				if(self.status == 'closed'){
					return (evt.returnValue = false);
				}

				//有人加入
				var player = evt.player;
				var seats = self.seats;

				if(seats.some(function(seat){return seat && seat.player == player})){
					//已经加入了
					return (evt.returnValue = false);
				}

				if(!_countEmptySeat(self)){
					//没有空位置了
					return (evt.returnValue = false);
				}

				for(var i = 0; i < seats.length; i++){
					//分配一个空位置
					if(!seats[i]){
						//加入座位
						seats[i] = {player : player, status: 'join'};
						player.position = i;
						break;
					}
				}
				return true;
			},
			leave: function(evt){

			},
			ready: function(evt){
				//有玩家准备好了
				var player = evt.player;
				var seats = self.seats;
				var playerState = seats[player.position];

				cc.Assert(playerState && playerState.player == player, 'bad player');
				
				if(self.status == "open"){
					playerState.status = 'ready';

					var players = _getAllPlayers(self);

					if(players.every(function(o){o.status == 'ready' || o.status == 'timeout'})){
						//都准备好了，开始
						self.status = 'playing';
						if(self.fire('roundstart', {players: players})){
							//回合开始，等待回合结束
							self.wait('roundend', function(){
								self.fire('roundend', {players: players});
							});
						}
					}

					return true;
				}else{
					return (evt.returnValue = false);
				}
			},
			deal: function(evt){

			},
			play: function(evt){

			},
			check: function(evt){

			}
		});
	}
});

GameContext.implement(cc.CustEvent, cc.Async);

cc.mix(cc,{
	GameContext: GameContext
});

})();
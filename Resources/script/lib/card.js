/**
 * 纸牌
 */
var Card = function(){
	var cardList = [];
	var cardIndex = 0;
	function generateList(num, add){
		var length = num || 81;
	    var arr = new Array(length);
	    arr[0] = 0;
	    for (var i=1; i<length; i++) {
	        var rnd = Math.floor(Math.random()*(i+1));
	        arr[i] = arr[rnd];
	        arr[rnd] = i;
	    };
	    add = add | 0;
	    if (add) {
	    	return arr.map(function(item, i){
	    		return item + add;
	    	})
	    };
	    return arr;
	}
	function generateByMode(mode){
		var items = {
			"beginner": 6,
			"easy": 15,
			"medium": 30,
			"hard": 60,
			"expert": 81
		};
		var item = items[mode] || 81;
		var total = 81;
		var nums = Math.ceil(total / item);
		var result = [];
		for(var i = 0; i < nums; i++){
			if (i == (nums - 1)) {
				var list = generateList(total - i * item, i * item);
			}else{
				var list = generateList(item, i * item);
			}
			result.push(list);
		}
		result.sort(function(){
			return Math.random() >= 0.5 ? 1 : -1;
		})
		var ret = [];
		result.forEach(function(item){
			ret.push.apply(ret, item);
		})
		return ret;
	}
	function getCard(){
		if (cardIndex == cardList.length) {
			return false;
		};
		return cardList[cardIndex++];
	}
	function getInfo(cardId){
		var x = parseInt(cardId / 27);
		var y = parseInt((cardId - x * 27)/9);
		var z = parseInt((cardId - x * 27 - y * 9)/3);
		var h = cardId - x * 27 - y * 9 - z * 3;
		return [x, y, z, h];
	}
	/**
	 * 通过cardid获取对应的文件名
	 * @param  {[type]} cardId [description]
	 * @return {[type]}        [description]
	 */
	function getFileName(cardId){
		if (!cardId.join) {
			cardId = getInfo(cardId);
		};
		var file = "item_";
		file += ( cardId[1] + 1 )+ '-';
		file += cardId[2] * 3 + cardId[3] + 1;
		return file;
	}
	/**
	 * 检测3个card是否可以消除
	 * @param  {[type]} cardId1 [description]
	 * @param  {[type]} cardId2 [description]
	 * @param  {[type]} cardId3 [description]
	 * @return {[type]}         [description]
	 */
	function checkReduce(cardId1, cardId2, cardId3){
		if (arguments.length != 3) {
			return false;
		};
		var ci1 = getInfo(cardId1);
		var ci2 = getInfo(cardId2);
		var ci3 = getInfo(cardId3);
		var flag = ci1.every(function(item, i){
			if ((ci1[i] == ci2[i]) && (ci1[i] != ci3[i])) {
				return false;
			};
			if ((ci1[i] == ci3[i]) && (ci1[i] != ci2[i])) {
				return false;
			};
			if ((ci2[i] == ci3[i]) && (ci1[i] != ci2[i])) {
				return false;
			};
			return true;
		});
		if (!flag) {
			return false;
		};
		return true;
	}
	return {
		init: function(){
			cardList = [];
			cardIndex = 0;
		},
		isFinish: function(){
			return cardIndex == cardList.length;
		},
		setCardList: function(list){
			cardList = list;
		},
		getCardList: function(){
			return cardList;
		},
		setIndex: function(index){
			cardIndex = index;
		},
		getIndex: function(){
			return cardIndex;
		},
		getFileName: getFileName,
		generateList: generateList,
		generateByMode: generateByMode,
		getCard: getCard,
		getInfo: getInfo,
		checkReduce: checkReduce
	}
}();
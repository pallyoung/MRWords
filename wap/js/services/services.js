(function () {
	function factory(mrwords,db_help,TaskRunner){
		mrwords.factory("$remoteDB",function($http,$api){
			return {
				checkWordsUpdate:function(){
					return $http.get($api.getUpdateTime);
				},
				getListUrls:function(){
					return $http.get($api.getLists);
				},
				getWordList:function(url){
					return $http.get($api.host+"/"+url);
				},
				getMeaning:function(w){
					return http.post($api.getMeaning,{
						"type": "auto",
						"q": word}).success(function(data){
							data = JSON.parse(data);
							var reg = /(<p>[\s]*?<span\s*class=\"dt\">.+<\/p>)/;
							var meaning = data.ret.replace(/\r\n/g, "");
							if (reg.test(meaning)) {
								meaning = RegExp.$1;
							}
							return meaning;
						});
				}
			}
		}).factory("$db",function($remoteDB){
			function updateList(){
				return $remoteDB.getListUrls().then(function(response){
					var data = response.data;
					var book ;
					var tr = new TaskRunner();
					for (var i in data) {
						book = data[i];
						tr.addTask(function(){
							db_help.clearList();

							return db_help.clearWord();
						});
						for(var l in book){
							tr.addTask((function(list){
								return function(){
									return db_help.putList(list);
								}								
							})(book[l]));	
							tr.addTask((function(list){
								return function(){
									return updateWord(list);
								}								
							})(book[l]));	
						}						
					}
					return tr.run();
				},function(){

				});
			}
			function updateWord(list){
				return $remoteDB.getWordList(list.url).then(function(response){
					var data = response.data;
					var tr = new TaskRunner();
					for (var i in data) {
						tr.addTask((function(word){							
							return function(){
								return db_help.putWord(word);	
							}							
						})(data[i]));						
					}
					return tr.run();
				});
			}
			return {
				clear:db_help.clear,
				getList:db_help.getList,
				getWordByList:db_help.getWordByList,
				update:function(){
					return $remoteDB.checkWordsUpdate().then(function(response){
						var updateTime = 0;
						try {
							var updateTime = Number(localStorage.getItem("updateTime"));
							localStorage.setItem("updateTime", response.data);
							if (updateTime < response.data) {
								return updateList();
							}
						} catch (e) {
							localStorage.setItem("updateTime", response.data);
							return updateList();
						}
					},function(){
					});
				}
			}
		})
		.factory("$mystate",function($state){
			var $mystate = $state;
			var go = $state.go;
			$mystate.history = [];
			$mystate.go = function(state, params, options){
				$mystate.history.push([state, params, options]);
				go.apply($mystate,arguments);
			}
			$mystate.redirect = function(){
				$mystate.history = [];
				go.apply($mystate,arguments);
			}
			$mystate.back = function(){
				$mystate.history.pop();
				history.go(-1);
			}
			return $mystate;
		});
	}
	define(["mrwords","db_help","TaskRunner"],factory);
})();
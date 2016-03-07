// listCtrl.js
(function () {
	function factory(mrwords){
		mrwords.controller("listCtrl",function($scope,$remoteDB,$db,$rootScope,$const){
			//$db.clear();
			$scope.lists = [];
			$db.getList().then(function(lists){		
				$scope.lists = lists;
				$scope.$digest()
				console.log(lists);
			});
			$scope.$emit("titlechange",$const.APP_NAME);
		})
		.controller("pageCtrl",function($scope,$remoteDB,$db,$stateParams,$compile,$rootScope){
			$scope.words = [];
			$scope.selectedWord = {};
			if(!$stateParams.list_id){
				$rootScope.$mystate.redirect("app.list");
				return;
			}
			$scope.$emit("titlechange",$stateParams.list_name);
			$db.getWordByList($stateParams.list_id).then(function(words){	
				$scope.words = words;
				console.log(words)
			},function(){
			});
			$scope.showMeaning = function(word){
				$scope.selectedWord =word ;
			}
		})
		.controller("headerCtrl",function($scope,$rootScope,$db){

		})
		.controller("appCtrl",function($scope,$rootScope,$const){
			$scope.goBack = function(){
				$rootScope.$mystate.back();
			}
			$rootScope.$mystate.redirect("app.list");
			$scope.hasHeader = true;
			$scope.showMenu = false;
			$scope.title = $const.APP_NAME;
			$scope.$on("titlechange",function(e,v){
				$scope.title = v;
			});
			$scope.toggleMenu = function(){
				$scope.showMenu = !$scope.showMenu;
			}
			
		})
		.controller("MenuCtrl",function($scope,$db,$rootScope){
			$scope.checkDBUpdate = function(){
				$db.update().then(function(){
					$rootScope.$mystate.reload();					
				},function(){
					console.log("error");
				});
			};
		})
		.controller("SettingCtrl",function($scope,$rootScope,$const){
			$scope.ip = $const.ip;
			$scope.$emit("titlechange","设置");
			$scope.save=function(){
				localStorage.setItem("mrwords_ip",$scope.ip);
				location.reload();
			}
		});
	}
	define(["mrwords"],factory);
})();
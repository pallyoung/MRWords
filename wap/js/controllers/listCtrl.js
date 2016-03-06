// listCtrl.js
(function () {
	function factory(mrwords){
		mrwords.controller("listCtrl",function($scope,$remoteDB,$db,$rootScope){
			//$db.clear();
			$scope.lists = [];
			$db.getList().then(function(lists){	
				for(var i =100;i>0;i--){
					lists.push({
						name:"a"+i,
						id:i
					});
				}			
				$scope.lists = lists;
				console.log($scope.lists);
			});
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
				for(var i =100;i>0;i--){
					words.push({
						word:"a"+i,
						id:i
					});
				}			
				$scope.words = words;
				console.log(words)
			},function(){
				console.log(111)
			});
			$scope.showMeaning = function(word){
				$scope.selectedWord =word ;
			}
		})
		.controller("headerCtrl",function($scope,$rootScope,$db){
			$scope.checkDBUpdate = function(){
				$db.update().then(function(){
					$rootScope.$mystate.reload();					
				},function(){
					console.log("error");
				});
			};

		})
		.controller("appCtrl",function($scope,$rootScope,$const){
			$scope.goBack = function(){
				$rootScope.$mystate.back();
			}
			$rootScope.$mystate.redirect("app.list");
			$scope.hasHeader = true;
			$scope.title = $const.APP_NAME;
			$scope.$on("titlechange",function(e,v){
				$scope.title = v;
			})
		});
	}
	define(["mrwords"],factory);
})();
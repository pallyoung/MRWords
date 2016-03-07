// router_main.js
(function() {
	var baseUrl = "templates"
	var routerMap = [
	{	
		name:"app",
		url:"/app",	
		views:{
			"":{
				templateUrl: baseUrl+"/app.html",
				controller:"appCtrl"	
			},
			"header@app":{
				templateUrl: baseUrl+"/header.html",
				controller:"headerCtrl"	
			},
			"menu@app":{
				templateUrl:baseUrl+"/menu.html",
				controller:"MenuCtrl"
			}
		}		
		
	},
	{
		name:"app.list",
		url:"/list",
		views:{
			"content@app":{
				templateUrl: baseUrl+"/list.html",
				controller:"listCtrl"
			}
		}
		
	},
	{
		name:"app.page",
		url:"/page/:list_id/:list_name",
		views:{
			"content@app":{
				templateUrl: baseUrl+"/page.html",
				controller:"pageCtrl"
			}
		}	
	},
	{
		name:"app.setting",
		url:"/setting",
		views:{
			"content@app":{
				templateUrl: baseUrl+"/setting.html",
				controller:"SettingCtrl"
			}
		}
	}];
	function stateProvider(stateProvider,routerMap){
		var router;
		for(var o in routerMap){
			router = routerMap[o];
			stateProvider.state(router.name,router);
		}	
	}
	function factory(mrwords){
		mrwords.config(function($stateProvider){
			stateProvider($stateProvider,routerMap);
		});
	}
	define(["mrwords"],factory);
})()
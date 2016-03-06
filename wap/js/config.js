(function config() {
	require.config({
		paths: {
			mrwords:"index",
			ctrls:"ctrls",
			views:"views",
			services:"services",
			constant:"constant",
			View: "View",
			app:"app",
			DBM:"libs/DBManager",
			http:"libs/http",
			TaskRunner:"libs/TaskRunner",
			ionic:"libs/ionic/js/ionic.bundle"
		},
		shim: {
		}
	});
	require(["mrwords","views","constant","ctrls","services"],function(mrwords){
		mrwords.config(function($urlRouterProvider,$ionicConfigProvider){
			$ionicConfigProvider.views.maxCache(0);
			$urlRouterProvider
				.when("", "/app")
				.otherwise("/app");
			;
		});

		mrwords.run(function($ionicPlatform,$rootScope, $mystate, $stateParams,$const) {
			$rootScope.$mystate = $mystate;			
		  	$ionicPlatform.ready(function() {
		    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
		    // for form inputs).
		    // The reason we default this to hidden is that native apps don't usually show an accessory bar, at
		    // least on iOS. It's a dead giveaway that an app is using a Web View. However, it's sometimes
		    // useful especially with forms, though we would prefer giving the user a little more room
		    // to interact with the app.
		    if (window.StatusBar) {
		      // Set the statusbar to use the default style, tweak this to
		      // remove the status bar on iOS or change it to use white instead of dark colors.
		      StatusBar.hide();
		    }

		  });
		});
	});
})();
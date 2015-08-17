(function config() {
	require.config({
		paths: {
			View: "js/View",
			app:"js/app",
			DBM:"js/libs/DBManager",
			http:"js/libs/http"
		},
		shim: {
		}
	});
	require(["app"],function(){

	});
})()
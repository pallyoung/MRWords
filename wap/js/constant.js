// constant.js
(function () {
	var ip = "http://localhost:3000";

	function factory(mrwords){
		mrwords.constant("$const",{
			ip:ip,
			DB_VERSION:1,
			APP_NAME:"我的生词本",
			APP_VERSION:"1.0.0",
			APP_VERSION_CODE:"1"

		}).constant("$api",{
			getBooks:ip+"/common/getBooks",
			getUpdateTime:ip + "/common/getWordsUpdateTime",
			getLists:ip + "/common/getWordListsURL",
			getMeaning:"http://fy.iciba.com/api.php",
			host:ip
		});
	}
	define(["mrwords"],factory);
})();
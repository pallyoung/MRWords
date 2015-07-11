(function (argument) {
	var path="src/data";
	var path1="wordlist";
	var fs = require('fs');
	var util=require("util");
	function savewordlist(request,response){
		var _path;
		if(!fs.existsSync(path)){
			fs.mkdirSync(path);
		};
		_path=path+"/"+path1;
		if(!fs.existsSync(_path)){
			fs.mkdirSync(_path);
		};
		var fname=request.getParameter("name");
		fs.writeFile(_path+"/"+fname+".json",request.getParameter("list"), function(err) {
			response.writeHead(200, {
				'Content-Type': 'text/plain;charset=UTF-8',
			});
			if(err){
				response.write("error");
				console.log(util.inspect(err));
			}else{
				response.write("success");
			}			
			response.end();
		});
		fs.writeFile(path+"/updatetime.json",fname, function(err) {

		});
		fs.readFile(path+"/wordlists.json",function(err,data){
			if(data!=undefined){
				data=JSON.parse(data);
			}else{
				data=[];
			}
			data.push({
				"updateTime":fname,
				"url":"data/wordlist/"+fname+".json"
			});
			fs.writeFile(path+"/wordlists.json",JSON.stringify(data), function(err) {

			});
		});
		
	}

	function getWordsUpdateTime(request,response){
		fs.readFile(path+"/updatetime.json",function(err, data){
			response.writeHead(200, {
				'Content-Type': 'text/plain;charset=UTF-8',
			});
			response.write(data);
			response.end();
		});
	}
	function getWordListsURL(request,response){
		fs.readFile(path+"/wordlists.json",function(err,data){
			response.writeHead(200, {
				'Content-Type': 'text/plain;charset=UTF-8',
			});
			if(data!=undefined){
				response.write(data);
			}else{
				response.write("[]");
			}			
			response.end();
		});
	}

	module.exports={
		savewordlist:savewordlist,
		getWordsUpdateTime:getWordsUpdateTime,
		getWordListsURL:getWordListsURL
	}
})();
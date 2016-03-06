(function (argument) {
	var path="src/data";
	var path1="wordlist";
	var fs = require('fs');
	var util=require("util");
	function savewordlist(request,response){
		var _path;
		var updatetime=Date.now();
		if(!fs.existsSync(path)){
			fs.mkdirSync(path);
		};
		_path=path+"/"+path1;
		if(!fs.existsSync(_path)){
			fs.mkdirSync(_path);
		};
		var id = request.getParameter("id");
		var name = request.getParameter("name");
		var book_id = request.getParameter("book_id");
		//单词写进单词库
		fs.writeFile(_path+"/"+book_id+"_"+id+".json",decodeURIComponent(request.getParameter("list")), function(err) {
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
		fs.writeFile(path+"/updatetime.json",updatetime, function(err) {

		});	
	}
	function savelists(request,response){
		var _path;
		var updatetime=Date.now();
		if(!fs.existsSync(path)){
			fs.mkdirSync(path);
		};
		_path=path+"/"+path1;
		if(!fs.existsSync(_path)){
			fs.mkdirSync(_path);
		};
		var lists = JSON.parse(decodeURIComponent(request.getParameter("lists")));
		var list;
		for (var o in lists){
			list = lists[o];
			fs.writeFile(_path+"/"+list.book_id+"_"+list.list_id+".json",JSON.stringify(list.data), function(err) {});
			fs.readFile(path+"/wordlists.json",function(err,data){
				if(data){
					data = JSON.parse(data);
					data[list.book_id][list.list_id].u_time = Date.now();
				}
				fs.writeFile(path+"/wordlists.json",JSON.stringify(data),function(err){

				})
			})

		}
		
		fs.writeFile(path+"/updatetime.json",Date.now(), function(err) {});	
		response.writeHead(200, {'Content-Type': 'text/plain;charset=UTF-8',});		
		response.end();

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
		var book_id = request.getParameter("book_id");
		fs.readFile(path+"/wordlists.json",function(err,data){
			response.writeHead(200, {
				'Content-Type': 'text/plain;charset=UTF-8',
			});
			if(data){
				data = JSON.parse(data);
				if(book_id){
					data = data[book_id]||{};
				}			
				response.write(JSON.stringify(data));
			}else{
				response.write("{}");
			}			
			response.end();
		});
	}
	function createBook(request,response){
		var name = request.getParameter("name");
		var id = Date.now();
		var c_time = id;
		var u_time = id;
		fs.readFile(path+"/book.json",function(err,data){
			response.writeHead(200, {
				'Content-Type': 'text/plain;charset=UTF-8',
			});
			if(data!=undefined){
				data = JSON.parse(data);
			}else{
				data = {};
			}
			data[id] = {
				id:id,
				name:name,
				c_time:id,
				u_time:id
			}
			fs.writeFile(path+"/book.json",JSON.stringify(data), function(err) {

			});	
			response.end();
		});
	}
	function getBooks(request,response){
		fs.readFile(path+"/book.json",function(err,data){
			response.writeHead(200, {
				'Content-Type': 'text/plain;charset=UTF-8',
			});
			if(!data){
				data = "{}";				
			}
			response.write(data);
			response.end();
		});
	}
	function createChapter(request,response){
		var book_id = request.getParameter("book_id");
		var chapterName = request.getParameter("name");
		var id = Date.now();
		fs.readFile(path+"/wordlists.json",function(err,data){
			var book;
			
			if(!data){
				data = {}
			}else{
				data = JSON.parse(data);
			}
			data[book_id]= data[book_id]||{};
			book = data[book_id];
			book[id] = {
				id:id,
				book_id:book_id,
				name:chapterName,
				c_time:id,
				u_time:id,
				url:"data/wordlist/"+book_id+"_"+id+".json"
			}
			fs.writeFile(path+"/wordlists.json",JSON.stringify(data),function(err){
				if(err){
					response.writeHead(404, {
						'Content-Type': 'text/plain;charset=UTF-8',
					});					
				}else{
					response.writeHead(200, {
						'Content-Type': 'text/plain;charset=UTF-8',
					});
				}	
				response.end();			
			});
			fs.writeFile("src/data/wordlist/"+book_id+"_"+id+".json","{}",function(err){	
			});
		});
	}
	module.exports={
		savewordlist:savewordlist,
		getWordsUpdateTime:getWordsUpdateTime,
		getWordListsURL:getWordListsURL,
		createBook:createBook,
		getBooks:getBooks,
		createChapter:createChapter,
		savelists:savelists
	}
})();
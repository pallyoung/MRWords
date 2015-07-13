(function app() {
	function factory(View, DBM, http) {
		var db = new DBM("MRWords");
		var ip="http://192.168.1.111:3000";
		ip="http://localhost:3000";
		db.contains("wordslist").then(function(data) {
			if (!data.result) {
				db.createObjectStore("wordslist", {
					keyPath: "id",
					autoIncrement: true
				}, [{
					name: "word",
					keyPath: "word",
					optional: {
						unique: true
					}
				}, {
					name: "name",
					keyPath: "name",
					optional: {
						unique: false
					}
				}]);
			}
		});

		function parseJSON(json) {
			try {
				return JSON.parse(json);
			} catch (e) {
				return json;
			}
		}

		function checkWordsUpdate() {
			http.ajax({
				type: "get",
				url: ip+"/common/getWordsUpdateTime",
				success: function(data) {
					var updateTime=0;
					try {
						updateTime = Number(localStorage.getItem("updateTime"));
						localStorage.setItem("updateTime", data);
						localStorage.setItem("lastUpdateTime", updateTime);
						if (updateTime < data) {
							getWordListsURL();
						}
					} catch (e) {
						localStorage.setItem("updateTime", data);
						localStorage.setItem("lastUpdateTime",0);
						getWordListsURL();
					}
				},
				error: function() {
					alert("getWordsUpdateTime error");
				}
			});
		}

		function getWordListsURL() {
			http.ajax({
				type: "get",
				url: ip+"/common/getWordListsURL",
				success: function(data) {
					data = parseJSON(data);
					for(var i in data){
						if(Number(data[i].updateTime)>Number(localStorage.getItem("lastUpdateTime"))){
							getWordList(data[i].url);
						}
					}
				},
				error: function() {
					alert("getWordListsURL error");
				}
			});
		}

		function getWordList(url) {
			http.ajax({
				type:"get",
				url:ip+"/"+url,
				success:function(data){
					data=parseJSON(data);
					for(var i in data){
						db.put("wordslist",[{value:data[i]}]);
					}
					db.then(function(){
						getBook();
					});
					
				},
				error:function(){
					alert("getWordList error");
				}
			});
		}

		function getMeaning(word,cb) {
			db.query("wordslist","word",[word]).then(function(data){
				data=parseJSON(data.result)[0];
				if(data&&data.meaning){
					cb(data.meaning);
				}else{
					http.ajax({
						type:"post",
						url:"http://fy.iciba.com/api.php",
						data:{
							"type":"auto",
							"q":word
						},
						success:function(responseData){
							responseData=parseJSON(responseData);
							var reg=/(<p>[\s]*?<span\s*class=\"dt\">.+<\/p>)/;
							data.meaning=responseData.ret.replace(/\r\n/g,"");
							if(reg.test(data.meaning)){
								data.meaning=RegExp.$1;
							}
							db.put("wordslist",[{value:data}]);
							cb(data.meaning);
						},
						error:function(){

						}
					});
				}
			});
		}
		function showMeaning(meaning){

		}
		function getBook(){
			db.query("wordslist","name").then(function(data){
				var names=[];
				data=data.result;
				data.sort(function(a,b){
					if(a.name>b.name){
						return 1;
					}
					return -1;
				});
				for(var i=0;i<data.length;i++){
					if(!data[i-1]||data[i-1].name!=data[i].name){
						names.push(data[i].name);
					}
				}
				showBooks(names,names.length);
			});
		}
		var toolbar=new View.GridView();

		var homepage=new View.GridView();
		var indexs=[
			new View.GridView(),
			new View.GridView(),
			new View.GridView()
		];
		var wordpage=new View.GridView();
		var wordslists=[
			new View.GridView(),
			new View.GridView(),
			new View.GridView()
		];
		var tipsView=new View.WordView();

		var backView=new View.ButtonView();
		backView.bind({
			value:"返回"
		});
		var updateView=new View.ButtonView();
		updateView.bind({
			value:"更新"
		});
		var index=0;

		var books=[];
		var content=[];
		function showBooks(names,count){
			var pages=Math.floor(names.length/count);
			var start=count*index;
			var end=count*(index+1)<names.length?count*(index+1):names.length;
			var realCount=end-start;
			var view;
			books=[];
			for(var i=0;i<realCount;i++){
				view=new View.WordView();
				view.setTag("name",names[start+i]);
				view.bind({word:new Date(Number(names[start+i])).toLocaleDateString()})
				books.push(view);
			}
			indexs[1].setAdapter(books);
		}
		function showWords(name){
			db.query("wordslist","name").then(function(data){
				var words=[];
				var view;
				data=data.result;
				for(var i=0;i<data.length;i++){
					if(data[i].name===name){
						view = new View.WordView();
						view.bind({word:data[i].word});
						words.push(view);
					}					
				}
				wordslists[1].setAdapter(words);
			});
		}

		
		//index.setAdapt();
		
		document.body.innerHTML+=homepage.render();
		document.body.innerHTML+=wordpage.render();
		document.body.innerHTML+=toolbar.render();
		document.body.innerHTML+=tipsView.render({word:""});
		homepage.setAdapter(indexs);
		homepage.css("z-index:2;top:0;bottom:2rem;left:0;");
		indexs[1].css("top:0;left:0;overflow-y:auto");
		indexs[2].css("z-index:-1");
		wordpage.setAdapter(wordslists);
		wordpage.css("z-index:1;top:0;bottom:2rem;left:0;overflow-y:auto;");
		wordslists[1].css("top:0;left:0;padding-left:1em");
		wordslists[2].css("z-index:-1");
		tipsView.css("width:100%;position:absolute;bottom:2rem;z-index:3;display:none");
		toolbar.css("bottom:0;height:2rem;position:fixed");
		toolbar.setAdapter([backView,updateView]);
		backView.css("position:absolute;right:0;");
		updateView.css("position:absolute;left:0;");
		homepage.on("click",function(e){
			tipsView.style("display","none");
			var id=e.target.id;
			for(var i=0;i<books.length;i++){
				if(id===books[i].id){
					homepage.style("display","none");
					wordpage.style("display","block");
					showWords(books[i].getTag("name"));
					return;
				}
			}
		},false);
		wordpage.on("click",function(e){
			var word=e.target.innerHTML;
			
			if(e.target.tagName==="WORDVIEW"&&word!=""){
				getMeaning(word,function(meaning){
					tipsView.bind({word:meaning})
					tipsView.render(tipsView.data);
					tipsView.css("width:100%;position:absolute;bottom:2rem;z-index:3;display:block;text-align:right");
					//tipsView.style("display","block");
				})
			}
		},false);
		toolbar.on("click",function(){
			tipsView.style("display","none");
		});
		backView.on("click",function(){
			homepage.style("display","block");
			wordpage.style("display","none");
		});
		updateView.on("click",function(){
			checkWordsUpdate();
		});
		getBook();
	}
	define(["View", "DBM", "http"], factory);
})()
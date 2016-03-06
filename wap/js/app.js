(function app() {
	function factory(DBM, http) {
		var db = new DBM("MRWords");
		var ip = "http://192.168.1.111:3000";
		var ID_MAIN = "main";
		var ID_BOOKLIST = "booklist";
		var ID_CONTENT = "content";
		var ID_WORDLIST = "wordlist";
		var ID_STAGE = "stage";
		var ID_WORD = "word";
		var ID_MEANING = "meaning";
		var ID_FOOT = "foot";
		var ID_UPDATE = "update";
		var ID_BOOKNAME = "bookname";
		var ID_BACK = "back";
		var ID_OVERLAY = "overlay";
		var ID_PAINTER = "painter";
		//ip = "http://localhost:3000";

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
		function initPainter () {
			var painter = document.getElementById(ID_PAINTER);
			painter.height = document.body.clientHeight;
			painter.width = document.body.clientWidth;
		}
		function  showLoading () {
			document.getElementById(ID_OVERLAY).style.display="block";
			var painter = document.getElementById(ID_PAINTER);
			var ctx = painter.getContext("2d");
			var height = painter.height;
			var width = painter.width;
			var starttime = 0;
			painter.width=width;
			function  draw (timestamp) {
				if(starttime===0){
					starttime = timestamp;
				}
				var deg = Math.PI/6;
				var o1 = 44;
				var r1 = 8;
				var intervel = 100;
				painter.width=width;
				ctx.save();
				ctx.translate(width/2,height/2);
				ctx.rotate(Math.ceil((timestamp-starttime)/intervel)*deg);
				ctx.fillStyle = "rgb(255,255,255)";
				ctx.arc(o1,0,r1,0,Math.PI*2,false);
				ctx.fill();
				ctx.closePath();
				
				ctx.fillStyle = "rgb(160,160,160)";
				for(var i=0;i<11;i++){
					ctx.beginPath();
					ctx.rotate(deg);
					ctx.arc(o1,0,r1,0,Math.PI*2,false);
					ctx.fill();
					ctx.closePath();
				}
				ctx.restore();
				if(document.getElementById(ID_OVERLAY).style.display!="none"){
					requestAnimationFrame(draw);
				}
			}
			requestAnimationFrame(draw);
		}
		function  hideLoading () {
			document.getElementById(ID_OVERLAY).style.display="none";
		}
		function checkWordsUpdate() {
			showLoading ();
			http.ajax({
				type: "get",
				url: ip + "/common/getWordsUpdateTime",
				success: function(data) {
					var updateTime = 0;
					try {
						updateTime = Number(localStorage.getItem("updateTime"));
						localStorage.setItem("updateTime", data);
						localStorage.setItem("lastUpdateTime", updateTime);
						if (updateTime < data) {
							getWordListsURL();
						}else{
							hideLoading();
						}
					} catch (e) {
						localStorage.setItem("updateTime", data);
						localStorage.setItem("lastUpdateTime", 0);
						getWordListsURL();
					}
				},
				error: function() {
					hideLoading();
					alert("getWordsUpdateTime error");
				}
			});
		}

		function getWordListsURL() {
			http.ajax({
				type: "get",
				url: ip + "/common/getWordListsURL",
				success: function(data) {
					data = parseJSON(data);
					for (var i in data) {
						if (Number(data[i].updateTime) > Number(localStorage.getItem("lastUpdateTime"))) {
							getWordList(data[i].url);
						}
					}
				},
				error: function() {
					hideLoading();
					alert("getWordListsURL error");
				}
			});
		}

		function getWordList(url) {
			http.ajax({
				type: "get",
				url: ip + "/" + url,
				success: function(data) {
					data=parseJSON(data);
					for (var i in data) {
						db.put("wordslist", [{
							value: data[i]
						}]);
					}
					db.then(function() {
						getBook();
					});

				},
				error: function() {
					hideLoading();
					alert("getWordList error");
				}
			});
		}

		function getMeaning(word, cb) {
			db.query("wordslist", "word", [word]).then(function(data) {
				data = parseJSON(data.result)[0];
				if (data && data.meaning) {
					cb(data.meaning);
				} else {
					showLoading ();
					http.ajax({
						type: "post",
						url: "http://fy.iciba.com/api.php",
						data: {
							"type": "auto",
							"q": word
						},
						success: function(responseData) {
							responseData = parseJSON(responseData);
							var reg = /(<p>[\s]*?<span\s*class=\"dt\">.+<\/p>)/;
							data.meaning = responseData.ret.replace(/\r\n/g, "");
							if (reg.test(data.meaning)) {
								data.meaning = RegExp.$1;
							}
							db.put("wordslist", [{
								value: data
							}]);
							cb(data.meaning);
							hideLoading();
						},
						error: function() {

						}
					});
				}
			});
		}


		function getBook() {
			db.query("wordslist", "name").then(function(data) {
				var names = [];
				data = data.result;
				data.sort(function(a, b) {
					if (a.name > b.name) {
						return 1;
					}
					return -1;
				});
				for (var i = 0; i < data.length; i++) {
					if (!data[i - 1] || data[i - 1].name != data[i].name) {
						names.push(data[i].name);
					}
				}
				showBooks(names, names.length);

			});
		}
		var index = 0;

		var books = [];
		var content = [];

		function parseName(name) {
			return new Date(Number(name)).toLocaleDateString();
		}

		function showBooks(names, count) {
			var pages = Math.floor(names.length / count);
			var start = count * index;
			var end = count * (index + 1) < names.length ? count * (index + 1) : names.length;
			var realCount = end - start;
			var html = [];
			books = [];
			for (var i = 0; i < realCount; i++) {
				html.push('<li data-name="' + names[start + i] + '">');
				html.push(parseName(names[start + i]));
				html.push('</li>');
			}
			document.getElementById(ID_BOOKLIST).innerHTML = html.join("");
			hideLoading();
		}

		function showWords(name) {
			db.query("wordslist", "name").then(function(data) {
				var words = [];
				var html = [];
				data = data.result;
				for (var i = 0; i < data.length; i++) {
					if (data[i].name == name) {
						html.push("<li>");
						html.push(data[i].word);
						html.push("</li>");
					}
				}
				document.getElementById(ID_WORDLIST).innerHTML = html.join("");
				document.getElementById(ID_WORD).innerHTML = "";
				document.getElementById(ID_MEANING).innerHTML = "";
			});
		}

		document.getElementById(ID_BOOKLIST).addEventListener("click", function(e) {
			var id = e.target.id;
			var name = e.target.dataset.name;
			if (name) {
				document.getElementById(ID_BOOKLIST).style.display = "none";
				document.getElementById(ID_CONTENT).style.display = "block";
				showWords(name);
				document.getElementById(ID_BOOKNAME).innerHTML = parseName(name);
			}
		}, false);
		document.getElementById(ID_WORDLIST).addEventListener("click", function(e) {
			var word = e.target.innerHTML;
			if (word != "") {
				getMeaning(word, function(meaning) {
					document.getElementById(ID_WORD).innerHTML = word;
					document.getElementById(ID_MEANING).innerHTML = meaning;

				})
			}
		}, false);
		document.getElementById(ID_BACK).addEventListener("click", function() {
			document.getElementById(ID_BOOKLIST).style.display = "block";
			document.getElementById(ID_CONTENT).style.display = "none";
			document.getElementById(ID_BOOKNAME).innerHTML = "";
		});
		document.getElementById(ID_UPDATE).addEventListener("click", function() {
			checkWordsUpdate();
		});
		getBook();
		initPainter();
	}
	define(["DBM", "http"], factory);
})()
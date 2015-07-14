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
		ip = "http://localhost:3000";

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
			var painter = document.getElementById(ID_PAINTER);
			var pctx = painter.getContext("2d");
			var height = painter.height;
			var width = painter.width;

			function  draw (timestamp) {
				var deg = Math.PI/12;
				ctx.translate(width/2,height/2);

			}
		}
		function  hideLoading () {
			// body...
		}
		function checkWordsUpdate() {
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
						}
					} catch (e) {
						localStorage.setItem("updateTime", data);
						localStorage.setItem("lastUpdateTime", 0);
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
		}

		function showWords(name) {
			db.query("wordslist", "name").then(function(data) {
				var words = [];
				var html = [];
				data = data.result;
				for (var i = 0; i < data.length; i++) {
					if (data[i].name === name) {
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
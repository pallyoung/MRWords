(function app() {
	function factory(View, DBM, http) {
		var db = new DBM("MRWords");
		var ip = "http://192.168.1.111:3000";
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
					data = parseJSON(data);
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
			document.getElementById('booklist').innerHTML = html.join("");
		}

		function showWords(name) {
			db.query("wordslist", "name").then(function(data) {
				var words = [];
				var html=[];
				data = data.result;
				for (var i = 0; i < data.length; i++) {
					if (data[i].name === name) {
						html.push("<li>");
						html.push(data[i].word);
						html.push("</li>");
					}
				}
				document.getElementById('wordlist').innerHTML = html.join("");
			});
		}

		document.getElementById('booklist').addEventListener("click", function(e) {
			var id = e.target.id;
			var name = e.target.dataset.name;
			if (name) {
				document.getElementById('booklist').style.display = "none";
				document.getElementById('content').style.display = "block";
				showWords(name);
				document.getElementById('bookname').innerHTML=parseName(name);
			}
		}, false);
		document.getElementById('wordlist').addEventListener("click", function(e) {
			var word = e.target.innerHTML;
			if (word != "") {
				getMeaning(word, function(meaning) {
					document.getElementById('word').innerHTML = word;
					document.getElementById('meaning').innerHTML = meaning;
				})
			}
		}, false);
		document.getElementById('back').addEventListener("click", function() {
			document.getElementById('booklist').style.display="block";
			document.getElementById('content').style.display="none";
			document.getElementById('bookname').innerHTML="";
		});
		document.getElementById("update").addEventListener("click", function() {
			checkWordsUpdate();
		});
		getBook();
	}
	define(["View", "DBM", "http"], factory);
})()
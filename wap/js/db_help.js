// db_help.js
(function (argument) {
	// body...
	var indexedDB = window.indexedDB || window.msIndexedDB || window.mozIndexedDB || window.webkitIndexedDB;
	var DB_VERSION = 1;
	var DB_NAME = "MRWords";
	var request = indexedDB.open(DB_NAME,DB_VERSION);
	var db;
	function createObjectStore(db,objectStore){
		var store = db.createObjectStore(
			objectStore.name,
			objectStore.optionalKeyPath
		);
		var indexs = objectStore.indexs;
		for (var i = 0; i < indexs.length; i++) {
			store.createIndex(indexs[i].name, indexs[i].keyPath, indexs[i].optional || {
				unique: false
			});
		}
	}
	function createObjectStores(db,objectStores){
		for (var i = 0; i < objectStores.length; i++) {
			createObjectStore(db,objectStores[i]);
		}
	}

	function clear(){
		db.close();	
		indexedDB.deleteDatabase(DB_NAME);
	}
	request.onerror = function(e){

	}
	request.onsuccess = function(e){
		db = e.target.result;
	}
	request.onupgradeneeded = function(e){
		db = e.target.result;
		createObjectStores(
			db,
			[{
				name:"word",
				optionalKeyPath:{
							keyPath: "id",
							autoIncrement: true
						},
				indexs:[{
							name: "word",
							keyPath: "word",
							optional: {
								unique: true
							}
						},{
							name: "list_id",
							keyPath: "list_id",
							optional: {
								unique: false
							}
						}]
			},{
				name:"list",
				optionalKeyPath:{
						keyPath:"id",
						autoIncrement: false
					},
				indexs:[{
						name: "name",
						keyPath: "name",
						optional: {
							unique: false
						}
					},{
						name: "book_id",
						keyPath: "book_id",
						optional: {
							unique: false
						},
					}]
			},{
				name:"book",
				optionalKeyPath:{
						keyPath:"id",
						autoIncrement: false
					},
				indexs:[{
						name: "name",
						keyPath: "name",
						optional: {
							unique: false
						}
					}]
			}
		]);		
	}
	function clearObjectStore(objectStoreName){
		var store = db.transaction(objectStoreName,"readwrite").objectStore(objectStoreName);
		var request = store.clear();
		return new Promise(function(resolve,reject){
			request.onsuccess = function(){
				resolve();
			}
			request.onerror = function(){
				reject();
			}
		});
	}
	function putItem(objectStoreName,item){
		var store = db.transaction(objectStoreName,"readwrite").objectStore(objectStoreName);
		var request = store.put(item);
		return new Promise(function(resolve,reject){
			request.onsuccess = function(){
				resolve();
			}
			request.onerror = function(){
				resolve();
			}
		});
	}
	function removeItem(objectStoreName,item){
		var store = db.transaction(objectStoreName,"readwrite").objectStore(objectStoreName);
		var request = store.delete(item);
		return new Promise(function(resolve,reject){
			request.onsuccess = function(){
				resolve();
			}
			request.onerror = function(){
				resolve();
			}
		});
	}
	function factory(){
		return {
			getList:function(){
				return new Promise(function(resolve,reject){
					var store = db.transaction("list").objectStore("list");
					var data = [];
					store.openCursor().onsuccess = function(e) {
						var cursor = e.target.result;
						if (cursor) {
							data.push(cursor.value);
							cursor.continue();
						}else{
							resolve(data);
						}
					};
				});
			},
			getListByBook:function(bookId){
				return new Promise(function(resolve,reject){
					var store = db.transaction("list").objectStore("list");
					var range = IDBKeyRange.only(bookId);
					var data = [];
					store = store.index(book_id);
					store.openCursor(range).onsuccess = function(e) {
						var cursor = e.target.result;
						if (cursor) {
							data.push(cursor.value);
							cursor.continue();
						}else{
							resolve(data);
						}
					};
					

				});
			},
			getBookList:function(){
				return new Promise(function(resolve,reject){
					var store = db.transaction("book").objectStore("book");
					var data = [];
					store.openCursor().onsuccess = function(e) {
							var cursor = e.target.result;
							if (cursor) {
								data.push(cursor.value);
								cursor.continue();
							}else{
								resolve(data);
							}
						};
					
				});				
			},
			getWordByList:function(listId){
				return new Promise(function(resolve,reject){
					var store = db.transaction("word").objectStore("word");
					var range = IDBKeyRange.only(listId);
					var data = [];
					store = store.index("list_id");
					store.openCursor(range).onsuccess = function(e) {
						var cursor = e.target.result;
						if (cursor) {
							data.push(cursor.value);
							cursor.continue();
						}else{
							resolve(data);
						}
					};
					

				});
			},
			clearBook:function(){
				return clearObjectStore("book");
			},
			clearList:function(){
				return clearObjectStore("list");
			},
			clearWord:function(){
				return clearObjectStore("word");

			},
			removeBook:function(book){
				return removeItem("book",book);
			},
			removeList:function(list){
				return removeItem("list",list);
			},
			removeWord:function(word){
				return removeItem("word",word);
			},
			putBook:function(book){
				return putItem("book",book);
			},
			putList:function(list){
				return putItem("list",list);
			},
			putWord:function(word){
				return putItem("word",word);
			},
			clear:clear
		}
	}
	define(factory);
})()
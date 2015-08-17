(function(window, document, undefined) {
	var VERSION = "1.0";
	var uid = (function() {
		var id = 0;
		return function() {
			return ++id;
		}
	})();
	var Views = {};

	function View() {
		this.id ="view"+ uid();
		this.model = null;
		this.data = {};
		this.tags={};
		//Views[this.id] = this;
	}

	View.prototype = {
		constructor: View,
		css:function(cssText){
			if(typeof cssText==="string"){
				document.querySelector("#"+this.id).style.cssText=cssText;
			}else{
				return document.querySelector("#"+this.id).style.cssText;
			}

		},
		bind:function(model){
			this.data=model;
		},
		style:function(type,value){
			if(arguments.length==2){
				document.querySelector("#"+this.id).style[type]=value;
			}else{
				return document.querySelector("#"+this.id).style[type];
			}
		},
		on:function(type,handler){
			document.querySelector("#"+this.id).addEventListener(type,handler,false);
		},
		remove:function(type,handler){
			document.querySelector("#"+this.id).removeEventListener(type,handler,false);
		},
		setTag:function(tag,value){
			this.tags[tag]=value;
		},
		getTag:function(tag){
			return this.tags[tag];
		},
		render: function() {
			throw new Error("unimplemented");
		}
	}

	function GridView() {
		View.call(this);
	}
	GridView.prototype = new View();
	GridView.prototype.render=function(model){
		var html=[];
		html.push("<div class='gridview' id='"+this.id+"'>");
		html.push("</div>");
		if(document.querySelector("#"+this.id)){
			document.querySelector("#"+this.id).outterHTML=html.join("");
		}
		return html.join("");	
	}
	GridView.prototype.setAdapter=function(adapter){
		var view=document.querySelector("#"+this.id);
		var html=[];
		for(var i=0;i<adapter.length;i++){
			html.push(adapter[i].render(adapter[i].data));
		}
		view.innerHTML=html.join("");
	}


	function WordView() {
		View.call(this);
	}

	WordView.prototype = new View();
	WordView.prototype.render=function(model){
		var html=[];
		html.push("<wordview class='word' id='"+this.id+"'>");
		html.push(model.word);
		html.push("</wordview>");
		if(document.querySelector("#"+this.id)){
			document.querySelector("#"+this.id).outerHTML=html.join("");
		}
		return html.join("");
	}

	function ButtonView(){
		View.call(this);
	}	
	ButtonView.prototype = new View();
	ButtonView.prototype.render=function(model){
		var html=[];
		html.push("<p class='button' id='"+this.id+"'>");
		html.push(model.value);
		html.push("</p>");
		if(document.querySelector("#"+this.id)){
			document.querySelector("#"+this.id).outterHTML=html.join("");
		}
		return html.join("");
	}
	View.GridView = GridView;

	View.WordView = WordView;
	View.ButtonView = ButtonView;
	if(typeof define =="function" && define.amd){
		define(function(){
			return View;
		});
	}else{
		window.View=View;
	}

})(window, document)
/*
 *封装ajax请求
 */
define(function() {
	var accepts= {
		"*": "",
		text: "text/plain",
		html: "text/html",
		xml: "application/xml, text/xml",
		json: "application/json, text/javascript"
	}
	function FormData(data){
		if (false) {
			FormData = window.FormData;
		} else {
			FormData = function() {
				this.data = [];
			};
			FormData.prototype.append = function(key, value) {
				this.data.push(encodeURI(key) + "=" + encodeURI(value));
			}
			FormData.prototype.stringify = function() {
				return this.data.join("&");
			}
		}
		return new FormData();
	}
	function serializeData(data){
		if(typeof data==='string'||data===null){
			return data;
		}else{
			var form=new FormData();
			for (var o in data){
				if(data.hasOwnProperty(o)){
					form.append(o,data[o]);
				}
			}
			return form.stringify&&form.stringify()||form;
		}
	}
	function ajax(source) {
		source = source || {
			url: "",
			type: "get",
			async: true,
			contentType: "application/x-www-form-urlencoded; charset=UTF-8",
			data:null,
			dataType:"*",
			timeout:6000,
			success: function() {},
			error: function() {}
		}
		source.type=source.type||"get";
		source.async=source.async||"true";
		source.data=source.data||null;
		source.timeout=source.timeout||6000;
		source.contentType=source.contentType||"application/x-www-form-urlencoded; charset=UTF-8";
		source.success=source.success||function() {};
		source.error=source.error||function() {};
		var xhr = new XMLHttpRequest();
		xhr.onreadystatechange = function() {			
			if (xhr.readyState == 4) {
				clearTimeout(source.ontimeout);
				xhr.onreadystatechange=null;
				if ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304) {
					source.success(xhr.response);
				} else {
					source.error(xhr.status);
				}
			}
		};
		if(source.type==="get"){
			source.url+="?"+serializeData(source.data);
			source.data=null;
		}
		xhr.open(source.type, source.url, source.async);
		xhr.setRequestHeader("Content-Type", source.contentType);
		source.dataType&&xhr.overrideMimeType(source.dataType);
		xhr.send(serializeData(source.data));
		source.ontimeout=setTimeout(function(){
			source.error("timeout")
		},source.timeout);
	}
	var	_export = {
		ajax: ajax,
		timeout: 6000
	};
	return _export;
});
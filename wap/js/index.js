// index.js
// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
(function(){
	function factory(ionic){
		var mrwords = angular.module('mrwords', ['ionic']);
		return mrwords;
	}
	define(["ionic"],factory);
})();
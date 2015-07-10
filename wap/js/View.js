(function(window, document, undefined) {
	var VERSION = "1.0";
	var uid = (function() {
		var id = 0;
		return function() {
			return ++id;
		}
	})();
	var EvenetHandle = function(handle, target) {
		this.handle = handle;
	}
	var EventListener = Modules.EventListener = function(dom) {
		var eventTypes = this.eventTypes;
		this._timestamp = 0;
		this._ticks = 0;
		this._point = null;
		this._moving = false;
		this._dir = null;
		this._mousedown = false;
		for (var i = 0, l = eventTypes.length; i < l; i++) {
			this[eventTypes[i] + "Handles"] = [];
		}
		EventListener.init(dom, this);
	}
	EventListener.checkArgumentsLength = function() {
		var length = arguments.length - 1;
		if (length !== arguments[length]) {
			throw new Error("方法期望得到" + arguments[length] + "个参数，但是实际参数个数为" + length + "个");
		}
	};
	EventListener.hasTouch = document.hasOwnProperty("ontouchstart") ? true : false;
	EventListener.eventTypes = ["tapstart", "tapend", "tap", "longtap", "dbltap", "move", "hormove", "vermove"];
	EventListener.events = EventListener.hasTouch ? {
		touchstart: "touchstart",
		touchend： "touchend",
		touchmove： "touchmove",
		touchcancel: "touchcancel"
	} : {
		touchstart: "mousedown",
		touchend： "mouseup",
		touchmove： "mousemove",
		touchcancel: "mouseout"
	}
	EventListener.prototype = {
		on: function(type, handle) {
			var eventTypes = EventListener.eventTypes;
			arguments[arguments.length] = 2;
			EventListener.checkArgumentsLength.apply(EventListener, arguments);
			if (this[type + "Handles"]) {
				this[type + "Handles"].push(new EvenetHandle(handle));
				return true;
			}
			return false;

		},
		remove: function(type, handle) {
			var eventHandles = [];
			if (this[type + "Handles"]) {
				eventHandles = this[type + "Handles"];
				for (var i = 0, l = eventHandles.length; i < l; i++) {
					if (handle === eventHandles[i].handle) {
						eventHandles.splice(i, 1);
						return true;
					}
				}
			}
			return false;
		}

	}
	EventListener.getTouchTarget = function(e) {
		return EventListener.hasTouch ? (e.targetTouches[0] || e.changeTouches[0]) : e;
	}
	EventListener.init = function(dom, context) {
		dom.addEventListener(EventListener.events.touchstart, function(e) {
			EventListener.mouseDownListener(e, context);
		}, false);
		dom.addEventListener(EventListener.events.touchend, function(e) {
			EventListener.mouseUpListener(e, context);
		}, false);
		dom.addEventListener(EventListener.events.touchmove, function(e) {
			EventListener.mouseMoveListener(e, context);
		}, false);
		dom.addEventListener(EventListener.events.touchcancel, function(e) {
			EventListener.mouseOutListener(e, context);
		}, false);
	}
	EventListener.emit = function(context, type, event) {
		var eventHandles = [];
		var MyEvent = function(type) {
			this.eventType = type;
		};
		MyEvent.prototype = event;
		var e = new MyEvent(type);
		if (context[type + "Handles"]) {
			eventHandles = context[type + "Handles"];
			for (var i = 0, l = eventHandles.length; i < l; i++) {
				eventHandles[i]["handle"].call(context, e);
			}
		}
	}
	EventListener.mouseDownListener = function(e, context) {
		var point = null;
		EventListener.emit(context, "tapstart", e);
		context._timestamp = Date.now();
		context._moving = false;
		context._dir = null;
		context._mousedown = true;
		point = (EventListener.hasTouch && e.changeTouches[0]) || e;
		context._point = [e.clientX, e.clientY];

	}
	EventListener.mouseUpListener = function(e, context) {
		var timestamp = Date.now();
		EventListener.emit(context, "tapend", e);
		if (context.timestamp !== 0 && timestamp - context.timestamp > 500) {
			EventListener.emit(context, "longtap", e);
			context._ticks = 0;
			context._timestamp = 0;
		} else {
			EventListener.emit(context, "tap", e);
			if (context._ticks == 0) {
				context._ticks = 1;
				context._timestamp = 0;
			} else if (context._ticks == 1) {
				context._ticks = 0;
				context._timestamp = 0;
				EventListener.emit(context, "dbltap", e);
			}
		}
		context._moving = false;
		context._dir = null;
		context._moving = false;
		context._mousedown = false;

	}
	EventListener.mouseMoveListener = function(e, context) {
		var point = null;
		if (!context._mousedown) {
			return;
		}
		EventListener.emit(context, "move", e);
		if (!context._moving) {
			context._timestamp = Date.now();
			context._dir = null;
			context._moving = true;
		}
		if (Date.now() - context._timestamp > 100 && context._dir === null) {
			point = (EventListener.hasTouch && e.changeTouches[0]) || e;
			if (Math.abs(point.clientX - context._point[0]) > Math.abs(point.clientY - context._point[1])) {
				context._dir = "x";
			} else {
				context._dir = "y";
			}
		} else {
			EventListener.emit(context, "move" + context._dir, e);
		}

	}
	EventListener.mouseOutListener = function(e, context) {
		EventListener.emit(context, "tapend", e);
		context._ticks = 0;
		context._timestamp = 0;
		context._dir = null;
		context._moving = false;
		context._mousedown = false;
	}

	function View() {
		this.id = uid();
	}

	View.prototype={
		constructor:View,
		on : function(type, handler) {

		},
		remove : function(type, handler) {

		}
	}

})(window, document)
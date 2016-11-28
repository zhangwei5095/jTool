var utilities = require('./utilities');

var _Event = {

	on: function(event, querySelector, callback, useCapture) {
		// 将事件触发执行的函数存储于DOM上, 在清除事件时使用
		return this.addEvent(this.getEventObject(event, querySelector, callback, useCapture));
	},

	off: function(event, querySelector) {
		return this.removeEvent(this.getEventObject(event, querySelector));
	},

	bind: function(event, callback, useCapture) {
		return this.on(event, callback, useCapture);
	},

	unbind: function(event) {
		return this.removeEvent(this.getEventObject(event));
	},

	trigger: function(event) {
		utilities.each(this.DOMList, function(e, element){
			try {
				// TODO 潜在风险 window 不支持这样调用事件
				element['jToolEvent'][event]();
			} catch(err) {
				utilities.error(err);
			}
		});

		return this;
	},

	// 获取 jTool Event 对象
	getEventObject: function(event, querySelector, callback, useCapture) {
		// $(dom).on(event, callback);
		if (typeof querySelector === 'function') {
			callback = querySelector;
			useCapture = callback || false;
			querySelector = undefined;
		}
		// event callback 为必要参数
		if (!event) {
			utilities.error('事件绑定失败,原因: 参数中缺失事件类型');
			return this;
		}

		if (!querySelector) {
			querySelector = '';
		}

		// 存在子选择器 -> 包装回调函数
		if (querySelector !== '') {
			var fn = callback;
			callback = function(e) {
				// 验证子选择器所匹配的 nodeList 中是否包含当前事件源
				if ([].indexOf.call(this.querySelectorAll(querySelector), e.target) !== -1) {
					fn.apply(e.target, arguments);
				}
			};
		}
		var eventSplit = event.split(' ');
		var eventList = [],
			eventScopeSplit,
			eventObj;

		utilities.each(eventSplit, function(i, eventName) {
			if (eventName.trim() === '') {
				return true;
			}

			eventScopeSplit = eventName.split('.');
			eventObj = {
				eventName: eventName + querySelector,
				type: eventScopeSplit[0],
				querySelector: querySelector,
				callback: callback || utilities.noop,
				useCapture: useCapture || false,
				// TODO: nameScope暂时不用
				nameScope: eventScopeSplit[1] || undefined
			};
			eventList.push(eventObj);
		});

		return eventList;
	},

	// 增加事件,并将事件对象存储至DOM节点
	addEvent: function(eventList) {
		var _this = this;
		utilities.each(eventList, function (index, eventObj) {
			utilities.each(_this.DOMList, function(i, v){
				v.jToolEvent = v.jToolEvent || {};
				v.jToolEvent[eventObj.eventName] = v.jToolEvent[eventObj.eventName] || [];
				v.jToolEvent[eventObj.eventName].push(eventObj);
			});
		});
		return _this;
	},

	// 删除事件,并将事件对象移除出DOM节点
	removeEvent: function(eventList) {
		var _this = this;
		var eventFnList; //事件执行函数队列
		utilities.each(eventList, function(index, eventObj) {
			utilities.each(_this.DOMList, function(i, v){
				if (!v.jToolEvent) {
					return;
				}
				eventFnList = v.jToolEvent[eventObj.eventName];
				if (eventFnList) {
					utilities.each(eventFnList, function(i2, v2) {
						v.removeEventListener(v2.type, v2.callback);
					});
					v.jToolEvent[eventObj.eventName] = undefined;
				}
			});
		});
		return _this;
	}
};

module.exports = _Event;

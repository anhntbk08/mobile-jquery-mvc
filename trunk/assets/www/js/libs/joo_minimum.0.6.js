(function(){
  var initializing = false, fnTest = /xyz/.test(function(){xyz;}) ? /\b_super\b/ : /.*/;

  /**
   * This class is abstracted and should not be used by developers
   * @class Base class for all JOO objects.
   */
  this.Class = function(){};
 
  /**
   * Extends the current class with new methods & fields
   * @param {Object} prop additional methods & fields to be included in new class
   * @static
   * @returns {Class} new class
   */
  Class.extend = function(prop) {
	if (typeof updateTracker != 'undefined')
		updateTracker(1);
    var _super = this.prototype;
   
    // Instantiate a base class (but only create the instance,
    // don't run the init constructor)
    initializing = true;
    var prototype = new this();
    initializing = false;
    prototype.currentClass = this;
    prototype.ancestors = Array();
    if (this.prototype.ancestors) {
    	for(var i in this.prototype.ancestors) {
    		prototype.ancestors.push(this.prototype.ancestors[i]);
    	}
    }
    prototype.ancestors.push(this);
    // Copy the properties over onto the new prototype
    for (var name in prop) {
      // Check if we're overwriting an existing function
      prototype[name] = typeof prop[name] == "function" &&
        typeof _super[name] == "function" && fnTest.test(prop[name]) ?
        (function(name, fn){
          return function() {
            var tmp = this._super;
           
            // Add a new ._super() method that is the same method
            // but on the super-class
            this._super = _super[name];
           
            // The method only need to be bound temporarily, so we
            // remove it when we're done executing
            var ret = fn.apply(this, arguments);       
            this._super = tmp;
           
            return ret;
          };
        })(name, prop[name]) :
        prop[name];
    }
  
    /**
     * Implements the current class with a set of interfaces
     * @param {InterfaceImplementor...} interfaces a set of interfaces to be implemented
     * @static
     * @returns {Class} current class
     */
    Class.implement = function() {
    	for(var i=0;i<arguments.length;i++) {
			var impl = new arguments[i]();
			impl.implement(Class);
    	}
    	return Class;
    };
   
    function Class() {
      // All construction is actually done in the init method
      if ( !initializing && this.init ) {
        this.init.apply(this, arguments);
        if (typeof updateTracker != 'undefined')
    		updateTracker(this.tracker || 5, true);
      }
    }
   
    // Populate our constructed prototype object
    Class.prototype = prototype;
   
    // Enforce the constructor to be what we expect
    Class.constructor = Class;

    // And make this class extendable
    Class.extend = arguments.callee;
   
    return Class;
  };
})();



/**
 * @class Base class of all "interfaces"
 */
InterfaceImplementor = Class.extend(
/** @lends InterfaceImplementor# */	
{
	init: function(){
		
	},

	/**
	 * Implement a class. Subclass should modify the <code>prototype</code>
	 * of the class to add new features. See source code of subclass for 
	 * more details
	 * @param {Class} obj the class to be implemented
	 */
	implement: function(obj)	{
		
	}
});


/**
 * @class Access object in a singleton way
 */
SingletonFactory = function(){};

/**
 * Get singleton instance of a class.
 * @methodOf SingletonFactory
 * @param {String} classname the className
 * @returns the instance
 */
SingletonFactory.getInstance = function(classname){
	if(classname.instance == undefined){
		classname.singleton = 0;
		classname.instance = new classname();
		classname.singleton = undefined;
	}
	return classname.instance;
};


/*
 * 
 */
EventDispatcher = Class.extend(
/**
 * @lends EventDispatcher#
 */	
{

	/**
	 * Create a new EventDispatcher.
	 * @class Base class for all event dispatchers (such as DisplayObject)
	 * @constructs
	 * @augments Class
	 */
	init: function() {
		this.listeners = {};
	},
	
	/**
	 * Add a new listener for a specific event.
	 * @param {String} event the event to be handled. 
	 * @param {Function} handler the event handler. If you want to remove it
	 * at a later time, it must not be an anonymous function
	 */
	addEventListener: function(event, handler) {
		if (this.listeners[event] == undefined) {
			this.listeners[event] = Array();
		}
		this.listeners[event].push(handler);
	},
	
	/**
	 * Dispatch a event.
	 * @param {String} event the event to be dispatched.
	 */
	dispatchEvent: function(event) {
		if (!this.disabled && this.listeners && this.listeners[event] != undefined) {
			var handlers = this.listeners[event];
			var args = Array();
			for(var i=1; i<arguments.length; i++) {
				args.push(arguments[i]);
			}
			for(var i=0;i<handlers.length;i++) {
				var result = handlers[i].apply(this, args);
				if (result === false)
					return;
			}
		}
	},
	
	/**
	 * Remove a handler for a specific event.
	 * @param {String} event the event of handler to be removed 
	 * @param {Function} handler the handler to be removed
	 */
	removeEventListener: function(event, handler) {
		if (this.listeners && this.listeners[event] != undefined) {
			var index = this.listeners[event].indexOf(handler);
			if (index != -1)
				this.listeners[event].splice(index, 1);
		}
	},
	
	disable: function(disabled) {
		this.disabled = disabled;
	},
	
	toString: function() {
		return "EventDispatcher";
	},
	
	setupBase: function(config) {
		
	}
});

/**
 * @class Used for formalizing the observer design pattern,
 * especially in an event-based application
 * @interface
 */
ObserverInterface = InterfaceImplementor.extend({
	
	implement: function(obj)	{
		/**
		 * Called when the observer is notified of an event by the {@link Subject}.
		 * The default implementation forward the request
		 * @methodOf ObserverInterface#
		 * @name notify 
		 * @param {String} eventName the event name
		 * @param {Object} eventData the event data
		 * @returns {Boolean} whether the event is interested by this observer or not.
		 */
		obj.prototype.notify = obj.prototype.notify || function(eventName, eventData)	{
			var methodName = "on"+eventName;
			//console.log('methodName ',methodName,' obj ',obj);
			if (typeof this[methodName] != 'undefined')	{
				var method = this[methodName];
				method.call(this, eventData);
				return true;
			}
			return false;
		};
		
		/**
		 * Register this observer with the {@link Subject}.
		 * @methodOf ObserverInterface#
		 * @name registerObserver
		 */
		obj.prototype.registerObserver = obj.prototype.registerObserver || function()	{
			var subject = SingletonFactory.getInstance(Subject);
			subject.attachObserver(this);
		};
		
		/**
		 * Unregister this observer with the {@link Subject}.
		 * @methodOf ObserverInterface#
		 * @name unregisterObserver
		 */
		obj.prototype.unregisterObserver = obj.prototype.unregisterObserver || function()	{
			var subject = SingletonFactory.getInstance(Subject);
			subject.detachObserver(this);
		};
	}
});

Subject = Class.extend(
/** @lends Subject# */	
{
	
	/**
	 * Initialize observers
	 * @class <code>Subject</code> is the central of Observer pattern. It maintains a list
	 * of observers, and notifies them automatically of new events. <code>Subject</code> is
	 * a <code>singleton</code> class.
	 * @augments Class
	 * @constructs
	 */
	init: function()	{
		this.observers = Array();
	},
	
	/**
	 * Attach an observer
	 * @param {ObserverInterface} observer the observer to be attached
	 */
	attachObserver: function(observer)	{
		this.observers.push(observer);
	},
	
	/**
	 * Detach an observer
	 * @param {ObserverInterface} observer the observer to be detached
	 */
	detachObserver: function(observer)	{
		if (observer == undefined)
			return;
		var index = this.observers.indexOf(observer);
		if (index > 0)	{
			this.observers.splice(index, 1);
		}
	},
	
	/**
	 * Notify an event to all observers
	 * @param {String} eventName the name of the event which should contains characters only
	 * @param {Object} eventData the data associated with the event
	 */
	notifyEvent: function(eventName, eventData)	{
		var count = 0;
		for(var i=0;i<this.observers.length;i++){
			try {
				
				if (this.observers[i].className.indexOf(eventData.sourceDispatcher.className) || 
					( eventData.sourceDispatcher.className.indexOf('Controller') && this.observers[i].className.indexOf('Controller') ) ){
					var result = this.observers[i].notify(eventName, eventData);
					if (result == true)	{
						count++;
					}	
				}
			} catch (err)	{
				log(err);
			}
		}
	},
	
	toString: function() {
		return "Subject";
	}
});

 /*
  * Generate Events
  */
JOOUtils = {
	generateEvent: function(eventName, eventData) {
	    var subject = SingletonFactory.getInstance(Subject);
	    subject.notifyEvent(eventName, eventData);
	}
}

AjaxInterface = InterfaceImplementor.extend({
	
	implement: function(obj)	{
		obj.prototype.onAjax = obj.prototype.onAjax || function(url, params, type, callbacks, cache, cacheTime)	{
			if (type == undefined)
				type = 'GET';
			var success = callbacks.onSuccess;
			var fail = callbacks.onFailure;
			var accessDenied = callbacks.onAccessDenied;
			
			var memcacheKey = 'ajax.'+url;
			for(var k in params)	{
				var v = params[k];
				memcacheKey += '.'+k+'.'+v;
			}

			//var root = SingletonFactory.getInstance(Application).getSystemProperties().get('host.root');
			//var url = root+'/'+controller+'/'+action;
			//try to get from mem cached
			if (type == 'GET' && cache == true)	{
				var memcache = SingletonFactory.getInstance(Memcached);
				var value = memcache.retrieve(memcacheKey);
				if (value != undefined)	{
					var now = new Date();
					var cacheTimestamp = value.timestamp;
					if ((now.getTime() - cacheTimestamp) < cacheTime)	{
						var subject = SingletonFactory.getInstance(Subject);
						subject.notifyEvent('AjaxQueryFetched', {result: value.ret, url: url});
						AjaxHandler.handleResponse(value.ret, success, fail, url);
						return;
					} else {
						memcache.clear(memcacheKey);
					}
				}
			}
			
			var subject = SingletonFactory.getInstance(Subject);
			subject.notifyEvent('AjaxBegan');
			$.ajax({
				dataType: 'json',
				url: url,
				type: type,
				data: params,
				success: function(ret)	{
					subject.notifyEvent('AjaxFinished');
					if (ret != null)	{
						if (type == 'GET' && cache == true)	{
							//cache the result
							var memcache = SingletonFactory.getInstance(Memcached);
							var now = new Date();
							memcache.store(memcacheKey, {'ret': ret, 'timestamp': now.getTime()});
						}
						subject.notifyEvent('AjaxQueryFetched', {result: ret, url: url});
						AjaxHandler.handleResponse(ret, success, fail, url);
					}
				},
				error: function(ret, statusText, errorCode)	{
					subject.notifyEvent('AjaxError', {ret: ret, statusText: statusText, errorCode: errorCode});
					subject.notifyEvent('AjaxFinished');
				},
				statusCode: {
					403: function()	{
						//console.log('access denied at '+url);
						if (accessDenied != undefined)
							accessDenied.call(undefined);
					}
				},
				xhrFields: {
					withCredentials: true
			    },
			});
		};
	}
});

AjaxHandler = {
		
	handleResponse: function(ret, success, fail, url)	{
		var result = ret.result;
		if (result.status)	{
			if (success != undefined)	{
				try {
					success.call(undefined, result.data);
				} catch (err)	{
					log(err+" - "+url);
				}
			}
		} else if (result == 'internal-error') {
			var subject = SingletonFactory.getInstance(Subject);
			subject.notifyEvent('NotifyError', ret.message);
		} else {
			if (fail != undefined)	{
				try {
					fail.call(undefined, ret.message, ret.detail);
				} catch (err)	{
					log(err);
				}
			}
		}
	}
};
 
 /*
  * JOOService 
  */
 Service = EventDispatcher.extend({
	
	init: function(endpoint, method) {
		this._super();
		this.name = "DefaultService";
		this.endpoint = endpoint || "";
		this.method = method || "get";
	},
	
	run: function(params) {
		var _self = this;
		this.onAjax(this.endpoint, params, this.method, {
			onSuccess: function(ret) {
				ret = _self.parse(ret);
				_self.dispatchEvent('success', ret);
				//JOOUtils.generateEvent('ServiceSuccess', this.name, ret);
			},
			onFailure: function(msg) {
				msg = _self.parseError(msg);
				_self.dispatchEvent('failure', msg);
				//JOOUtils.generateEvent('ServiceFailure', this.name, msg);
			}
		});
	},
	
	parse: function(ret) {
		return ret;
	},
	
	parseError: function(msg) {
		return msg;
	},
	
	getEndPoint: function() {
		return this.endpoint;
	}
}).implement(AjaxInterface);

function log(msg, omitStackTrace)	{
	if (window["console"] != undefined)	{
		console.error(msg);
		if (!omitStackTrace) {
			printStackTrace(msg);
		}
	}
}

function printStackTrace(e) {
	var callstack = [];
	var isCallstackPopulated = false;

	console.log('Stack trace: ');
	if (e.stack) { //Firefox
		var lines = e.stack.split('\n');
	    for (var i=0, len=lines.length; i<len; i++) {
//	    	if (lines[i].match(/^\s*[A-Za-z0-9\-_\$]+\(/)) {
//	    		callstack.push(lines[i]);
//	    	} else {
//	    		var index = lines[i].indexOf(')');
//	    		if (index != -1)
//	    			lines[i] = lines[i].substr(index);
	    		callstack.push(lines[i]);
//	    	}
	    }
	    //Remove call to printStackTrace()
	    callstack.shift();
	    isCallstackPopulated = true;
	} else if (window.opera && e.message) { //Opera
		var lines = e.message.split('\n');
		for (var i=0, len=lines.length; i<len; i++) {
			if (lines[i].match(/^\s*[A-Za-z0-9\-_\$]+\(/)) {
				var entry = lines[i];
				//Append next line also since it has the file info
				if (lines[i+1]) {
		            entry += ' at ' + lines[i+1];
		            i++;
				}
				callstack.push(entry);
	        }
		}
	    //Remove call to printStackTrace()
	    callstack.shift();
	    isCallstackPopulated = true;
	}
	if (!isCallstackPopulated) { //IE and Safari
		var currentFunction = arguments.callee.caller;
		while (currentFunction && callstack.length <= 100) {
			isCallstackPopulated = true;
			var fn = currentFunction.toString();
		    var fname = fn.substring(fn.indexOf('function') + 8, fn.indexOf('{')) || 'anonymous';
		    callstack.push(fname);
		    currentFunction = currentFunction.caller;
		}
	}
	for(var i=0; i<callstack.length; i++) {
		console.log(callstack[i]);
	}
}
LoginPageController = Class.extend({
	init : function(){
		this.registerObserver();
	},
	run : function(){
		
	},
	onLoginRun : function(){
		console.log('it fucking run');
		JOOUtils.generateEvent('LoginRuned', {sourceDispatcher : this});
	}
}).implement(ObserverInterface);

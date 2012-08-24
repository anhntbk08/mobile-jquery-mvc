LoginPage = BasePage.extend({
	init : function(){
		this.registerObserver();
		this.run();
	},
	run : function(){
		console.log('Login run generate event');
		JOOUtils.generateEvent('LoginRun', {sourceDispatcher : this});
	}
}).implement(ObserverInterface);

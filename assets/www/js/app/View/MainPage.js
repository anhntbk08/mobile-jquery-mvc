MainPage = BasePage.extend({
	init : function(){
		this.registerObserver();
		this.run();
	},
	run : function(){
		
		//JOOUtils.generateEvent('LoginRun');
	},
	onLoginRuned : function(){
		
	}
	
	
}).implement(ObserverInterface);

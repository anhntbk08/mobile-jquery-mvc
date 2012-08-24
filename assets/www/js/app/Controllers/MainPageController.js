MainPageController = Class.extend({
	init : function(){
		this.registerObserver();
		this.run();
	},
	run : function(){
		
	},
	onLoginRuned : function(){
		console.log('it fucking runed');
		
	}
}).implement(ObserverInterface);

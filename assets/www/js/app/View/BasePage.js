BasePage = EventDispatcher.extend({
	init : function(config){
		this.name = config.name || '';
		var access = $('#'+this.name);
		
		if (access.length == 0){
			console.error('cannot create page with no dom object belong');
			return;
		} 
	},
	changePageContent : function(){
		
	}
});

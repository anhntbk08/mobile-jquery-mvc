LoginService = Service.extend({
	init: function() {
		this._super();
		this.method = "post";
		this.endpoint = "";
	},
	
	run: function(params) {
		this._super(params);
	},
	
	parse: function(ret) {
		return ret;
	}
});

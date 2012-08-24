$(document).ready(function(){

	App.registerControllers();
	App.registerViews();
});

App = {
	registerControllers : function(){
		var loginPageController = new LoginPageController();
		var loginPageController = new MainPageController();
	},
	registerViews : function(){
		var loginPage = new LoginPage();	
		var mainPage = new MainPage();
	}
}

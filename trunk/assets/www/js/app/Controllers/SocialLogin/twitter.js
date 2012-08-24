
function TweetApp () {
	 _self = this;
	 
	 this.init = function(){
        _self.twitterOptions = {
            consumerKey: 'RVV0hHfg1rGYEPWFJgaXLg',
            consumerSecret: 'zsH9vE4QjVWBToYK3DKforjpxeiMO2OrH3VlQTrsU',
            callbackUrl: 'http://joolist.com/demo/VentiTag/Code/service/public/index.php'
        };
        
        _self.oauth = OAuth(_self.twitterOptions);
        _self.requestParams;
		_self.storedAccessData, _self.rawData = localStorage.getItem("twitterKey");
        
        // init childbroser , 
        var cb = ChildBrowser.install();
        
    }; 
	
	this.loginWithRegister = function(){
		if (localStorage.getItem("twitterKey") !== null) {
			console.log("already login ");
			// If we already have them
			_self.storedAccessData = JSON.parse(localStorage.getItem("twitterKey")); // Parse our JSON object
			_self.twitterOptions.accessTokenKey = _self.storedAccessData.accessTokenKey; // This is saved when they first sign in
			_self.twitterOptions.accessTokenSecret = _self.storedAccessData.accessTokenSecret; // this is saved when they first sign in
			_self.oauth = OAuth(_self.twitterOptions);
			_self.oauth.get('https://api.twitter.com/1/account/verify_credentials.json?skip_status=true', function(data){
				var entry = JSON.parse(data.text);
				appUser.loginedTwitter = true;
				appUtility.showLoadingScreen();
				localStorage.setItem("twitterName" ,entry.screen_name);
				appUser.loginOpenIdEvent(entry.screen_name, "twitter");		
				
			});
		}
		else {
				
		        _self.oauth.get('https://api.twitter.com/oauth/request_token', function(data){
		            
		            _self.requestParams = data.text;
					
		            // get _self.oauth_accesToken
		            window.plugins.childBrowser.showWebPage('https://twitter.com/oauth/authenticate?' + data.text, {
		                showLocationBar: false
		            });
		            
		            // catch Location change on browser
		            window.plugins.childBrowser.onLocationChange = function(loc){
		                console.log(" loc1 = " + loc);						
						
		                if (loc.indexOf(_self.twitterOptions.callbackUrl) >= 0) {
		                    console.log(" loc = " + loc);
							var verifier = loc.match(/oauth_verifier=(.*)$/)[1];
					
		                    _self.oauth.get("https://api.twitter.com/oauth/access_token?oauth_verifier=" + verifier + "&" + _self.requestParams, function(data){
									var accessParams = {};
									var qvars_tmp = data.text.split('&');
									var accessData = {};
									
									for (var i = 0; i < qvars_tmp.length; i++) {
										var y = qvars_tmp[i].split('=');
										accessParams[y[0]] = decodeURIComponent(y[1]);
									}
									_self.oauth.setAccessToken([accessParams.oauth_token, accessParams.oauth_token_secret]);
									
									accessData.accessTokenKey = accessParams.oauth_token;
									accessData.accessTokenSecret = accessParams.oauth_token_secret;
									localStorage.setItem("twitterKey", JSON.stringify(accessData));
									window.plugins.childBrowser.close();							
									
									_self.getTwitterInfo(function(name){
										localStorage.setItem("twitterName", name);
										appUser.loginOpenIdEvent(name, "twitter");
									});
									
		                    }, function(data){
		                       
		                    });
						}
		                    
		             }
						
		            
		            
		        }, function(data){
		        	
		        });
		}
		
        
    }; 
	
	this.loginWithoutRegister = function(callback){
		if (localStorage.getItem("twitterKey") !== null) {
		
			// If we already have them
			_self.storedAccessData = JSON.parse(localStorage.getItem("twitterKey")); // Parse our JSON object
			_self.twitterOptions.accessTokenKey = _self.storedAccessData.accessTokenKey; // This is saved when they first sign in
			_self.twitterOptions.accessTokenSecret = _self.storedAccessData.accessTokenSecret; // this is saved when they first sign in
			_self.oauth = OAuth(_self.twitterOptions);
			_self.oauth.get('https://api.twitter.com/1/account/verify_credentials.json?skip_status=true', function(data){
				var entry = JSON.parse(data.text);
				_self.getTwitterInfo(function(name){
					if (callback)
						callback(name);	
				});
				//appUtility.hideLoadingScreen();
				
			});
		}
		else {
				
		        _self.oauth.get('https://api.twitter.com/oauth/request_token', function(data){
		            		            
		            _self.requestParams = data.text;
		            window.plugins.childBrowser.showWebPage('https://api.twitter.com/oauth/authenticate?' + data.text, {
		                showLocationBar: false
		            });
		         //   if (typeof window.plugins.childBrowser.onLocationChange !== "function"){
						window.plugins.childBrowser.onLocationChange = function(loc){
		                
		                if (loc.indexOf(_self.twitterOptions.callbackUrl) >= 0) {
								console.log(" loc = " + loc);
								
								var verifier = loc.match(/oauth_verifier=(.*)$/)[1];
			                    _self.oauth.get("https://api.twitter.com/oauth/access_token?oauth_verifier=" + verifier + "&" + _self.requestParams, function(data){
			                    
				                        var accessParams = {};
				                        var qvars_tmp = data.text.split('&');
				                        var accessData = {};
				                        
				                        for (var i = 0; i < qvars_tmp.length; i++) {
				                            var y = qvars_tmp[i].split('=');
				                            accessParams[y[0]] = decodeURIComponent(y[1]);
				                        }
				                        
				                        _self.oauth.setAccessToken([accessParams.oauth_token, accessParams.oauth_token_secret]);
				                        accessData.accessTokenKey = accessParams.oauth_token;
				                        accessData.accessTokenSecret = accessParams.oauth_token_secret;			                        
				                        localStorage.setItem("twitterKey", JSON.stringify(accessData));
				                        window.plugins.childBrowser.close();
										
										_self.getTwitterInfo(function(name){
											if (callback){
												localStorage.setItem("twitterName", name);
												callback(name);
											}
										
														
										});
										
									
			                    }, function(data){
			                     
			                    });
								}
					}
		              //  }
		            
		            
		        }, function(data){
		        	
		        });
		}
        
    };
	
	this.tweetToTimeLine = function(theTweet){
		
        _self.oauth.post('https://api.twitter.com/1/statuses/update.json', {
            'status': theTweet, 
            'trim_user': 'true'
        }, function(){
        		
        }, function(){
        	
        });
        
    };
	
	this.getTwitterInfo = function(callback){
        _self.oauth.get('https://api.twitter.com/1/account/verify_credentials.json?skip_status=true', function(data){
            var entry = JSON.parse(data.text);
            appUtility.showLoadingScreen();
			
			if (callback)
				callback(entry.screen_name);
            
            //alert("TWITTER USER: " + entry.screen_name);
        
        
        }, function(data){
          
        });
        
        // Since everything went well we can close our childBrowser!                             
        
    };
    
	this.logoutTwitter = function(callback){
		force_login = true;
		callback();
		/*
		_self.oauth.post('https://api.twitter.com/1/account/end_session.json', function(){
			callback();
		}, function(){
			callback();
		});
		*/
	};
};
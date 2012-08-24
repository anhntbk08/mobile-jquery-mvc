function loginFb(){
		var facebookKey = localStorage.getItem("facebookKey" );
		if (facebookKey == null || facebookKey == undefined )
		{
			FB.login(function(response){
	            if (response.authResponse) {
					
	                appUtility.showLoadingScreen();
	                localStorage.setItem("facebookKey" ,response.authResponse.accessToken);
					
	                FB.api('/me', function(response){
						
						//appUtility.hideLoadingScreen();
	                });
					
					appUtility.hideLoadingScreen();
	            }
	            else {
	                appUtility.alert('Login facebook failed');
	            }
	        }, {
	            scope: "publish_stream"
	        });
		}
		else{
			appUtility.alert("You loginned in facebook");
		}
	        
    };
    
    function loginFbWithoutRegister(callback){
		var facebookKey = localStorage.getItem("facebookKey" );
		if (facebookKey == null || facebookKey == undefined) {
				FB.login(function(response){
		        		            
		            if (response.authResponse) {
						appUtility.showLoadingScreen();
		                
						
						FB.api('/me', function(response){
														
							appUtility.hideLoadingScreen();
		                });
		            }
		            else {
		                appUtility.alert('Login facebook failed');
		            	}
		        }, {
		            scope: "publish_stream"
		        });
	    	} else{
				appUtility.alert("You loginned in facebook");
			}
		}
        
    
    function publishStory(name, caption, discription){
        FB.ui({
            method: 'feed',
            name: name,
            caption: caption,
            description: discription,
            link: 'http://joolist.com/demo/VentiTag/index.php',
            picture: 'http://joolist.com/demo/ventitagnew/Code/client/img/black-logo.png'
        }, function(response){
            //console.log('publishStory response: ', response);
        });
        return false;
    }
	
	function logoutFb(callback){
		FB.logout(function(response) {
		  	callback();
		});
	}

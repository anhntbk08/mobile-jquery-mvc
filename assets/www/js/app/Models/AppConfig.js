
AppConfig = {
		API: {
			base_url: "http://joolist.com/demo/gda-web/service/index.php",
			get_kitchen_list: '?controller=Order&action=getkitchenlist',
			get_delivering_list: '?controller=Order&action=getdeliveringlist',
			bind_order : '?controller=Order&action=bindOrder',
			login : '?controller=User&action=login',
			confirm_order : '?controller=Order&action=confirmOrder',
			get_delivered_list : '?controller=Order&action=getDelivered',
			upload_location : '?controller=Order&action=updateLocation'
		},
		INTERVAl :{
            interval_get_list_kitchen : 60000
		},
		ALERT : {
			
		}
}
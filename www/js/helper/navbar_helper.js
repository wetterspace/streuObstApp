var NavbarHelper = {

	load_navbar: function(){

		var init_buttons = function(){
			//some btns always have same functionality thats why they are init at the beginning of the app

			NavbarHelper.click( NavbarHelper.btn.logout, function(){
				//löscht session aus dem speicher und leitet zum Startbildschirm
				sessionStorage.clear();
				new Login();
			});
		}

		$("#navbar_container").load("navbar.html", init_buttons);
	},

	//hide und active sollen zeigen das man es verstecken kann oder active machen kann
	//logo darf zum beispiel nicht versteckt werden sondern soll immer angezeigt werden
	btn: {
		logo: {
			id: "nav_btn_logo"
		},
		baum_anlegen: {
			id: "nav_btn_baum_anlegen",
			hide: true,
			active: true
		},
		user: {
			id: "nav_btn_user",
			hide: true,
			active: true
		},
		ubersicht: {
			id: "nav_btn_ubersicht",
			hide: true,
			active: true
		},
		logout: {
			id: "nav_btn_logout",
			hide: true,
			active: true
		},
		karte: {
			id: "nav_btn_karte",
			hide: true,
			active: true
		}
	},

	make_all_unactive: function(){
		Object.keys(this.btn).forEach(function(key){
			var btn = this.btn[key];

			if(btn.active){
				$("#" + btn.id).removeClass('active');
			}
		}.bind(this));
	},

	make_active: function(btn){
		this.make_all_unactive();

		//on click entferenen vom button damit man nicht öfters draufdrückt
		NavbarHelper.unbind( btn );
		//Klasse hinzufügen um es active zu machen
		$("#" + btn.id).addClass('active');

		//should show btn
		NavbarHelper.show(btn);
	},

	hide: function(btn){
		$("#" + btn.id).hide()
	},

	show: function(btn){
		$("#" + btn.id).show()
	},

	hide_all_btns: function(){
		Object.keys(this.btn).forEach(function(key){
			var btn = this.btn[key];

			if(btn.hide){
				this.hide(btn);
			}
		}.bind(this));
	},

	show_all_btns: function(){
		this.make_all_unactive();
		Object.keys(this.btn).forEach(function(key){
			var btn = this.btn[key];
				this.show(btn);
		}.bind(this));
	},

	unbind: function(btn){
		//also das die click funtionen weggehen
		$("#" + btn.id).unbind();
	},

	click: function(btn, func){
		$("#" + btn.id).unbind().show().click(
			function(){
				$('.navbar-collapse').collapse('hide');
				func()
			});
	},

	make_karte_and_ubersicht_and_baum_anlegen_and_user_clickable: function(wiese){

		NavbarHelper.click( NavbarHelper.btn.baum_anlegen, function(){


			var tree_form = new TreeForm();
				tree_form.set_wiese(wiese);
				tree_form.show_form();

			function onSuccess(imageData) {
			    alert(imageData);
			}

			function onFail(message) {
			    alert('Failed because: ' + message);
			}

			navigator.camera.getPicture(onSuccess, onFail, { quality: 50,
			    destinationType: Camera.DestinationType.DATA_URL
			});


		});

		NavbarHelper.click( NavbarHelper.btn.ubersicht, function(){
			//pass tree object to ubersicht
			var ubersicht = new Ubersicht();
				ubersicht.set_wiese(wiese);
				ubersicht.show();


			cordova.plugins.barcodeScanner.scan(
		      function (result) {
		          alert("We got a barcode\n" +
		                "Result: " + result.text + "\n" +
		                "Format: " + result.format + "\n" +
		                "Cancelled: " + result.cancelled);
		      }, 
		      function (error) {
		          alert("Scanning failed: " + error);
		      }
		   );


		});

		NavbarHelper.click( NavbarHelper.btn.karte, function(){
				//pass tree object to ubersicht
				wiese.show();
		});

		NavbarHelper.click( NavbarHelper.btn.user, function(){
			new User( sessionStorage.getItem('user') ).show();
		});
	}
};

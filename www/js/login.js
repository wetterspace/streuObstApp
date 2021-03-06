var Login = function(){
	//WETTER VORLADEN DAMITS SPATER SCHNELL GEHT
	var weather_helper  = new Weather();
		weather_helper.preload_information();

	if(sessionStorage.getItem('user')== null) {
	this.showLogin();
	} else {
	new User(sessionStorage.getItem('user')).show();
}
};


Login.prototype.checkLogin = function(userName, userPassword){
	var userDb = new DB().getUserDB();

	userDb.child(userName).once("value", function(snapshot){
		var userValue = snapshot.val();

		if(userValue == null){
			//wiese exisitert nicht
			alert("User does not exist");
		}else{
			if(userValue.password == userPassword){
				//wiese existiert, password ist richtig
				new User(userName).show();
				sessionStorage.setItem('user', userName);
			}else{
				//wiese existiert, password ist aber falsch
				alert("Passwort falsch");
			}
		}

	});
};

//showLogin, Fenster wird angezeigt, wo man Wiese mit Name und Password wählen kann oder eine neue erstellt
Login.prototype.showLogin = function(){




	var initializeButtons = function(){

		NavbarHelper.hide_all_btns();

		$('#buttonRegister').click(function(){
			//registers user
			new Register();
		});

		$('#buttonOffline').click(function(){
			//registers user
			sessionStorage.setItem('user', 'Offline');
			new User('Offline').show();
		});



		$('#formLogin').submit(function(event){
			event.preventDefault();

			var userName = $('#inputUsername').val();
			var userPassword = $('#inputPassword').val();
			var out = sjcl.hash.sha1.hash(userPassword);
			var hashedPassword = sjcl.codec.hex.fromBits(out)

			checkUserLoginOnline(userName, hashedPassword, function(username) {
			if(userValue == null){
				//wiese exisitert nicht
				alert("User does not exist");
		}else{
			if(userValue.password == hashedPassword){
				//wiese existiert, password ist richtig
				new User(userName, hashedPassword).show();
				sessionStorage.setItem('user', userName);
			}else{
				//wiese existiert, password ist aber falsch
				alert("Passwort falsch");
			}
		}
			});
		//	this.checkLogin(wiesenName, hashedPassword);
		}.bind(this));
	}.bind(this);

	$('#HauptFenster').load('./html/login.html', initializeButtons);



};

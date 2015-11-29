var Login = function(){
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
				new User(userName, userPassword).show();
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
		$('#buttonRegister').click(function(){
			//registers user
			new Register();
		});

		$('#buttonLogin').click(function(){
			var wiesenName = $('#inputWiesenName').val();
			var wiesenPassword = $('#inputWiesenPassword').val();
			var out = sjcl.hash.sha1.hash(wiesenPassword);
			var hashedPassword = sjcl.codec.hex.fromBits(out)
			
			
			this.checkLogin(wiesenName, hashedPassword);
		}.bind(this));
	}.bind(this);

	$('#HauptFenster').load('./html/login.html', initializeButtons);
	
	

};

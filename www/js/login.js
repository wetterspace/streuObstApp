var Login = function(){
	this.showLogin();
};


Login.prototype.checkLogin = function(wiesenName, wiesenPassword){
	var wiesenDb = new DB().getWiesenDB();

	wiesenDb.child(wiesenName).once("value", function(snapshot){
		var wiesenValue = snapshot.val();

		if(wiesenValue == null){
			//wiese exisitert nicht
			alert("Wiese does not exist");
		}else{
			if(wiesenValue.password == wiesenPassword){
				//wiese existiert, password ist richtig
				new Wiese(wiesenName, wiesenPassword).show();
			}else{
				//wiese existiert, password ist aber falsch
				alert("Password falsch");
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

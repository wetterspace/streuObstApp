var currentWiese = null;


var init = function(){

	if(currentWiese == null){
		new Login();

		new TreeForm().show_form();
	}

};
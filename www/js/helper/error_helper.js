var ErrorHelper = {

}

ErrorHelper.show_error = function(err_message){
	var warning_box = $('<div/>', {class: "alert alert-dismissible alert-warning col-lg-12"});
		warning_box.append($('<button/>', {class: "close", "data-dismiss":"alert", text: "X"}));
		warning_box.append($('<p/>', {text: "Fehler!"}));

		warning_box.append($('<p/>', {text: err_message}));

    $('#FehlerFenster').html(warning_box);

    ///let it fadeout after some seconds
    $(warning_box).fadeOut(3000);
}
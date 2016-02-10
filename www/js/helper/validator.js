var Validator = function(){
	this.validation_errors =[]
};

Validator.prototype.is_valid_object = function(obj, form_rows) {


	form_rows.forEach(function(row){
		if(row.fields){
			//control each field
			row.fields.forEach(function(field){

				if(field.validation){
					var is_valid = field.validation( obj[field.id] );

					if(! is_valid){
						this.validation_errors.push(field);
					}
					
				}

			}.bind(this));
		}
	}.bind(this));

	if(this.validation_errors.length > 0){
		return false;
	}else{
		return true;
	}
};



Validator.prototype.show_warnings = function(){
	var warning_box = $('<div/>', {class: "alert alert-dismissible alert-warning col-lg-12"});
		warning_box.append($('<button/>', {class: "close", "data-dismiss":"alert", text: "X"}));
		warning_box.append($('<p/>', {text: "Fehler!"}));

	this.validation_errors.forEach(function(error_field){
		//add warning to field

		warning_box.append($('<p/>', {text: "Falscher Wert für " + error_field.title}));
	});

    $('#FehlerFenster').html(warning_box);

    ///let it fadeout after some seconds
    $(warning_box).fadeOut(3000);
}
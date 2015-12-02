var Form = {
	Dropdown: function(field){
		//create dropdown
		var input = $('<select/>', {id: field.id, class: "form-control" });

		//add all options to select list
		field.options.forEach(function(name) {
			input.append($("<option />").val(name).text(name));
		});

		//if field has onchange method
		if(field.onchange){
			input.on('change', function (e) {
   				var optionSelected = $("option:selected", this);
   				var valueSelected = this.value;

   				field.onchange(valueSelected);
			});
		};

		return input;
	},

	Text: function(field){
		//create text input
		return $('<input/>', {id: field.id, class: "form-control", placeholder: field.title });
	},

	Textarea: function(field){
		return $('<textarea/>', {id: field.id, class: "form-control", placeholder: field.title, rows: field.rows});
	},


	get_value_for: function(field){		

		return $("#" + field.id).val();

	},
};

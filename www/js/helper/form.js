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

		return [input];
	},

	Range: function(field){
		return [
					$('<input/>', {id: field.id, type: "range", class: "form-control", placeholder: field.title, min: field.min,  max: field.max,
					change: function(){
						$(this).next().find('a').text("" + field.range_name + " " + $( this ).val()  + " von " + field.max);
					} }),

					$('<div/>', {class:"text-center"}).append($('<a/>', { text: "" + field.range_name + " "+ (field.max / 2) + " von " + field.max }))
				]

	},

	Text: function(field){
		//create text input
		return [$('<input/>', {id: field.id, class: "form-control", placeholder: field.title })];
	},

	Textarea: function(field){
		return [$('<textarea/>', {id: field.id, class: "form-control", placeholder: field.title, rows: field.rows})];
	},

	Date: function(field){
		return [$('<input/>', {id: field.id, class: "form-control", type: "date"})]
	},

	get_value_for: function(field){		

		return $("#" + field.id).val();

	},
};

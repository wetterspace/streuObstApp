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
	}
};


var TreeForm = function(){
	this.form_rows = [
		//row 1
		//Baum ID
		{	
			id: "tree_form_row_1",
			fields: [
				{	id: "obstArt", 
					form: Form.Dropdown,
					options: Obst.getArten(),
					onchange: TreeFormHelper.change_sorten_dropdown,
					title: "ObstArt" },

				{	id: "sortName",	
					form: Form.Dropdown,
					options: [],
					title: "Sortenname"},

				{	id: "lon",  
					form: Form.Text,
					title: "Longitude" },

				{	id: "lat",
					form: Form.Text,
					title: "Latitude"}
			]
		},
		//row 2
		//Pflegezustand
		{	
			id: "tree_form_row_2",
			fields: [
				{	id: "ploid", 
					form: Form.Dropdown,
					options: ["Diploid", "Tripolid"], 
					title: "Diploid/Triploid"},

				{	id: "date", 
					form: Form.Text,
					title: "Gepflanzt"},

				{	id: "crownState", 
					form: Form.Text,
					title: "???????"},

				{	id: "plateState", 
					form: Form.Text,
					title: "????????"},

				{	id: "logState", 
					form: Form.Text,
					title: "???????"},

				{	id: "dmgState", 
					form: Form.Text,
					title: "????????"},

				{	id: "verbissState",
					form: Form.Text,
					title: "Verbissspuren"},

				{	id: "adjustedState",
					form: Form.Text,
					title: "??????????"},

				{	id: "crownHeight", 
					form: Form.Text,
					title: "Höhe der Krone"},

				{	id: "timeStamp", 
					form: Form.Text,
					title: "Zeitstempel"}
			]
		},
		//row 3
		//Blüte und Ertrag
		{	
			id: "tree_form_row_3",
			fields: [
				{	id: "begin", 
					form: Form.Text,
					title: "Beginn"},

				{	id: "end", 
					form: Form.Text,
					title: "Ende"},

				{	id: "bloomLevel", 
					form: Form.Text, 
					title: "Blühintensität"},

				{	id: "tempStart", 
					form: Form.Text,
					title: "Temperatur bei Beginn"},

				{	id: "tempEnd", 
					form: Form.Text,
					title: "Temperatur bei Ende"},

				{	id: "cropState",
					form: Form.Text,
					title: "Ertragsintensität"}
			]
		}



	]
}

TreeForm.prototype.init_take_picture_button = function(){

	$('#take_picture_button').click(function(){

		var camera = new Camera();
			camera.take_picture_on_click($('#take_picture_button'));
			camera.show($('#tree_image_box'));

	});

}

TreeForm.prototype.init_tabs = function(){
	$('#tree_form_selector li').click(function(){
		var active_tabselector =  $(this).data('tabselector');
		
		$('.tabselector').removeClass('active');
		$(this).addClass('active');

		$('.tabselector').each(function(){
			var text = $(this).text();

			if($(this).hasClass('active')){
				$(this).html(text);
			}else{
				
				$(this).html($('<a/>', {href: "#", text: text}));
			}
		});

		$('.form_tab').hide();
		$('div[data-tab="' + active_tabselector + '"]').show();
	});
}

TreeForm.prototype.init_get_current_position = function(){
	$('#btnGetCurrentLocation').click(function(){
		Position.get_current_lon_lat(function(lon,lat){
			$('#lon').val(lon);
			$('#lat').val(lat);
		})
	});
}

TreeForm.prototype.show_form = function(){

	$('#HauptFenster').load("./html/tree/form.html",function(){

		this.render_forms();

		this.init_tabs();

		this.init_take_picture_button();

		this.init_get_current_position();



		
	}.bind(this));

}

TreeForm.prototype.render_forms = function(){

	this.form_rows.forEach(function(row){
		var form_row = $('#' + row.id);

		//renders each field
		row.fields.forEach(function(field){
			var container = $('<div/>', {class: "form-group"});

			var title = $('<label/>', {class: "control-label", text: field.title});

						//calls function form form obj
			var form = field.form(field);

			
			container.append(title)
					 .append(form);


			


			form_row.append(container);

		});


	});
}



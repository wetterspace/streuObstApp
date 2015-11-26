var PflegeForm = function(tree){
	this.tree = tree;


	this.form_rows = [
		{	
			id: "pflege_row_1",
			fields: [
				{	id: "krone_beschnitten", 
					form: Form.Text,
					title: "Krone Beschnitten"},

				{	id: "höhe_der_krone", 
					form: Form.Text,
					title: "Höhe der Krone"}
			]
		}, 
		{
			id: "pflege_row_2",
			fields:[

				{	id: "baumstamm_gereinigt", 
					form: Form.Text,
					title: "Baumstamm gereinigt"},

				{	id: "baumstamm_gekalket", 
					form: Form.Text,
					title: "Baumstamm gekalkt"}
			]		
		},

		{
			id: "pflege_row_3",
			fields:[
				{	id: "schädlinge", 
					form: Form.Textarea,
					rows: 2,
					title: "Schädlinge"}
			]		
		},

		{
			id: "pflege_row_4",
			fields:[
				{	id: "verbiss_spuren",
					form: Form.Textarea,
					rows: 2,
					title: "Verbissspuren"}
			]		
		}

	]
}

PflegeForm.prototype.init_pflegezustände = function(){
	var pflegezustände_box = $("#pflegezustände_list");
		//clear box
		pflegezustände_box.html('');

	if(this.tree && this.tree.pflegezustände){
		//list the pflegezustände

	}else{
		var box = $('<div/>', {class: "well", text: "Sie haben noch keine Angaben zum Pflegezustandes des Baumes gemacht."});

		pflegezustände_box.html(box);
	}
}


PflegeForm.prototype.render = function(box) {
	this.box = box;

	$(box).load("./html/tree/pflege_form.html", function(){

		this.init_pflegezustände();
		this.render_forms();

	}.bind(this));
};

PflegeForm.prototype.render_forms = function(){

	this.form_rows.forEach(function(row){
		var form_row = $('#' + row.id);

		if(row.func){
			row.func(this.tree);
		}

		if(row.fields){
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
		}
	}.bind(this));
}


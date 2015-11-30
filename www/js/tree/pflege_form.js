var PflegeForm = function(tree){
	this.tree = tree;


	this.form_rows = [
		{	
			id: "pflege_row_1",
			fields: [
				{	id: PflegeAttr.krone_beschnitten.id, 
					form: Form.Text,
					title: PflegeAttr.krone_beschnitten.title},

				{	id: PflegeAttr.hohe_der_krone.id, 
					form: Form.Text,
					title: PflegeAttr.hohe_der_krone.title}
			]
		}, 
		{
			id: "pflege_row_2",
			fields:[

				{	id: PflegeAttr.baumstamm_gereinigt.id, 
					form: Form.Text,
					title: PflegeAttr.baumstamm_gereinigt.title},

				{	id: PflegeAttr.baumstamm_gekalket.id, 
					form: Form.Text,
					title: PflegeAttr.baumstamm_gekalket.title}
			]		
		},

		{
			id: "pflege_row_3",
			fields:[
				{	id: PflegeAttr.schaedline.id, 
					form: Form.Textarea,
					rows: 2,
					title: PflegeAttr.schaedline.title}
			]		
		},

		{
			id: "pflege_row_4",
			fields:[
				{	id: PflegeAttr.verbiss_spuren.id,
					form: Form.Textarea,
					rows: 2,
					title: PflegeAttr.verbiss_spuren.title}
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


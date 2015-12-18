var TreeForm = function(tree){
	//wenn man einen Tree übergibt wird dieser bearbeitet, wenn keiner dann wird ein neuer erstellt
	if(tree){
		this.tree = tree;
		this.wiese = tree.wiese;
		//handels pflegezustaende
		this.pflegeform = new PflegeForm(tree);
	}else{
		this.pflegeform = new PflegeForm();
	}
	
	this.image_uploader = new ImageUploader();


	this.form_rows = [
	//row 1
	//Baum ID

	//TreeAttr stands for Tree Attributes
	{	
id: "tree_form_row_1",
fields: [
		{	id: TreeAttr.obstart.id, 
form: Form.Dropdown,
options: Obst.getArten(),
			//when another value gets selected
onchange: TreeFormHelper.change_sorten_dropdown,
title: TreeAttr.obstart.title
		},

		{	id: TreeAttr.sortname.id,	
form: Form.Dropdown,
options: [],
title: TreeAttr.sortname.title},

		{	id: TreeAttr.lon.id,  
form: Form.Text,
title: TreeAttr.lon.title,
validation: TreeAttr.lon.validation
		},

		{	id: TreeAttr.lat.id,
form: Form.Text,
title: TreeAttr.lat.title,
validation: TreeAttr.lat.validation
		}
		]
	},

	{
id: "tree_form_row_1_2",
fields: [
		{	id: TreeAttr.ploid.id, 
form: Form.Dropdown,
options: ["Diploid", "Tripolid"], 
title: TreeAttr.ploid.title},

		{	id: TreeAttr.gepflanzt_date.id, 
form: Form.Date,
title: TreeAttr.gepflanzt_date.title},
		{
id: TreeAttr.anmerkungen.id,
form: Form.Textarea,
rows: 4,
title: TreeAttr.anmerkungen.title
		}
		]
	},

	{	//Pflegezustände hat eigene Form
id: "tree_form_row_2",
func: function(){
			this.pflegeform.render($("#tree_form_row_2"));
		}.bind(this)
	},

	//row 3
	//Blüte und Ertrag
	{
id: "tree_form_row_3_1",
fields: [
		{	id: TreeAttr.bluete_beginn.id,
form: Form.Date,
title: TreeAttr.bluete_beginn.title},

		{	id: TreeAttr.bluete_end.id,
form: Form.Date,
title: TreeAttr.bluete_beginn.title}
		]
	},

	{
id: "tree_form_row_3_2",
fields: [
		{	id: TreeAttr.blueintensitaet.id,
form: Form.Range,
min: 0,
max: 6,
			range_name: "Blühintensität",
title: TreeAttr.blueintensitaet.title},

		{	id: TreeAttr.ertragsintensitaet.id,
form: Form.Range,
min: 0,
max: 6,
			range_name: "Ertragsintensität",
title: TreeAttr.ertragsintensitaet.title}
		]
	},

	{
id: "tree_form_row_3_3",
fields: [
		{	id: TreeAttr.temperatur_beginn.id, 
form: Form.Date,
title: TreeAttr.temperatur_beginn.title},

		{	id: TreeAttr.temperatur_ende.id, 
form: Form.Date,
title: TreeAttr.temperatur_ende.title}
		]
	}

	]
}

TreeForm.prototype.init_take_picture_button = function(){

	var imageLoader_btn = document.getElementById('image_upload_btn');
	imageLoader_btn.addEventListener('change', this.image_uploader.handleImage.bind(this.image_uploader), false);

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
		var current_text = $(this).text();
		$(this).text("Lädt Position");

		Position.get_current_lon_lat(function(lon,lat){
			$('#lon').val(lon);
			$('#lat').val(lat);

			$(this).text(current_text);
		}.bind(this))
	});
}

TreeForm.prototype.set_wiese = function(wiese){
	this.wiese = wiese;
}

TreeForm.prototype.save_form = function(){
	
	//Das Baum object das aus der MAske erstellt werden kann
	var tree_out_of_form = TreeFormHelper.create_tree_object_from_fields(this.form_rows);
	tree_out_of_form.pflegezustaende = this.pflegeform.get_pflegezustaende_to_save();

	//check if tree is valid object anhand von erstelltem objekt und der Form
	var validator = new Validator();
	var is_valid = validator.is_valid_object(tree_out_of_form, this.form_rows);

	if(is_valid){
		if(this.tree){
			//Tree wird überarbeitet
			//Wird dort auch gespeichert
			this.tree.overwrite_attributes(tree_out_of_form);
			console.log(this.tree.wiese.data.coordinates);
			
			checkTreeForOrchard(this.tree);
			
			/*		if(!treeOnOrchard(this.tree.wiese.data.coordinates, this.tree.lon, this.tree.lat)) {
	$('#myModal').modal('show');
	
	$("#save_anyway").click(function(){
		$('#myModal').modal('hide');
		$('.modal-backdrop').remove();
		
	
		this.tree.save();
	}.bind(this));
	
	}else {
		this.tree.save();
	} */
			
			
			//in case image was uploaded append it to tree images
			//this.image_uploader.add_uploaded_image(this.tree)
			//	this.tree.save();
		}else{
			//neuer tree muss erstellt werden
			var tree =  tree_out_of_form;
			tree.wiese = this.wiese;
			//in case image was uploaded append it to tree images
			//this.image_uploader.add_uploaded_image(tree)
			
			
			checkTreeForOrchard(tree);
			
			/*				if(!treeOnOrchard(tree.wiese.data.coordinates, tree.lon, tree.lat)) {
	$('#myModal').modal('show');
	
	$("#save_anyway").click(function(){
		$('#myModal').modal('hide');
		$('.modal-backdrop').remove();
		
	
		tree.save();
	}.bind(this));
	
	}else {
		tree.save();
	} */
			
			
			
			//	tree.save();
		}
	}else{
		//not valid show warnings
		validator.show_warnings();
	}
}

TreeForm.prototype.init_save_or_cancel = function(){
	$("#cancel_tree_form").click(function(){
		this.wiese.show();
	}.bind(this));

	
	
	$("#save_tree_form").click(function(){
		
		
		
		
		
		
		//	$('#myModal').modal('hide');
		//	$('.modal-backdrop').remove();
		
		
		this.save_form();
		
		
	}.bind(this));
}

function checkTreeForOrchard(tree) {
	if(!treeOnOrchard(tree.wiese.data.coordinates, tree.lon, tree.lat)) {
		$('#myModal').modal('show');
		
		$("#save_anyway").click(function(){
			$('#myModal').modal('hide');
			$('.modal-backdrop').remove();
			
			
			tree.save();
		}.bind(this));
		
	}else {
		tree.save();
	}

}

TreeForm.prototype.show_form = function(){

	$('#HauptFenster').load("./html/tree/form.html",function(){

		this.render_forms();

		this.init_tabs();

		this.init_take_picture_button();

		this.init_get_current_position();

		this.init_save_or_cancel();

		this.fill_forms_if_tree_already_exists();

		//pass wiese
		NavbarHelper.make_karte_and_ubersicht_and_baum_anlegen_and_user_clickable(this.wiese);
		//make btn in navbar active
		NavbarHelper.make_active(NavbarHelper.btn.baum_anlegen);

	}.bind(this));

}


TreeForm.prototype.show_latest_tree_image = function(){
	var image_keys = Object.keys(this.tree[TreeAttr.images.id]);
	function sortNumber(a,b) {return b - a;}
	//sotiere die keys nach dem erstellungsdatum
	image_keys.sort(sortNumber);

	if(image_keys.length > 0){
		var latest_image_url = this.tree[TreeAttr.images.id][image_keys[0]].url;
		$('#tree_image').attr('src', latest_image_url);
	}
}


TreeForm.prototype.fill_forms_if_tree_already_exists = function(){

	if(this.tree){

		//if(this.tree[TreeAttr.images.id]){
		//	this.show_latest_tree_image();
		//}

		this.form_rows.forEach(function(row){
			
			//if(row.func){ MUSS EIG AUCH BAUMSTATUS UPDATEN
			//	row.func(this.tree);
			//}

			if(row.fields){
				//renders each field
				row.fields.forEach(function(field){

					//sets value for each field
					if(this.tree[field.id]){
						$("#" + field.id).val(  this.tree[field.id] );
					}

					//execute on change of field
					if(field.onchange){
						field.onchange(this.tree[field.id]);
					}

				}.bind(this));
			}
		}.bind(this));

	}
};

TreeForm.prototype.render_forms = function(){

	this.form_rows.forEach(function(row){
		var form_row = $('#' + row.id);

		if(row.func){
			//if form has attached function, for eg. Pflegeform, execute it
			row.func();
		}

		if(row.fields){
			//renders each field
			row.fields.forEach(function(field){
				var container = $('<div/>', {class: "form-group"});

				var title = $('<label/>', {class: "control-label", text: field.title});

				//calls function form form obj
				var forms = field.form(field);

				container.append(title);

				forms.forEach(function(form){
					container.append(form);
				});

				form_row.append(container);

			});
		}
	}.bind(this));
}



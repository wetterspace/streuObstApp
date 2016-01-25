var TreeForm = function(tree){
	//wenn man kein baum sondern ne extra sache anlegt;
	this.create_edit_extra = false;

	this.icon_list = [
		1453756986284,
		1453662416143,
		1453661192359
	];



	//wenn man einen Tree übergibt wird dieser bearbeitet, wenn keiner dann wird ein neuer erstellt
	if(tree){
		this.tree = tree;
		this.wiese = tree.wiese;
		//handels pflegezustaende
		if(tree.is_extra()){
			this.create_edit_extra = true;
		}else{
			this.pflegeform = new PflegeForm(tree);
		};
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
		{	id: TreeAttr.name.id,
form: Form.Text,
title: TreeAttr.name.title,
extra: true
		},
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
validation: TreeAttr.lon.validation,
extra: true
		},

		{	id: TreeAttr.lat.id,
form: Form.Text,
title: TreeAttr.lat.title,
validation: TreeAttr.lat.validation,
extra: true
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
rows: 5,
title: TreeAttr.anmerkungen.title,
extra: true
		}
		]
	},

	{	//Pflegezustände hat eigene Form
id: "tree_form_row_2",
func: function(){
			if(this.create_edit_extra == false ){
				this.pflegeform.render($("#tree_form_row_2"));
			}
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

TreeForm.prototype.set_extra_anlegen = function(){
	//wenn man kein baum sondern ne extra sache anlegt;
	this.create_edit_extra = true;
};

TreeForm.prototype.get_extra_icon_image_id = function(){
	return $('.icon_selected_img').first().data('image_id');
}


TreeForm.prototype.add_icon_id = function(image_id){
	//falls noch nicht in icon array
	if($.inArray(image_id, this.icon_list) < 0){
		console.log(image_id);
		console.log(this.icon_list);
		this.icon_list.unshift(image_id);
	}
	this.render_icon_list(image_id);
}

TreeForm.prototype.render_icon_list = function(opt_image_id){
	var icon_box = $('#icon_list');
		icon_box.html('');

	this.icon_list.forEach(function(icon_id){
		var img_element = $('<img/>', {src: ImageHelper.get_url(icon_id),
									   'data-image_id': icon_id,
						 				style: "width:100%;height:auto; margin-top:5px; margin-bottom: 5px",
						 				class: "img-thumbnail icon_auswahl_img"});

		icon_box.append($('<div/>', {class: "col-sm-4"}).append(img_element));

		ImageHelper.get_image_data_for(icon_id, img_element, {save: false});
	}.bind(this));

	$('.icon_auswahl_img').click(function(){
		var selected_class = 'icon_selected_img';
		$('.icon_auswahl_img').removeClass(selected_class);
		$(this).addClass(selected_class);
	});

	if(opt_image_id){
		$('*[data-image_id="' +  opt_image_id + '"]').click();
	}else{
		if(this.tree){
			//dann die icon_image_id schon mal zu den Icons hinzufügen
			this.add_icon_id(this.tree.icon);
		}else{
			//sonst einfach des erste wählen
			$('.icon_auswahl_img').first().click();
		}
	}
}

TreeForm.prototype.init_upload_icon_button = function(){
	var that = this;

	$('#upload_image_col').hide();
	$('#icon_selector_part').show();


	this.render_icon_list();

	var imageLoader_btn = document.getElementById('icon_upload_btn');
	this.image_uploader.set_caption($('#icon_image_caption'));
	this.image_uploader.set_image_size(80,80);
	this.image_uploader.set_callback(function(image_id){ that.add_icon_id(image_id) });
	imageLoader_btn.addEventListener('change', this.image_uploader.handleResizeImage.bind(this.image_uploader), false);
}


TreeForm.prototype.init_take_picture_button = function(){
	var imageLoader_btn = document.getElementById('image_upload_btn');
	this.image_uploader.set_caption($('#tree_image_caption'));
	imageLoader_btn.addEventListener('change', this.image_uploader.handleImage.bind(this.image_uploader), false);
}

TreeForm.prototype.init_tabs = function(){
	$('#tree_form_selector').show();
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

	//Das Baum object das aus der MAske erstellt werden kann                            //DAnn ist heir gleich klar ob nen extra engelegt wird
	var tree_out_of_form = TreeFormHelper.create_tree_object_from_fields(this.form_rows, this.create_edit_extra);

	if(this.create_edit_extra){
		tree_out_of_form.extra = this.create_edit_extra;
		tree_out_of_form.icon = this.get_extra_icon_image_id();
	}else{
		tree_out_of_form.pflegezustaende = this.pflegeform.get_pflegezustaende_to_save();
	}

	//check if tree is valid object anhand von erstelltem objekt und der Form
	var validator = new Validator();
	var is_valid = validator.is_valid_object(tree_out_of_form, this.form_rows);

	if(is_valid){
		if(this.tree){
			//Tree wird überarbeitet
			//Wird dort auch gespeichert
			this.tree.overwrite_attributes(tree_out_of_form);
			if(!this.create_edit_extra){
				this.image_uploader.add_uploaded_image(this.tree);
			}

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



			//	this.tree.save();
		}else{
			//neuer tree muss erstellt werden
			var tree =  tree_out_of_form;
			tree.wiese = this.wiese;
			//in case image was uploaded append it to tree images
			if(!this.create_edit_extra){
				this.image_uploader.add_uploaded_image(tree);
			}

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


TreeForm.prototype.show_qr_code = function(){
    //alles wird im qr code reader gemanegt auch ob der baum noch gar nicht exisitert
    // und deshalb gar kein qr code angezeight werden kann
	var qr_code_helper = new QrCodeHelper()
							.set_obj_and_key_for_text(this.tree, "key")
							.set_header_field($("#qr_code_header"))
							.set_image_field($("#qr_code_image_field"))
							.set_print_field($("#qr_code_print_box"))

							.render();
}


TreeForm.prototype.init_camera_on_cordova = function(){
	if(new CordovaCamera().is_avaible_on_device()){
		//show tab to navigate to camera menu
		$('*[data-tabselector="camera"]').show();

		var camera = new CordovaCamera();
			camera.set_take_picture_btn($('#take_picture_btn'));
			camera.set_photo_box($('#photo_box_camera'));
			camera.init();
	}
}

TreeForm.prototype.show_form = function(){

	$('#HauptFenster').load("./html/tree/form.html",function(){
		this.render_forms();

		this.init_get_current_position();

		this.init_save_or_cancel();

		this.fill_forms_if_tree_already_exists();

		this.show_delete_button_if_tree_already_exists();




		if(this.create_edit_extra){

			this.init_upload_icon_button();
			//wenn man extra ding anlegt

			//pass wiese
			NavbarHelper.make_karte_and_ubersicht_and_baum_anlegen_and_user_clickable(this.wiese);
			//make btn in navbar active
			NavbarHelper.make_active(NavbarHelper.btn.extra_anlegen);
		}else{
			this.init_tabs();

			this.init_take_picture_button();

			this.show_qr_code();

			//if app version show tab to take picture directly from app
			this.init_camera_on_cordova();

			//pass wiese
			NavbarHelper.make_karte_and_ubersicht_and_baum_anlegen_and_user_clickable(this.wiese);
			//make btn in navbar active
			NavbarHelper.make_active(NavbarHelper.btn.baum_anlegen);
		}

	}.bind(this));

}


TreeForm.prototype.show_latest_tree_image = function(){
	if(this.tree[TreeAttr.images.id]){
		var image_keys = Object.keys(this.tree[TreeAttr.images.id]);

		if(image_keys.length > 0){
			function sortNumber(a,b) {return b - a;}
			//sotiere die keys nach dem erstellungsdatum
			image_keys.sort(sortNumber);

			if(image_keys.length > 0){
				var latest_image_id = this.tree[TreeAttr.images.id][image_keys[0]].id;
				ImageHelper.get_image_data_for(latest_image_id, $('#tree_image'), {save: false});
			}
		}
	}
}

TreeForm.prototype.show_delete_button_if_tree_already_exists = function(){
	if(this.tree){
		var tree = this.tree;
		$('#tree_form_btn_group').append(
			$('<a/>', {class: "btn btn-warning", text: "Löschen",
				click: function(){ tree.remove();}
			})
		);
	}
};

TreeForm.prototype.fill_forms_if_tree_already_exists = function(form_rows){

	if(this.tree){

		this.show_latest_tree_image();

		//DAMIT AUCH ANDERE ROWS ANGEZEIGT WERDEN KONNEN
		var rows = null;

		if(form_rows){
			rows = form_rows;
		}else{
			rows = this.form_rows;
		}

		rows.forEach(function(row){

			//if(row.func){ MUSS EIG AUCH BAUMSTATUS UPDATEN
			//	row.func(this.tree);
			//}

			if(row.fields){
				//renders each field
				row.fields.forEach(function(field){

					//zwiege nur wenns kein exta type is also Baum oder Special und Form mit dem Field
					if(this.create_edit_extra == false ||  (field.extra && field.extra == true) ){

						//sets value for each field
						if(this.tree[field.id]){
							$("#" + field.id).val(  this.tree[field.id] );
						}

						//execute on change of field
						if(field.onchange){
							field.onchange(this.tree[field.id]);
						}
					}

				}.bind(this));
			}
		}.bind(this));

	}
};

TreeForm.prototype.render_forms = function(form_rows){
	//you can pass your own form_rows then its a helper method
	//see wiese/submenu_helper.js
	var rows = null;

	if(form_rows){
		rows = form_rows;
	}else{
		rows = this.form_rows;
	}

	rows.forEach(function(row){
		var form_row = $('#' + row.id);

		if(row.func){
			//if form has attached function, for eg. Pflegeform, execute it
			row.func();
		}

		if(row.fields){
			//renders each field
			row.fields.forEach(function(field){
				//zwiege nur wenns kein exta type is also Baum oder Special und Form mit dem Field
				if(this.create_edit_extra == false ||  (field.extra && field.extra == true) ){
					var container = $('<div/>', {class: "form-group"});

					var title = $('<label/>', {class: "control-label", text: field.title});

					//calls function form form obj
					var forms = field.form(field);

					container.append(title);

					forms.forEach(function(form){
						container.append(form);
					});

					form_row.append(container);
				}
			}.bind(this));
		}
	}.bind(this));
}



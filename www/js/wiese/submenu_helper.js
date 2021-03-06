
var WieseSubmenuHelper = function(){
	this.wiese = null;
	this.trees = null;

	this.breadcrumb_id = "sub_menu_breadcrumb";
	this.boxes_id = "sub_box_menu"

	this.menus = {
		filter: {submenu: "filter"},
		baume: {submenu: "baume"},
		info: {submenu: "info"}
	}

	this.menu_keys = function(){
		return Object.keys(this.menus);
	}
};

WieseSubmenuHelper.prototype.start_drag_action = function(){

	var handleDragStart = function(e, is_extra) {
  		e.dataTransfer.setData('is_extra', is_extra);
	}

	var handleDrop = function(e) {
		if (e.stopPropagation) {
			e.stopPropagation(); // Stops some browsers from redirecting.
		}

	  	var is_extra = e.dataTransfer.getData('is_extra');

	  	var x = e.clientX;
	  	var y = e.clientY;
		e.preventDefault();
	  	var rect =  $('#map')[0].getBoundingClientRect();

	    x = x - rect.left;
	    y = y - rect.top;

	    var pos = this.wiese.map.getCoordinateFromPixel([x, y]);
	    var lonlat = ol.proj.transform(pos, 'EPSG:3857', 'EPSG:4326');

	    var tree_form = new TreeForm(null, this.wiese);
			tree_form.set_wiese(this.wiese);
			tree_form.set_lon_lat(lonlat[0], lonlat[1]);

	    if(is_extra == "true"){
	    	tree_form.set_extra_anlegen(true);
	    };

	    tree_form.show_form();

	  	return false;
	}.bind(this);

	var handleDragOver = function(e) {
	  if (e.preventDefault) {
	    e.preventDefault(); // Necessary. Allows us to drop.
	  }


	  return false;
	}


	$('*[data-dragname="tree_icon_drag"]').get(0).addEventListener('dragstart', function(e){handleDragStart(e, false)}, false);
	$('*[data-dragname="extra_icon_drag"]').get(0).addEventListener('dragstart', function(e){handleDragStart(e, true)}, false);

	$('#map').get(0).addEventListener('drop', handleDrop, false);
	$('#map').get(0).addEventListener('dragover', handleDragOver, false);

};

WieseSubmenuHelper.prototype.set_wiese = function(wiese){this.wiese = wiese; };

WieseSubmenuHelper.prototype.set_trees = function(trees){this.trees = trees };

WieseSubmenuHelper.prototype.set_size_of_box = function(){
	//make box coorect size
	var window_height = $(window).height();
	var side_bar_offset = $('#header_submenu').offset().top;
	var menu_header_height = $('#header_submenu').outerHeight();
	$('#sub_box_menu').height(window_height - side_bar_offset - menu_header_height - 35);
}

WieseSubmenuHelper.prototype.fill = function(){
	this.set_size_of_box();
	//fill the submenus with data
	this.fill_info_box();
	this.fill_baume_box();
	this.fill_filter_box();
	this.init_print_btn();
	//make icons draggable
	this.start_drag_action();

	$('#checkboxAll').click();
		$('input[type="checkbox"]').change(function () {
	    if ($('input[type="checkbox"]').is(':checked')) {
		this.wiese.place_trees_on_map(goOverCheckboxes(this.wiese));
	    } else {
		this.wiese.place_trees_on_map(goOverCheckboxes(this.wiese));
	    }
		}.bind(this));


}

WieseSubmenuHelper.prototype.init_print_btn = function(){
 	var print_options = $('#print_options li');

 	var that = this;

 	var print_helper = new PrintHelper();

 	print_options.click(function(){
 		var selected_option = $(this).data('option');

        var content = $('<div/>', {});

 		if(selected_option == "complete_map"){
 			//Zentriere auf aktuellen Auschnitt
			that.wiese.focus_map_on_extent();

 			content.append($('<h1>', {text: "Kartenübersicht"}));
 			content.append($('<img/>', {id: "xyz"}));

 			print_helper.set_map(that.wiese.map, "xyz");
 			print_helper.set_content(content);
 		}else if(selected_option == "map_sector"){
 			content.append($('<h1>', {text: "Kartenauschnitt"}));
 			content.append($('<img/>', {id: "xyz"}));

 			print_helper.set_map(that.wiese.map, "xyz");
 			print_helper.set_content(content);
 		}

 		print_helper.print();

 	});
}

WieseSubmenuHelper.prototype.fill_info_box = function(){
	$('#wiesenName').html(this.wiese.name);

	var info_box = $('#wiesen_info_tab');

	if(this.wiese.getArea()){
		info_box.append($('<p/>',{html: "Flächeninhalt: " + this.wiese.getArea() + " m" + "<sup>2</sup>"}));
	};

	if(this.trees){
		var len = Object.keys(this.trees).length;
		info_box.append($('<p/>', {html: "Anzahl B&auml;ume: " + len}))
	}

	var newestTimestamp = 0;
	for (var key in this.trees) {
   var obj = this.trees[key];
   if (obj.timestamp > newestTimestamp) {
	newestTimestamp = obj.timestamp;
   }
}
	var dateUpdated = new GermanTime( newestTimestamp).getDate();


	var dateCreated = new GermanTime( this.wiese.data.timestamp).getDate();



	info_box.append($('<p/>', {text: "Zuletzt bearbeitet: " + dateUpdated}));
	info_box.append($('<p/>', {text: "Erstellt: " +  dateCreated}));

	var weather_box = $('#wetter_info_tab');
	var weather_helper = new Weather();
		weather_helper.set_render_box(weather_box);
		weather_helper.render();

	//Make random selection between weather and Info if Possible
		if(weather_helper.is_already_loaded()){
			//dann kann man random auswahl machen
			var random_factor = Math.floor(Math.random() * 2) + 1;
			$('#sub_menu_info .nav li a').get(random_factor - 1).click();
		};


	if(sessionStorage.getItem('user') == 'Offline') {
		$('#buttonOrchardOffline').attr('disabled', 'disabled' );
	}

	$('#buttonOrchardOffline').click(function(){
		this.wiese.save_map_for_offline_use();
		makeAvailableOffline(this.wiese.name, this.wiese.data);
		$('#myModalOrchard').modal('show');
	}.bind(this));
};

WieseSubmenuHelper.prototype.fill_baume_box = function(){
	var renderd_trees = RenderHelper.get_renderd_trees(this.wiese);
	var ele;

	if(renderd_trees.length > 0){
		ele = $('<div/>', {class: "list-group"});

		renderd_trees.forEach(function(rend_tree){
			ele.append(rend_tree);
		});

	}else{
		//wiese besitzt keine baume
		ele = $('<div/>', {class: "well", text: "Sie haben noch keine Bäume auf ihrer Wiese plaziert"});
	}

	$('#trees_list').html(ele)
}

WieseSubmenuHelper.prototype.fill_filter_box = function(){

var allSorts = getAllSortNames(this.trees)

	for (var i = 0; i < allSorts.length; i++) {
	var checkboxDiv = document.createElement('div');
	checkboxDiv.className = "checkbox";

	var checkbox = document.createElement('input');
	checkbox.type = "checkbox";
	checkbox.name = "filterSort";

	var label = document.createElement('label')
	var container = $('#sub_menu_filter');
	container.append(checkboxDiv);
	checkboxDiv.appendChild(label);
	label.appendChild(checkbox);
	var labelText = allSorts[i];
	if (typeof labelText === 'undefined') {
		labelText = "extra";
	}
	checkbox.value = labelText;
	label.appendChild(document.createTextNode(labelText));
	}

}

WieseSubmenuHelper.prototype.get_submenu_btn = function(menu){
	var data_attr = menu.submenu;
	return $('*[data-submenu="' +  data_attr + '"]');
}

WieseSubmenuHelper.prototype.get_submenu_box = function(menu){
	var id = menu.submenu;
	return $('#' + this.boxes_id).find("#sub_menu_" + id);
}

WieseSubmenuHelper.prototype.make_all_unactive = function(){
	this.menu_keys().forEach(function(menu_key){
		var menu = this.menus[menu_key];

		var btn = this.get_submenu_btn(menu);
		var text = btn.text();
			btn.removeClass("active");
			btn.html($('<a/>', {href: "#", text: text}));
			btn.unbind( "click" );
			btn.click(function(){
				this.make_active(menu)
			}.bind(this));

		var submenu_box = this.get_submenu_box(menu);
			submenu_box.hide();
	}.bind(this));
}

WieseSubmenuHelper.prototype.make_active = function(menu){
	//erst alle menü unterpunkte ausblenden
	this.make_all_unactive();
	//dann nur den gewünschten zeigen
	var active_btn = this.get_submenu_btn(menu);
	var text = active_btn.text();
		active_btn.addClass("active");
		active_btn.unbind( "click" );
		active_btn.html(text);

	var active_box = this.get_submenu_box(menu);
		active_box.show();
}


WieseSubmenuHelper.prototype.show_info = function() {
	this.make_active(this.menus.info);
};

WieseSubmenuHelper.prototype.show_single_tree = function(tree_key){
	var general_menu = $('#right_menu_map #general_right_submenu');
	var tree_submenu_box = $('#right_menu_map #tree_right_submenu');

	var tree_obj = new Tree()
		tree_obj.from_server_obj(this.trees, tree_key);
		tree_obj.wiese = this.wiese;

	tree_submenu_box.load("html/tree/tree_menu.html", function(){

		this.display_tree_information(tree_key, tree_obj);

		//wenn schliesen geklickt wird dann zuruck zum menu
		$('#cancel_tree_view').click(function(){
			general_menu.show();
			tree_submenu_box.hide();
		});
		//bei bearbeiten zum Baum leiten
		$('#edit_tree').click(function(){
			new TreeForm(tree_obj).show_form();
		}.bind(this));

		general_menu.hide();
		tree_submenu_box.show();
	}.bind(this));
}

WieseSubmenuHelper.prototype.display_tree_information = function(tree_key, tree){
	var obstarten = this.wiese.obstarten;
	//gets invoked by show_single_tree
	//die die dargestellt werden sollen
	var form_rows = [{
		id: "tree_submenu_row",
		fields: [
		{	id: TreeAttr.name.id,
			form: Form.Text,
			title: TreeAttr.name.title,
			disabled: true
		},
		{	id: TreeAttr.obstart.id,
			form: Form.Dropdown,
			options: Obst.getArten(obstarten),
						//when another value gets selected
			onchange: function(val){
				new ObstFormHelper(obstarten).change_sorten_dropdown(val);
			},
			title: TreeAttr.obstart.title,
			disabled: true
		},

		{	id: TreeAttr.sortname.id,
			form: Form.Dropdown,
			options: [],
			title: TreeAttr.sortname.title,
			disabled: true},
		{
			id: TreeAttr.anmerkungen.id,
			form: Form.Textarea,
			rows: 3,
			title: TreeAttr.anmerkungen.title,
			disabled: true,
			extra: true
		}
		]
	}];

	//helps us to display the forms
	var treeform = new TreeForm(tree);
		treeform.render_forms(form_rows);
		treeform.fill_forms_if_tree_already_exists(form_rows);

	var tree_bezeichnung = RenderHelper.get_tree_bezeichnung(this.trees, tree_key);


	$('#tree_submenu_bezeichnung').text(tree_bezeichnung);
	$('#tree_submenu_key').text(tree_key);

	var url = "";

    if((typeof tree.extra === 'undefined') || !tree.extra){
        //normaler baum
        var imgName = new URL(tree.sortname);
            url = "img/treeicons/" + imgName.getUrl();
    }else{
        //ist ein extra
        url = ImageHelper.get_normal_image_from_id(tree.icon);
    }

	$('#tree_submenu_image').attr('src', url);
}


function getNewestTreeTimestamp() {

}


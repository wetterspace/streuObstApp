var ObstEditor = function(obstarten){
	this.in_edit_mode = null;

	this.obst_object = Obst.Arten;

	if(obstarten){
		this.obst_object = obstarten;
	}

	return this;
};

ObstEditor.prototype.getArten = function(){
	return Object.keys(this.obst_object);
};

ObstEditor.prototype.getSorten = function(art){
	return this.obst_object[art];
};

ObstEditor.prototype.render_obstart = function(box, art, element){
	var that = this;

	var entry = $('<a/>', {class: "list-group-item", text: art, click: function(){
			that.list_sorten(art);

			$('#obstarten_liste a').removeClass('active_element');
			$(this).addClass('active_element');
		}
	});

	entry.append($('<span/>', {class: "glyphicon glyphicon-remove delete_ic", "aria-hidden": "true", click: function(){
	   		$(this).parent().remove();
	   		that.art_remove(art);
	   } }))
	 .append($('<span/>', {class: "glyphicon glyphicon-pencil edit_ic", "aria-hidden": "true", click: function(){

	 	var old_text = $(this).parent().text();
		var parent_element = $(this).parent();

		var inpu = $('<input/>', {value: old_text});

		parent_element.unbind();

		parent_element.html(inpu).append(
			$('<span/>', {class: "glyphicon glyphicon-ok save_ic", "aria-hidden": "true", click: function(){
				var new_art = inpu.val().trim();

				if(new_art.length != 0 && (!that.obst_object[new_art] || old_text == new_art)){

					that.art_rename(old_text, new_art);

					that.render_obstart(null, new_art, entry);
				}

			}})
		);

	 } }));

	 if(element){
	 	element.replaceWith(entry);
	 }else{
	 	box.append(entry);
	 }
}

ObstEditor.prototype.list_obstarten = function(){
	var list = $('#obstarten_liste');
		list.html('');
	this.getArten(this.obst_object).forEach(function(art){

		this.render_obstart(list, art);

	}.bind(this));

	var that = this;

	var new_art_btn = $('#add_art_btn');
	new_art_btn.unbind();
	new_art_btn.bind("click", function(argument) {

		var inpu = $('<input/>', {});
		var ele = $('<li/>', {class: "list-group-item", html: inpu});
			ele.append(
			$('<span/>', {class: "glyphicon glyphicon-ok save_ic", "aria-hidden": "true", click: function(){
				parent_element = ele;
				var new_art = inpu.val().trim();

				if(new_art.length != 0 && !that.obst_object[new_art]){
					that.art_add(new_art);

					that.render_obstart(null, new_art, parent_element);
				}

			}})
		);

		list.append(ele);
	});
};

ObstEditor.prototype.art_add = function(new_art){
	this.obst_object[new_art] = [];

	this.save_changes();
};

ObstEditor.prototype.art_rename = function(old_name, new_name){
	var old_values = this.obst_object[old_name];

	delete this.obst_object[old_name];

	this.obst_object[new_name] = old_values;

	this.save_changes();
}

ObstEditor.prototype.control_in_edit_mode = function(){
	if(this.in_edit_mode){
		this.render_sorte(null, this.in_edit_mode.ele, {Name: this.in_edit_mode.tag}, this.in_edit_mode.art);
		this.in_edit_mode = null;
	}
};

ObstEditor.prototype.art_remove = function(art){
	delete this.obst_object[art];

	var list1 = $('#sorten_liste1');
		list1.html('');

	var list2 = $('#sorten_liste2');
		list2.html('');

	$('#obstarten_liste a')[0].click();

	this.save_changes();
}

ObstEditor.prototype.sorte_remove = function(remov_sorte, art){
	var sorten = [];

	this.getSorten(art).forEach(function(sorte){
		if(sorte.Name != remov_sorte.Name){
			sorten.push(sorte);
		}
	});

	this.obst_object[art] = sorten;
	this.save_changes();
}

ObstEditor.prototype.sorte_add = function(add_sorte, art) {
	this.obst_object[art].unshift(add_sorte);
	this.save_changes();
};

ObstEditor.prototype.render_sorte = function(box, element , sorte, art){
	var that = this;
	var ele = $('<li/>', {class: "list-group-item", text: sorte.Name});

	ele.append($('<span/>', {class: "glyphicon glyphicon-remove delete_ic", "aria-hidden": "true",  click: function(){
		$(this).parent().remove();

		that.sorte_remove(sorte, art);
	} }));

	ele.append($('<span/>', {class: "glyphicon glyphicon-pencil edit_ic", "aria-hidden": "true", click: function(){
		that.control_in_edit_mode();

		var old_text = $(this).parent().text();
		var parent_element = $(this).parent();

		that.in_edit_mode = {ele: parent_element, tag: old_text, art: art};

		var inpu = $('<input/>', {value: old_text});

		parent_element.html(inpu).append(
			$('<span/>', {class: "glyphicon glyphicon-ok save_ic", "aria-hidden": "true", click: function(){
				var new_value = inpu.val().trim();

				if(new_value.length != 0  && (that.sorte_not_yet_created(new_value, art) || new_value == sorte.Name)){
					var new_sorte = {Name: new_value};

					that.sorte_remove(sorte, art);
					that.sorte_add(new_sorte, art);

					that.render_sorte(null, parent_element, new_sorte, art);
				}

			}})
		);
	} }));

	if(element){
		element.replaceWith(ele);
	}else{
		box.append(ele);
	}
}


ObstEditor.prototype.get_obst_object = function(){
	return this.obst_object;
};

ObstEditor.prototype.save_changes = function(){
	var username = sessionStorage.getItem('user');

	if(username && !(typeof username === 'undefined')){
		new DB().getUserDB().child(username).child('obstarten').set(this.get_obst_object(), function(err){
			//da muss wahrscheinlich offline auch gespeichert werden
		});
	}else{
		alert("Derzeit nicht möglich");
	}
}

ObstEditor.prototype.list_sorten = function(obstart){
	var list1 = $('#sorten_liste1');
		list1.html('');

	var list2 = $('#sorten_liste2');
		list2.html('');

		$('#sorten-header').text("Sorte - " + obstart);

	var i = 0;
	this.getSorten(obstart).forEach(function(sorte){
		var box = list2;
		if(i % 2 == 0){
			box = list1;
		}

		this.render_sorte(box, null, sorte, obstart);

		i++;
	}.bind(this));

	var that = this;

	var new_sorte_btn = $('#add_sorte_btn');
		new_sorte_btn.unbind();
		new_sorte_btn.bind("click", function(argument) {

			var inpu = $('<input/>', {});
			var ele = $('<li/>', {class: "list-group-item", html: inpu});
				ele.append(
				$('<span/>', {class: "glyphicon glyphicon-ok save_ic", "aria-hidden": "true", click: function(){
					parent_element = ele;
					var new_value = inpu.val().trim();

					if(new_value.length != 0 && that.sorte_not_yet_created(new_value, obstart)){
						var new_sorte = {Name: new_value};

						that.sorte_add(new_sorte, obstart);

						that.render_sorte(null, parent_element, new_sorte, obstart);
					}

				}})
			);

			list1.append(ele);
		});
};

ObstEditor.prototype.sorte_not_yet_created = function(new_sorte, art){
	var already_exists = true;

	this.getSorten(art).forEach(function(sorte){
		if(sorte.Name == new_sorte.trim()){
			already_exists = false;
		}
	});

	return already_exists;
}

ObstEditor.prototype.show = function() {

	var show_menu = function(){

		this.list_obstarten();

		$('#obstarten_liste a')[0].click();



	}.bind(this);

	$('#HauptFenster').load('./html/obst/obst_editor.html', show_menu);
};
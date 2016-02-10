var RenderHelper = {

	get_tree_bezeichnung: function(trees, key){
		var tree = trees[key];
		var bezeichnung = key;

		//falls bez/name hat dann diesen anzeigen
		if(tree[TreeAttr.name.id]){
			bezeichnung = tree[TreeAttr.name.id];
		//falls kein name dann sortnamen, existiert dieser nicht
		//wird immer noch firebase-id angezeigt
		}else if(tree[TreeAttr.sortname.id]){
			bezeichnung = tree[TreeAttr.sortname.id];
		}

		return bezeichnung;
	},

	//returns array with tree list items
	get_renderd_trees: function(wiese){
		var elements = []

		if(wiese.data.trees){
			Object.keys(wiese.data.trees).forEach(function(key){

				var tree = wiese.data.trees[key];
				var sort = tree[TreeAttr.sortname.id];

				//TODO Könnte man weg tun Emmanuel  //wie man will
				//do not render extras
				if((typeof tree.extra === 'undefined') || !tree.extra){

					var bezeichnung = RenderHelper.get_tree_bezeichnung(wiese.data.trees, key);

					var list_group_item = $('<a/>', {class: "list-group-item", href: "#"}).append(
												$('<h4/>', {class: "list-group-item-heading", text:  bezeichnung})
											);
					if(bezeichnung != key){
						list_group_item.append(
								$('<p/>', {style: "font-size: 12px", class: "list-group-item-text",  text: key})
							);
					}

					$(list_group_item).click(function(){
						var tree_obj = new Tree()
							tree_obj.from_server_obj(wiese.data.trees, key);
							tree_obj.wiese = wiese;

						new TreeForm(tree_obj).show_form();
					}.bind(this));

					elements.push(list_group_item);
				};
			}.bind(this));
		}else{
			//Wiese hat noch keine Bäume
		}

		return elements;

	}
}
var RenderHelper = {

	//returns array with tree list items
	get_renderd_trees: function(wiese){
		var elements = []

		if(wiese.data.trees){
			Object.keys(wiese.data.trees).forEach(function(key){

				var tree = wiese.data.trees[key];
				var sort = tree[TreeAttr.sortname.id];

				var list_group_item = $('<a/>', {class: "list-group-item", href: "#"}).append(
											$('<h4/>', {class: "list-group-item-heading", text:  key})
										).append(
											$('<p/>', {class: "list-group-item-text", text: sort})
										);

				$(list_group_item).click(function(){
					var tree_obj = new Tree()
						tree_obj.from_server_obj(wiese.data.trees, key);
						tree_obj.wiese = wiese;

					new TreeForm(tree_obj).show_form();
				}.bind(this));

				elements.push(list_group_item);
			}.bind(this));
		}else{
			//Wiese hat noch keine Bäume
		}

		return elements;

	}
}
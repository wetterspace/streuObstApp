var ObstFormHelper = function(obstarten){
	this.obstarten = obstarten;
};

ObstFormHelper.prototype.change_sorten_dropdown = function (art_key) {
	console.log(this.obstarten);
	var sorten = Obst.getSorten(art_key, this.obstarten);

	var sortenDropdwon = $("#" + TreeAttr.sortname.id);
		//empty options before select new ones
		sortenDropdwon.find('option').remove();

	if(sorten){
		sorten.forEach(function(sorte) {
			sortenDropdwon.append($("<option />").val(sorte.Name).text(sorte.Name));
		});
	}
}

var TreeFormHelper = {};

TreeFormHelper.create_tree_object_from_fields = function(form_rows, is_extra_form){
	var tree = new Tree();

	form_rows.forEach(function(row){

		if(row.fields){
			row.fields.forEach(function(field){
				//zwiege nur wenns kein exta type is also Baum oder Special und Form mit dem Field
				if(is_extra_form == false ||  (field.extra && field.extra == true) ){
					//get the value of the field
					var val = Form.get_value_for(field);
					//add it to the tree object
					tree[field.id] = val;
				}
			});
		}

	});

	return tree;
};
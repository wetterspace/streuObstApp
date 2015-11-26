var TreeFormHelper = {};


TreeFormHelper.change_sorten_dropdown = function (art_key) {
	var sorten = Obst.getSorten(art_key);

	var sortenDropdwon = $("#" + TreeAttr.sortname.id);
		//empty options before select new ones
		sortenDropdwon.find('option').remove();


	sorten.forEach(function(sorte) {
		sortenDropdwon.append($("<option />").val(sorte.Name).text(sorte.Name));
	});

}


TreeFormHelper.create_tree_object_from_fields = function(form_rows){
	var tree = new Tree();

	form_rows.forEach(function(row){

		if(row.fields){
			row.fields.forEach(function(field){
				//get the value of the field
				var val = Form.get_value_for(field);
				//add it to the tree object
				tree[field.id] = val;	
			});
		}
		
	});

	return tree;
};
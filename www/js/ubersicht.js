var Ubersicht = function(){
	//set it in set_wiese
	this.wiese = null;
}


Ubersicht.prototype.set_wiese = function(wiese) {
	this.wiese = wiese;
};

Ubersicht.prototype.list_trees_in_container = function(container){
	var renderd_trees = RenderHelper.get_renderd_trees(this.wiese);
	var ele;

	if(renderd_trees.length > 0){
		ele = $('<div/>');
		//add header
		ele.append($('<div/>', {class: "col-lg-12"}).append(
				$('<h4/>', {text: "Baumübersicht"})
			).append(
				$('<hr/>')
			));

		var elements = [$('<div/>', {class: 'col-md-4'}),$('<div/>', {class: 'col-md-4'}),$('<div/>', {class: 'col-md-4'})];
		var list_elements = [$('<div/>', {class: "list-group"}), $('<div/>', {class: "list-group"}),$('<div/>', {class: "list-group"})];


		var i = 0;

		renderd_trees.forEach(function(rend_tree){
			list_elements[i].append(rend_tree);
			i+=1;
			if(i == 3){
				i = 0;
			}
		});

		for(var s=0; s < elements.length; s+=1){
			elements[s].append(list_elements[s]);
			ele.append(elements[s]);
		};
	}else{
		//es exestieren keine Bäume auf der Wiese
		ele = $('<div/>', {class: "well", text: "Sie haben noch keine Bäume auf ihrer Wiese plaziert"});
	}

	container.html(ele)
};

Ubersicht.prototype.show = function(){
	//clear screen
	var container = $('#HauptFenster');
		container.html('');

	//pass wiese
	NavbarHelper.make_karte_and_ubersicht_and_baum_anlegen_and_user_clickable(this.wiese);
	//show active karte btn
	NavbarHelper.make_active(NavbarHelper.btn.ubersicht);


	this.list_trees_in_container(container);
}
var Wiese = function(name){
	this.name = name;
};

Wiese.prototype.getWiesenDataFromServer = function(callbac){

	new DB().getWiesenDB().child(this.name).once("value", function(snapshot){
		var wiesenData = snapshot.val();

		this.data = wiesenData;
console.log(this.data);
		callbac();

	}.bind(this));
}

Wiese.prototype.getDB = function(){
	return new DB().getWiesenDB().child(this.name);
};

Wiese.prototype.init_map = function(){

	var vectorSource = new ol.source.Vector({});
	console.log(this.data.trees);
	
	
	Object.keys(this.data.trees).forEach(function(treeKey){
	
	var tree = this.data.trees[treeKey];
	var lon = parseFloat(tree.lon);
	var lat = parseFloat(tree.lat);
	
	var treeDot = ol.proj.fromLonLat([lon,lat]);
	var treePoint = new ol.geom.Point(treeDot);
	
	var polyFeature = new ol.Feature({
		geometry: treePoint
	});
	
	vectorSource.addFeature(polyFeature);
	}.bind(this));

    //create polygon from Wiesen coordinates
    var polyFeature = new ol.Feature({
        geometry: new ol.geom.Polygon(
            this.data.coordinates
        )
    });
	vectorSource.addFeature( polyFeature );

    var wiesenlayer = new ol.layer.Vector({
        source: vectorSource
    });

    //make map fullsize
    var window_height = $(window).height();
    var map_offset = $('#map').offset().top;

    $('#map').height(window_height - map_offset - 10);

	this.map = new ol.Map({
        target: 'map',
        layers: [
          new ol.layer.Tile({
            source: new ol.source.OSM()
          }),
          wiesenlayer
        ]
    });

    this.map.getView().fit(polyFeature.getGeometry().getExtent(), this.map.getSize());
}

Wiese.prototype.list_trees = function(){
	var ele;

	if(this.data.trees){
		ele = $('<div/>', {class: "list-group"});

		Object.keys(this.data.trees).forEach(function(key){

			var tree = this.data.trees[key];
			var sort = tree[TreeAttr.sortname.id];

			var list_group_item = $('<a/>', {class: "list-group-item", href: "#"}).append(
										$('<h4/>', {class: "list-group-item-heading", text:  key})
									).append(
										$('<p/>', {class: "list-group-item-text", text: sort})
									);

			$(list_group_item).click(function(){
				var tree_obj = new Tree()
					tree_obj.from_server_obj(this.data.trees, key);
					tree_obj.wiese = this;
					
				new TreeForm(tree_obj).show_form();
			}.bind(this));

			ele.append(list_group_item);
		}.bind(this));

	}else{
		ele = $('<div/>', {class: "well", text: "Sie haben noch keine Bäume auf ihrer Wiese plaziert"});
	}
	
	$('#trees_list').html(ele)
};

Wiese.prototype.init_page = function() {
	$('#wiesenName').html(this.name);

	this.list_trees();

	$('#buttonCreateTree').click(function(){
		var tree_form = new TreeForm();
			tree_form.set_wiese(this);
			tree_form.show_form();
	}.bind(this));
};

Wiese.prototype.init = function(){

	this.getWiesenDataFromServer(function(){
		//callback
		this.init_page();
		this.init_map();
		
	}.bind(this));
}


Wiese.prototype.show = function() {
	$('#HauptFenster').load('./html/wiese/show.html', this.init.bind(this));
};
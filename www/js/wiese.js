var Wiese = function(name){
	this.name = name;

	//jedes mal wenn man eine Wiese neu anklickt wird gecheckt ob 
	//der auschnitt schon vollständig heruntergeladen ist. Wenn nicht 
	// wird fortgefahren zu downloaden
	this.finished_downloading_map_tiles = false;
};

Wiese.prototype.getWiesenDataFromServer = function(callback){

if(sessionStorage.getItem('user') == 'Offline') {
	var wiesenData = findOrchardInLocalStorage(this.name);

	var treeArray = getTreesForOrchardOffline(this.name);
	
	
	console.log(treeArray);
	
	var treeM = {
			//	hulu: value
			};
	
	$.each(treeArray, function(index, value) {
		value.wiese = this;
		var treeName = 'Lat: ' + value.lat + ', Long: ' + value.lon;
		treeM[treeName] = value;
		
		wiesenData.trees = treeM;
	}); 
	this.data = wiesenData;
	
	console.log(this.data.trees);
	console.log(this.data);
	callback();
}else {
getOrchard(this.name, function(snapshot) {
		var wiesenData = snapshot.val();
		this.data = wiesenData;

		console.log(this.data);
		callback();
}.bind(this));
}

}

function setDataOffline(key) {
		var wiesenData = findOrchardInLocalStorage(key)
		this.data = wiesenData;
		console.log(this.data);
		callback();
}


Wiese.prototype.getDB = function(){
	return new DB().getWiesenDB().child(this.name);
};


Wiese.prototype.place_trees_on_map = function(vectorSource){
	if(this.data.trees){
		Object.keys(this.data.trees).forEach(function(treeKey){

			var tree = this.data.trees[treeKey];
			//check that tree has real coordinates
			if(!( isNaN(parseFloat(tree.lon)) ||  isNaN(parseFloat(tree.lat)) )){

				var lon = parseFloat(tree.lon);
				var lat = parseFloat(tree.lat);

				var treeDot = ol.proj.fromLonLat([lon,lat]);
				var treePoint = new ol.geom.Point(treeDot);

				var polyFeature = new ol.Feature({
					geometry: treePoint
				});

				vectorSource.addFeature(polyFeature);
			}

		}.bind(this));
	};
}

Wiese.prototype.init_map = function(){

	var vectorSource = new ol.source.Vector({});

	this.place_trees_on_map(vectorSource);


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
          MapHelper.TileLayer(),
          wiesenlayer
        ]
    });

    this.map.getView().fit(polyFeature.getGeometry().getExtent(), this.map.getSize());

    //make it avaible offline download if not already completed
    if(this.finished_downloading_map_tiles == false){
    	MapHelper.saveTileLayersFor(this, this.map.getView(), polyFeature.getGeometry().getExtent());
    }
}

Wiese.prototype.list_trees = function(){
	var renderd_trees = RenderHelper.get_renderd_trees(this);
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
};

function setUpOfflineButton() {

}


Wiese.prototype.init_page = function() {
	$('#wiesenName').html(this.name);

	this.list_trees();


	//show_all_buttons_of_navbar
	NavbarHelper.show_all_btns();
	//pass wiese
	NavbarHelper.make_karte_and_ubersicht_and_baum_anlegen_and_user_clickable(this);
	//show active karte btn
	NavbarHelper.make_active(NavbarHelper.btn.karte);

	$('#buttonCreateTree').click(function(){
		var tree_form = new TreeForm();
			tree_form.set_wiese(this);
			tree_form.show_form();
	}.bind(this));
	
	if(sessionStorage.getItem('user') == 'Offline') {
	$('#buttonOrchardOffline').attr('disabled', 'disabled' );
	}
	
	$('#buttonOrchardOffline').click(function(){
		makeAvailableOffline(this.name, this.data);
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
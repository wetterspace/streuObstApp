var Wiese = function(name){
	this.name = name;
	//handles menu at right side
	this.submenu = null;
};

Wiese.prototype.getArea = function(){
	//in quadradtmeter
	if(this.data.coordinates){
		var polygon = new ol.geom.Polygon(this.data.coordinates);
		var area = polygon.getArea();

		return  (Math.round(area * 100) / 100);
	}else{
		return null;
	}
}

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
	//	var treeName = 'Lat: ' + value.lat + ', Long: ' + value.lon;
		var treeName = index;
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

		//console.log(this.data);
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
          new ol.layer.Tile({
            source: new ol.source.OSM()
          }),
          wiesenlayer
        ]
    });

    this.map.getView().fit(polyFeature.getGeometry().getExtent(), this.map.getSize());
}

function setUpOfflineButton() {

}

Wiese.prototype.init_page = function() {
	//pass wiese //make visible
	NavbarHelper.make_karte_and_ubersicht_and_baum_anlegen_and_user_clickable(this);
	//show active karte btn
	NavbarHelper.make_active(NavbarHelper.btn.karte);

	this.submenu = new WieseSubmenuHelper();
	this.submenu.set_wiese(this);
	this.submenu.set_trees(this.data.trees);
	//fill submenus like info baume etc
	this.submenu.fill();
	//soll info menu zeigen
	this.submenu.show_info();
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
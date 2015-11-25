var Wiese = function(name, password){
	this.name = name;
	this.password = password;
};

Wiese.prototype.getWiesenDataFromServer = function(callbac){

	new DB().getWiesenDB().child(this.name).once("value", function(snapshot){
		var wiesenData = snapshot.val();

		this.data = wiesenData;
console.log(this.data);
		callbac();

	}.bind(this));
}

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

Wiese.prototype.init_page = function() {
	$('#wiesenName').html(this.name);
	$('#buttonCreateTree').click(function(){
		$('#HauptFenster').load("./html/menu/createTree.html",function(){
			Tree(this);
		}.bind(this));
	}.bind(this));
};

Wiese.prototype.init = function(){

	this.getWiesenDataFromServer(function(){
		//callback
		this.init_map();
		this.init_page();
	}.bind(this));
}


Wiese.prototype.show = function() {
	$('#HauptFenster').load('./html/wiese/show.html', this.init.bind(this));
};
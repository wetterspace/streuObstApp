var Wiese = function(name){
	this.name = name;
};

Wiese.prototype.getWiesenDataFromServer = function(callbac){

	new DB().getWiesenDB().child(this.name).once("value", function(snapshot){
		var wiesenData = snapshot.val();
		this.data = wiesenData;

		callbac();

	}.bind(this));
}

Wiese.prototype.init_map = function(){
    var vectorSource = new ol.source.Vector({});
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
Wiese.prototype.init_on_click_on_map = function(){
	//Initialisiert was passiert wenn auf Map geklickt wird
	this.map.on("click", function(e) {
		this.map.forEachFeatureAtPixel(e.pixel, function (feature, layer) {

		   	if(feature.get("name_type") == "tree"){
		   		//show tree in menu at right side
		   		this.submenu.show_single_tree(feature.get("key"));
		   	}

		}.bind(this));
	}.bind(this));
}

Wiese.prototype.place_trees_on_map = function(){
	if(this.data.trees){
		this.init_on_click_on_map();

		var vectorSource = new ol.source.Vector({});

		Object.keys(this.data.trees).forEach(function(treeKey){

			var tree = this.data.trees[treeKey];
			//check that tree has real coordinates
			if(!( isNaN(parseFloat(tree.lon)) ||  isNaN(parseFloat(tree.lat)) )){

				var lon = parseFloat(tree.lon);
				var lat = parseFloat(tree.lat);

				var treeDot = ol.proj.fromLonLat([lon,lat]);
				var treePoint = new ol.geom.Point(treeDot);

				var l1 = treeDot[0];
				var l2 = treeDot[1];

				var extent = [l1 - 5, l2 - 5,l1 + 5,l2 + 5];

				//Bilder welche random als Baum eingesetzt werden
				var images = ['Apfel1.png',
							  'Apfel2.png',
							  'Birne1.png',
							  'Birne2.png',
							  'Kirsche1.png',
							  'Kirsche2.png',
							  'Pflaume1.png',
							  'Pflaume2.png'];

			 	var layer = new ol.layer.Image({
		            source: new ol.source.ImageStatic({
		              url: "img/treeicons/" + images[Math.floor(Math.random() * 8)],
		              imageExtent: extent
		            })
		        });
		        this.map.addLayer(layer);

		        //Dient dazu damit es einen auschnitt gibt wo der User später draufklciken kann
		        var feature = new ol.Feature({
				  geometry: new ol.geom.Polygon.fromExtent(extent),
				  key: treeKey,
				  name_type: 'tree'
				});

		        vectorSource.addFeature(feature);

			}

		}.bind(this));


		var vector = new ol.layer.Vector({
		  source: vectorSource,
		  opacity: 0
		});
		this.map.addLayer(vector);
	};
}
Wiese.prototype.init_on_click_on_map = function() {
    //Initialisiert was passiert wenn auf Map geklickt wird
    this.map.on("click", function(e) {
        this.map.forEachFeatureAtPixel(e.pixel, function(feature, layer) {

            if (feature.get("name_type") == "tree") {
                //show tree in menu at right side
                this.submenu.show_single_tree(feature.get("key"), this);

            }

        }.bind(this));
    }.bind(this));
}

Wiese.prototype.place_trees_on_map = function(treeList) {

    //remove previous tree layers
    for (var i = 0; i < this.layers.length; i++) {
        this.map.removeLayer(this.layers[i]);
    }



    if (treeList) {
        this.init_on_click_on_map();

        var vectorSource = new ol.source.Vector({});

        Object.keys(treeList).forEach(function(treeKey) {

            var tree = treeList[treeKey];
            //check that tree has real coordinates
            if (!(isNaN(parseFloat(tree.lon)) || isNaN(parseFloat(tree.lat)))) {

                var lon = parseFloat(tree.lon);
                var lat = parseFloat(tree.lat);

                var treeDot = ol.proj.fromLonLat([lon, lat]);
                var treePoint = new ol.geom.Point(treeDot);

                var l1 = treeDot[0];
                var l2 = treeDot[1];

                var extent = [l1 - 5, l2 - 5, l1 + 5, l2 + 5];

                var url = "";

                if((typeof tree.extra === 'undefined') || !tree.extra){
                    //normaler baum
                    var imgName = new URL(tree.sortname);
                    url = "img/treeicons/" + imgName.getUrl();
                }else{
                    //ist ein extra
                    url = ImageHelper.get_normal_image_from_id(tree.icon);
                }


                var layer = new ol.layer.Image({
                    source: new ol.source.ImageStatic({
                        url: url,
                        imageExtent: extent
                    })
                });

                var layers = this.layers;
                layers[layers.length] = layer;

                this["layers"] = layers;





                this.map.addLayer(layer);
                layer.set("name", "TreeLayer");

                //Dient dazu damit es einen auschnitt gibt wo der User später draufklciken kann
                var feature = new ol.Feature({
                    geometry: new ol.geom.Polygon.fromExtent(extent),
                    key: treeKey,
                    name_type: 'tree',

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


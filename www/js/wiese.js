    var Wiese = function(name) {
        this.name = name;
        //handles menu at right side
        this.submenu = null;

        this.map_is_avaible_offline = false;

        this.layers = new Array();

        this.check_if_map_is_avaible_offline = function() {
            this.map_is_avaible_offline = localStorage.getItem("map_img_extent" + this.name) && localStorage.getItem("map_img_url" + this.name);
        };
        //execute that only the first time the wiese is initialized
        //and after is made offfline
        //saves memory
        this.check_if_map_is_avaible_offline();
    };

    Wiese.prototype.getArea = function() {
        //in quadradtmeter
        if (this.data.coordinates) {
            var polygon = new ol.geom.Polygon(this.data.coordinates);
            var area = polygon.getArea();

            return (Math.round(area * 100) / 100);
        } else {
            return null;
        }
    }

    Wiese.prototype.getWiesenDataFromServer = function(callback) {

        if (sessionStorage.getItem('user') == 'Offline') {
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
        } else {
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


    Wiese.prototype.getDB = function() {
        return new DB().getWiesenDB().child(this.name);
    };

    Wiese.prototype.save_coordinates = function(coordinates, callback){
        this.getDB().child("coordinates").set(coordinates, function(){
            callback();
        });
    };

    Wiese.prototype.save_image_id = function(image_id, callback){
        this.getDB().child("image_id").set(image_id, function(err){
            //entferne es auch beim user
            if(err){
                alert("Fehler" + err);
            }else{
                new DB().getUserDB().child(sessionStorage.getItem('user')).child("wiesen").child(this.name).child("image_id").set(image_id, function(err){
                     if(err){
                        alert("Fehler" + err);
                    }else{
                        callback();
                    }
                }.bind(this));
            }
        }.bind(this));
    };

    Wiese.prototype.remove = function(){
        //basically repition of save function // offline modus missing
        //simply set null
        this.getDB().set(null, function(err){
            if(err){
                alert("Fehler" + err);
            }else{
                //enterne Wiese auch vom User
                new DB().getUserDB().child(sessionStorage.getItem('user')).child("wiesen").child(this.name).set(null, function(){
                    if(err){
                        alert("Fehler" + err);
                    }else{
                        //dann wird er umgeleitet wiesen ubersicht wird wieder gezeigt
                        new Login();
                    }
                }.bind(this));
            }
        }.bind(this));
    };

    Wiese.prototype.init_map = function() {
        var vectorSource = new ol.source.Vector({});
        //create polygon from Wiesen coordinates
        var polyFeature = new ol.Feature({
            geometry: new ol.geom.Polygon(
                this.data.coordinates
            )
        });

        vectorSource.addFeature(polyFeature);

        var wiesenlayer = new ol.layer.Vector({
            source: vectorSource
        });

        //make map fullsize
        var window_height = $(window).height();
        var map_offset = $('#map').offset().top;

        $('#map').height(window_height - map_offset - 10);

        this.map = new ol.Map({
            target: 'map',
            //layers get filled later
            controls: ol.control.defaults().extend([
                new ol.control.OverviewMap()

            ]),
            layers: []
        });



        //layer für offline img if vorhanden
        if (this.map_is_avaible_offline) {
            var img_layer = new ol.layer.Image({
                source: new ol.source.ImageStatic({
                    url: localStorage.getItem("map_img_url" + this.name),
                    imageExtent: JSON.parse(localStorage.getItem("map_img_extent" + this.name))
                })
            });

            this.map.addLayer(img_layer);
        };
        //layer für openstreetmap
        this.tile_layer = new ol.layer.Tile({
            source: new ol.source.OSM()
        });
        this.map.addLayer(this.tile_layer);
        //layer wo baume drauf platziert sind
        this.map.addLayer(wiesenlayer);

        //Helper method can be found in wiese/wiese_place_trees.js

        this.focus_map_on_extent = function(){
            //center map view to wiese
            this.map.getView().fit(polyFeature.getGeometry().getExtent(), this.map.getSize());
        }

        this.focus_map_on_extent();
    }

    Wiese.prototype.save_map_for_offline_use = function() {
        //get extent of wiese
        var wiese_extent = ol.extent.boundingExtent(this.data.coordinates[0]);
        //move view to geometry so that its visible
        this.map.getView().fit(wiese_extent, this.map.getSize());
        //get current extent of view
        var extent = this.map.getView().calculateExtent(this.map.getSize());
        //only save tile-layer, make all other invisible
        this.map.getLayers().forEach(function(layer) {
            layer.setVisible(false);
        });
        //only show layer with images from openstreetmap
        this.tile_layer.setVisible(true);
        this.map.once('postcompose', function(event) {
            var canvas = event.context.canvas;
            //speicher extent und bild offline
            localStorage.setItem("map_img_url" + this.name, canvas.toDataURL('image/png'));
            localStorage.setItem("map_img_extent" + this.name, JSON.stringify(extent));
            //zeige wieder alle Layer
            this.map.getLayers().forEach(function(layer) {
                layer.setVisible(true);
            });
            //update offline_status of map see init
            this.check_if_map_is_avaible_offline();
        }.bind(this));
        this.map.renderSync();
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

    Wiese.prototype.init = function() {
        this.getWiesenDataFromServer(function() {
            //callback

            this.init_page();
            this.init_map();

            this.place_trees_on_map(goOverCheckboxes(this));
			
			
		var target = this.map.getTarget();
        var jTarget = typeof target === "string" ? $("#" + target) : $(target);
        // change mouse cursor when over marker
        $(this.map.getViewport()).on('mousemove', function (e) {
            var pixel = this.map.getEventPixel(e.originalEvent);
            var hit = this.map.forEachFeatureAtPixel(pixel, function (feature, layer) {
				if(layer.getOpacity() == 0 ) {
				return true;
				}
                
            });
            if (hit) {
                jTarget.css("cursor", "pointer");
            } else {
                jTarget.css("cursor", "");
            }
        }.bind(this));
			
			
        }.bind(this));

    }



    Wiese.prototype.show = function() {
        $('#HauptFenster').load('./html/wiese/show.html', this.init.bind(this));
    }
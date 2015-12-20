RegisterWieseInteractive = function(){
	this.callback = null;
	this.coords = [];
	return this;
};


RegisterWieseInteractive.prototype.set_callback = function(callback) {
	this.callback = callback;
	return this;
};


RegisterWieseInteractive.prototype.init = function(){
 var container = $('#HauptFenster');

 container.load('./html/register/show_interactive_anlegen.html', function(){
 	this.adjust_list_height();

 	this.init_buttons();

 	this.render_coords_in_list();

 }.bind(this));

};

RegisterWieseInteractive.prototype.render_coords_in_list = function(){
	var container = $('#eckpunkte_liste');

	if(this.coords.length ==  0){
		//noch keine coordinaten anglegt
		container.html($('<p/>', {text: "Noch keine Eckpunkte angelegt"}));
	}else{
		var list = $('<ul/>', {class: "list-group"});

		var i = 0;
		this.coords.forEach(function(coord){
			i += 1;
			var ele = $('<li/>', {class: "list-group-item"});
				ele.append($('<p/>', {text: "Punkt " + i}));
				ele.append($('<a/>', {text: "Lon: " + coord.lon + "   Lat: " + coord.lat}));
			list.prepend(ele);
		});

		container.html(list);
	}
}

RegisterWieseInteractive.prototype.add_eckpunkt = function(lon, lat){
	this.coords.push({lon: lon, lat: lat});
	this.render_coords_in_list();
};

RegisterWieseInteractive.prototype.translate_coords_to_polygon = function(){
	var polygon = [];

	this.coords.forEach(function(coord){
		polygon.push(ol.proj.fromLonLat([coord.lon,coord.lat]));
	});

	polygon.push(polygon[0]);

	return [polygon];
}

RegisterWieseInteractive.prototype.init_buttons = function(){
	var that = this;

	$('#buttonCreateEckpunkt').click(function(){
		var current_text = $(this).text();
		$(this).text("Warten! Lädt Position");

		Position.get_current_lon_lat(function(lon,lat){
			that.add_eckpunkt(lon, lat);

			$(this).text(current_text);
		}.bind(this));
	});

	$('#buttonWieseSave').click(function(){
		//muss mindestens drei punkte sein
		if(this.coords.length > 2){
			this.perform_callback();
		}else{
			ErrorHelper.show_error("Sie müssen mindestens drei Eckpunkte anlegen");
		}

	}.bind(this));
}

RegisterWieseInteractive.prototype.adjust_list_height = function(){
	var height_of_view = $(window).height();
 	var top_off = $('#eckpunkte_liste').offset().top;
 	var bottom = $('#save_wiese_group').height();

 	var h = height_of_view - top_off - bottom - 40;

 	$('#eckpunkte_liste').height(h);
}

RegisterWieseInteractive.prototype.perform_callback = function(){
	var map_coords = this.translate_coords_to_polygon();

	var container = $('#HauptFenster').html('<div id="map"></div>');

	var vectorSource = new ol.source.Vector({});

	var polyFeature = new ol.Feature({
        geometry: new ol.geom.Polygon(
            map_coords
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

	var map = new ol.Map({
        target: 'map',
        layers: [
          new ol.layer.Tile({
            source: new ol.source.OSM()
          }),
          wiesenlayer
        ]
    });

    map.getView().fit(polyFeature.getGeometry().getExtent(), map.getSize());

    map.once('postcompose', function(event) {
      var canvas = event.context.canvas;
	  this.callback( canvas.toDataURL('image/png'), map_coords);
    }.bind(this));
}
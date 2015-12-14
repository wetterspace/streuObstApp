MapHelper = {};

MapHelper.tileSize = 256;
MapHelper.urlTemplate = "http://c.tile.openstreetmap.org/{z}/{x}/{y}.png";

MapHelper.TileLayer = function(){
	return new ol.layer.Tile({
      source: new ol.source.XYZ({
        tileSize: MapHelper.tileSize,
        tileUrlFunction: function(tileCoord) {
        //  console.log("Zoom: " + (tileCoord[0] ) + " x: " + tileCoord[1] + " y: " + (-tileCoord[2] -1));

          return MapHelper.get_key(tileCoord[1], (-tileCoord[2] - 1), tileCoord[0] );

        },
        tileLoadFunction: function(title, key){
          var saved_base_64 = localStorage.getItem(key);

        	var img = title.getImage();
        		  img.setAttribute('crossOrigin', 'anonymous');
        		  img.src = saved_base_64;

          if(saved_base_64){
            //console.log("loaded locally");
            //also konnte von localstorage geladen werden
          }else{
            img.src = MapHelper.get_url_from_key(key);
          }
        }
      })
    });
}


MapHelper.get_tiles_for_region = function(tiles, x, y){
  var start_x = x * 2;
  var start_y = y * 2;

  tiles.push([start_x, start_y + 1]);
  tiles.push([start_x, start_y]);
  tiles.push([start_x + 1, start_y + 1]);
  tiles.push([start_x + 1, start_y]);
};

MapHelper.get_tiles = function(arr, in_zoom){
  var zoom = in_zoom +1;

  for(zoom; zoom < 20; zoom += 1){
    var tiles = [];

    if(arr[zoom -1]){
      arr[zoom - 1].forEach(function(last_level){
        MapHelper.get_tiles_for_region(tiles, last_level[0], last_level[1]);
      });
    }else{
      //erstes Level
      MapHelper.get_tiles_for_region(tiles, x, y)
    }

    arr[zoom] = tiles;
  }

  return arr;
};

MapHelper.get_xyz_coords_for = function(x,y, zoom){
	var coord = ol.proj.transform([x, y], 'EPSG:3857', 'EPSG:4326');

	var lat_deg = coord[1];
	var lng_deg = coord[0];

	var lat_rad = lat_deg/180 * Math.PI;
  	var n = Math.pow(2.0, zoom);
  	var x = parseInt((lng_deg + 180.0) / 360.0 * n);
  	var y = (1 + parseInt((1.0 - Math.log(Math.tan(lat_rad) + (1 / Math.cos(lat_rad))) / Math.PI) / 2.0 * n));

  	return {x: x, y: y, z: zoom}
}


MapHelper.getTilesInZoomLevel = function(xyz1, xyz2){
  var tiles = [];
  var x_min = Math.min(xyz1.x, xyz2.x);
  var y_min = Math.min(xyz1.y, xyz2.y);

  var x_max = Math.max(xyz1.x, xyz2.x);
  var y_max = Math.max(xyz1.y, xyz2.y);

  for(var x = x_min; x <= x_max; x += 1){
    for(var y = y_min; y <= y_max; y += 1){
      tiles.push([x, y]);
    }
  }
  return tiles;
}

MapHelper.saveTileLayersFor = function(wiese, view, extent) {
	var zoom = view.getZoom();

	var xyz1 = MapHelper.get_xyz_coords_for(extent[0], extent[1], zoom);
	var xyz2 = MapHelper.get_xyz_coords_for(extent[2], extent[3], zoom);

	var tiles_for_zoom = MapHelper.getTilesInZoomLevel(xyz1, xyz2);

  var arr = {}
      arr[zoom] = tiles_for_zoom;

  var tiles = this.get_tiles(arr, zoom);

  MapHelper.saveSpecifiedTiles(wiese, tiles);
}

MapHelper.get_url_from_key = function(key){
    var splitted = key.split("i");

    return MapHelper.urlTemplate.replace('{z}', splitted[3])
                                .replace('{x}', splitted[1])
                                .replace('{y}', splitted[2]);
};

MapHelper.get_key = function(x,y,z){
  return "i" + x + "i" + y + "i" + z;
}

MapHelper.downloadTile = function(x, y, z){
  if(localStorage.getItem(MapHelper.get_key(x,y,z))){
    //existiert bereits
  }else{
      var img = new Image();
          img.setAttribute('crossOrigin', 'anonymous');
          img.src = MapHelper.get_url_from_key(MapHelper.get_key(x,y,z));

          img.onload = function(){
            var base64 = MapHelper.getBase64Image(img);

            localStorage.setItem(MapHelper.get_key(x,y,z), base64);
          }
  }
}

MapHelper.saveSpecifiedTiles = function(wiese, tiles){
  var zoom_levels = Object.keys(tiles);

  //only save ab Level 17 sonst wären es zu viel
  if(tiles[16]){
    //nicht speichern bei zoom level 16
  }else{
    var finished_downloading = true;

    zoom_levels.forEach(function(zoom_level){
      var zoom_tiles = tiles[zoom_level];
          zoom_tiles.forEach(function(tile){
            if(localStorage.getItem(MapHelper.get_key(tile[0], tile[1], zoom_level))){
              //already downloaded
            }else{
              finished_downloading = false;
              MapHelper.downloadTile(tile[0], tile[1], zoom_level);
            }
          });
    }.bind(this));

    if(finished_downloading){
      wiese.finished_downloading_map_tiles = true;
    }
  }
}

MapHelper.getBase64Image = function(img) {
  var canvas = document.createElement("canvas");
  canvas.width = img.width;
  canvas.height = img.height;
  var ctx = canvas.getContext("2d");
  ctx.drawImage(img, 0, 0);
  var dataURL = canvas.toDataURL("image/png");
  return dataURL
}



















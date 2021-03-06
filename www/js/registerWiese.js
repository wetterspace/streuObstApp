var RegisterWiese = function(opt_wiese_obj){
  //opt_wiese_obj ist optional und wird verwendet wenn die Corrdinaten eines Wiesen obj überschrieben werden sollen
  this.wiese_obj = opt_wiese_obj;

	this.showCard();
};

var init_car = function(wiese_obj){
  //wied ein wiese_obj übergeben bedeuted dies das wiese bereits besteht
      var raster = new ol.layer.Tile({
  source: new ol.source.MapQuest({layer: 'sat'})
});

var source = new ol.source.Vector();

var vector = new ol.layer.Vector({
  source: source,
  style: new ol.style.Style({
    fill: new ol.style.Fill({
      color: 'rgba(255, 255, 255, 0.2)'
    }),
    stroke: new ol.style.Stroke({
      color: '#ffcc33',
      width: 2
    }),
    image: new ol.style.Circle({
      radius: 7,
      fill: new ol.style.Fill({
        color: '#ffcc33'
      })
    })
  })
});


/**
 * Currently drawn feature.
 * @type {ol.Feature}
 */
var sketch;


/**
 * The help tooltip element.
 * @type {Element}
 */
var helpTooltipElement;


/**
 * Overlay to show the help messages.
 * @type {ol.Overlay}
 */
var helpTooltip;


/**
 * The measure tooltip element.
 * @type {Element}
 */
var measureTooltipElement;


/**
 * Overlay to show the measurement.
 * @type {ol.Overlay}
 */
var measureTooltip;


/**
 * Message to show when the user is drawing a polygon.
 * @type {string}
 */
var continuePolygonMsg = 'Click to continue drawing the polygon';


/**
 * Message to show when the user is drawing a line.
 * @type {string}
 */
var continueLineMsg = 'Click to continue drawing the line';

poly = null;
/**
 * Handle pointer move.
 * @param {ol.MapBrowserEvent} evt
 */
var pointerMoveHandler = function(evt) {
  if (evt.dragging) {
    return;
  }
  /** @type {string} */
  var helpMsg = 'Click to start drawing';
  /** @type {ol.Coordinate|undefined} */
  var tooltipCoord = evt.coordinate;

  if (sketch) {
    var output;
    var geom = (sketch.getGeometry());
    if (geom instanceof ol.geom.Polygon) {
      poly = geom;
      output = formatArea(/** @type {ol.geom.Polygon} */ (geom));
      helpMsg = continuePolygonMsg;
      tooltipCoord = geom.getInteriorPoint().getCoordinates();
    } else if (geom instanceof ol.geom.LineString) {
      output = formatLength( /** @type {ol.geom.LineString} */ (geom));
      helpMsg = continueLineMsg;
      tooltipCoord = geom.getLastCoordinate();
    }
    measureTooltipElement.innerHTML = output;
    measureTooltip.setPosition(tooltipCoord);
  }

  helpTooltipElement.innerHTML = helpMsg;
  helpTooltip.setPosition(evt.coordinate);
};
      var view = new ol.View({
          center: ol.proj.fromLonLat([13.526973,52.457379]),
          zoom: 19
        });

      var map = new ol.Map({
        target: 'map',
        layers: [
          new ol.layer.Tile({
            source: new ol.source.OSM()
          }),
          vector
        ],
        view: view
      });


      function on_click_move_to_current_position(map_view){
          $('#btnGoToCurrentLocation').click(function(){
            var current_text = $(this).text();
            $(this).text("Laedt Position");

            Position.get_current_lon_lat(function(lon,lat){

              map_view.setCenter(ol.proj.fromLonLat([lon,lat]))

              $(this).text(current_text);
            }.bind(this))
          });
      }

      on_click_move_to_current_position(view);


map.on('pointermove', pointerMoveHandler);


var draw; // global so we can remove it later
function addInteraction() {
  var type = 'Polygon';
  draw = new ol.interaction.Draw({
    source: source,
    type: /** @type {ol.geom.GeometryType} */ (type),
    style: new ol.style.Style({
      fill: new ol.style.Fill({
        color: 'rgba(255, 255, 255, 0.2)'
      }),
      stroke: new ol.style.Stroke({
        color: 'rgba(0, 0, 0, 0.5)',
        lineDash: [10, 10],
        width: 2
      }),
      image: new ol.style.Circle({
        radius: 5,
        stroke: new ol.style.Stroke({
          color: 'rgba(0, 0, 0, 0.7)'
        }),
        fill: new ol.style.Fill({
          color: 'rgba(255, 255, 255, 0.2)'
        })
      })
    })
  });
  map.addInteraction(draw);

  createMeasureTooltip();
  createHelpTooltip();

window.map2 = map;

  draw.on('drawstart',
      function(evt) {
        // set sketch
        sketch = evt.feature;
      }, this);

  draw.on('drawend',
      function(evt) {
        measureTooltipElement.className = 'tooltip tooltip-static';
        measureTooltip.setOffset([0, -7]);

        geometry = sketch.getGeometry();
        coordinates = geometry.getCoordinates();


    	window.map2.getView().fit(geometry.getExtent(), window.map2.getSize());

    	window.map2.once('postcompose', function(event) {
  	    var canvas = event.context.canvas;

        var new_register_wiese = new RegisterWiese();

        //also falls anderungen gemacht werden sollen
        if(wiese_obj){
            new_register_wiese = new RegisterWiese(wiese_obj);
        }

        new_register_wiese.saveWieseCoords( canvas.toDataURL('image/png'), coordinates);

	    });



        // unset sketch
        sketch = null;
        // unset tooltip so that a new one can be created
        measureTooltipElement = null;
        createMeasureTooltip();
      }, this);
}


/**
 * Creates a new help tooltip
 */
function createHelpTooltip() {
  if (helpTooltipElement) {
    helpTooltipElement.parentNode.removeChild(helpTooltipElement);
  }
  helpTooltipElement = document.createElement('div');
  helpTooltipElement.className = 'tooltip';
  helpTooltip = new ol.Overlay({
    element: helpTooltipElement,
    offset: [15, 0],
    positioning: 'center-left'
  });
  map.addOverlay(helpTooltip);
}


/**
 * Creates a new measure tooltip
 */
function createMeasureTooltip() {
  if (measureTooltipElement) {
    measureTooltipElement.parentNode.removeChild(measureTooltipElement);
  }
  measureTooltipElement = document.createElement('div');
  measureTooltipElement.className = 'tooltip tooltip-measure';
  measureTooltip = new ol.Overlay({
    element: measureTooltipElement,
    offset: [0, -15],
    positioning: 'bottom-center'
  });
  map.addOverlay(measureTooltip);
}

/**
 * format length output
 * @param {ol.geom.LineString} line
 * @return {string}
 */
var formatLength = function(line) {
  var length = Math.round(line.getLength() * 100) / 100;
  var output;
  if (length > 100) {
    output = (Math.round(length / 1000 * 100) / 100) +
        ' ' + 'km';
  } else {
    output = (Math.round(length * 100) / 100) +
        ' ' + 'm';
  }
  return output;
};


/**
 * format length output
 * @param {ol.geom.Polygon} polygon
 * @return {string}
 */
var formatArea = function(polygon) {
  var area = polygon.getArea();
  var output;
  if (area > 10000) {
    output = (Math.round(area / 1000000 * 100) / 100) +
        ' ' + 'km<sup>2</sup>';
  } else {
    output = (Math.round(area * 100) / 100) +
        ' ' + 'm<sup>2</sup>';
  }
  return output;
};


addInteraction();

}


RegisterWiese.prototype.showCard = function(){
  var container = $('#HauptFenster');

  var wiese_object = this.wiese_obj;

  var show_map_to_select_area = function(){container.load('./html/register/showcard.html',
    function(){init_car(wiese_object)}
    )};

  if(DeviceDetector.is_viewed_on_handy()){
    container.load('./html/register/show_options_to_create_wiese.html', function(){
      $('#buttonWieseAblaufen').click(function(){

        var new_register_wiese = new RegisterWiese();

        //also falls anderungen gemacht werden sollen
        if(wiese_object){
            new_register_wiese = new RegisterWiese(wiese_object);
        }

        new RegisterWieseInteractive().set_callback(
          function(image_data_url , coordinates){
            new_register_wiese.saveWieseCoords( image_data_url, coordinates);
          }).init();
      }.bind(this));

      $('#buttonWieseKarte').click(function(){
        show_map_to_select_area();
      }.bind(this));
    });
  }else{
    show_map_to_select_area();
  }
}

function setOrchardOnline(wiesenName, wiesenObj, wiesenObjRights) {
	setOrchard(wiesenName, wiesenObj, function(err) {
				if(err){
      					alert("Fehler" + err);
      				}
					new Login();
				});
				setOrchardForUser(wiesenName, wiesenObjRights, function(err) {
					if(err){
      					alert("Fehler" + err);
      				}

				});
}


RegisterWiese.prototype.saveWieseCoords = function(wiese_img, coordinates){
  //falls eine bestehende wiese bearbeitet wird
  if(this.wiese_obj){
    var wiese = this.wiese_obj;

    var uploader = new ImageUploader();
        uploader.uploaded_data_and_make_callback(wiese_img, function(image_id){

          wiese.save_coordinates(coordinates, function(){});
          //Leite zurück zu Login
          wiese.save_image_id(image_id, function(){new Login()});

    }); //close image_uploader_callback

  }else{
    //beim erstellen einer neuen wiese
  	var init_register = function(){
  		$('#imagewiese').attr("src", wiese_img);


  		$('#buttonSave').click(function(){

  		var wiesenName = $('#inputWiesenName').val();
  	//first upload image
        var uploader = new ImageUploader();
        uploader.uploaded_data_and_make_callback(wiese_img, function(image_id){



      	var wiesenObjRights = {
          name: wiesenName,
      	rights: "write",
          image_id: image_id
      	};

      	var wiesenObj = {
      	//	password: hashedPassword,
          coordinates: coordinates,
  		image_id: image_id,
  		timestamp: Date.now()
      	};

  		setOrchardOnline(wiesenName, wiesenObj, wiesenObjRights);

          }); //close image_uploader_callback


  		});

  	}

  	$('#HauptFenster').load('./html/register/savewiese.html', init_register);
  }


}




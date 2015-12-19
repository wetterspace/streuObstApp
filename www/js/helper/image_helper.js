ImageHelper = {};

ImageHelper.get_image_data_for = function(image_id, element){
	var url = IMAGE_SERVER + "/image/" + image_id + "/" + IMAGE_SERVER_PASSWORD;

	if(typeof(Storage) !== "undefined") {
		if (ImageHelper.get_image_data_from_storage(image_id) === null) {
			//does not yet exist locally
			this.load_from_url(url,  function(image_data){
				ImageHelper.assign_image_data( image_data, element );
				ImageHelper.save_image_data(image_id, image_data);
			});

		}else{
			//image exists locally
			ImageHelper.assign_image_data( ImageHelper.get_image_data_from_storage(image_id), element );
		}
	} else {
		//falls der Browser keinen Localstorage besitzt das Bild aber trotzdme geladen werden soll
	    this.load_from_url(url, function(image_data){
	    							ImageHelper.assign_image_data( image_data, element )
	    						});
	}
}

ImageHelper.get_image_data_from_storage = function(image_id){
	return localStorage.getItem("img" + image_id);
};

ImageHelper.save_image_data = function(image_id, image_data){
	localStorage.setItem("img" + image_id, image_data);
}

ImageHelper.assign_image_data = function(image_data, element){
	element.attr('src', image_data );
}

ImageHelper.load_from_url = function(url, callback){
	$.get( url, function( data ) {
	  	callback(data);
	});
}
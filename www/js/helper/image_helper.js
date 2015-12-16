ImageHelper = {};

ImageHelper.get_url_for = function(image_id){
	return IMAGE_SERVER + "/image/" + image_id + "/" + IMAGE_SERVER_PASSWORD;
}
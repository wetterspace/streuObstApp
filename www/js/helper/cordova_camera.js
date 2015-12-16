var CordovaCamera = function(){
	this.btn = null;
	this.photo_box = null;
};

CordovaCamera.prototype.is_avaible_on_device = function() {
	return (typeof navigator !== "undefined" && navigator.camera);
};

CordovaCamera.prototype.set_take_picture_btn = function(btn){
	this.btn = btn;
}

CordovaCamera.prototype.set_photo_box = function(box){
	this.photo_box = box;
}

CordovaCamera.prototype.render_photo = function(imageURI){
	$(this.photo_box).html('');

	var img = $('<img/>', {src: "data:image/jpeg;base64," + imageURI, class: "img-responsive img-thumbnail"});

	$(this.photo_box).append(img);
}

CordovaCamera.prototype.init = function(){
	$(this.btn).click(function(){

		function onSuccess(imageURI) {
			this.render_photo(imageURI);
		};

		function onFail(message) {
		    alert('Failed because: ' + message);
		};

		navigator.camera.getPicture(onSuccess.bind(this), onFail.bind(this), {destinationType: Camera.DestinationType.DATA_URL});
	}.bind(this));
}
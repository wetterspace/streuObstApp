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

CordovaCamera.prototype.render_photo = function(url){
	$(this.photo_box).html('');

	var img = $('<img/>', {src: url, class: "img-responsive img-thumbnail"});

	$(this.photo_box).append(img);
}

CordovaCamera.prototype.init = function(){
	$(this.btn).click(function(){

	 window.navigator.camera.getPicture( function( url ) {
        this.render_photo(url);
      }.bind(this),
      function( message ) {
        alert( message );
      }.bind(this),
      {
        quality: 50,
        destinationType: navigator.camera.DestinationType.FILE_URI
      });

	}.bind(this));
}
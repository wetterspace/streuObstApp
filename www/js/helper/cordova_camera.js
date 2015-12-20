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
	$(this.photo_box).append('<p>Weedddiiie</p>');
	$(this.btn).click(function(){

		$(this.photo_box).append('<p>Wssseedddiiie</p>');

	 navigator.camera.getPicture( function( imageURI ) {
        alert( imageURI );
      },
      function( message ) {
        alert( message );
      },
      {
        quality: 50,
        destinationType: Camera.DestinationType.DATA_URL
      });

	 $(this.photo_box).append('<p>Wee4u85u8udddiiie</p>');

	}.bind(this));
}
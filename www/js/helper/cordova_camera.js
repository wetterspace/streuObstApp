var CordovaCamera = function(){
	this.btn = null;
	this.photo_box = null;
	this.image_uploader = null;
};

CordovaCamera.prototype.set_image_uploader = function(image_uploader){
	this.image_uploader = image_uploader;
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


	var tex = $('<p/>', {class: "text-warning", text: "Foto wird hochgeladen" });

	$(this.photo_box).append(tex);
	this.image_uploader.uploaded_data_and_make_callback(url, function(image_id){
		this.image_uploader.image_id = image_id;
		console.log(image_id);
		console.log(url);
		tex.removeClass("text-warning");
  		tex.addClass("text-success");
  		tex.text("Foto wurde erfolgreich hochgeladen");
	}.bind(this));
}

CordovaCamera.prototype.init = function(){
	$(this.btn).click(function(){

	 window.navigator.camera.getPicture( function( url ) {
        this.render_photo("data:image/jpeg;base64," + url);
      }.bind(this),
      function( message ) {
        alert( message );
      }.bind(this),
      {
        quality: 30,
        destinationType: navigator.camera.DestinationType.DATA_URL
      });

	}.bind(this));
}
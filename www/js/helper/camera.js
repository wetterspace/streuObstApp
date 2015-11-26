

	// Put video listeners into place



var Camera = function(){
	this.box = null;
	this.video_ele = null;

};

Camera.prototype.show = function(box) {
	this.box = $(box);

	this.video_ele = $('<video/>', {width: "100%", height: "auto", class: "img-responsive img-thumbnail", id: "cam"});


	$(box).html(this.video_ele);

	var that = this;

	$('#cam').bind("loadedmetadata", function () {
       that.width = this.videoWidth;
       that.height = this.videoHeight;
    });

	this.get_media();
};



Camera.prototype.take_picture_on_click = function(button_ele){
	$(button_ele).click(function(){

		var video = $(this.video_ele);

		var width = $('video').width();
		var height = $('video').height();

		var canvas = $('<canvas/>');

		$(this.box).append(canvas);

		canvas.attr('width', this.width);
		canvas.attr('height', this.height);


		var context = canvas.get(0).getContext("2d");
		
		context.drawImage(video.get(0), 0,0);

		var image = new Image();
		image.id = "tree_image";
		image.src = canvas[0].toDataURL();

		$(this.box).html(image);

		$('#tree_image').addClass("img-responsive img-thumbnail");

		this.video_ele.get(0).pause();

		

	}.bind(this));
}


Camera.prototype.get_media = function(){
	this.videoObj = { "video": true };
	var errBack = function(error) {
		console.log("Video capture error: ", error.code); 
	};

	if(navigator.getUserMedia) { // Standard
		navigator.getUserMedia(this.videoObj, function(stream) {
			this.video_ele.get(0).src = stream;
			this.video_ele.get(0).autoplay = true;
			this.video_ele.get(0).play();
		}.bind(this), errBack);
	} else if(navigator.webkitGetUserMedia) { // WebKit-prefixed
		navigator.webkitGetUserMedia(this.videoObj, function(stream){
			this.video_ele.get(0).src = window.URL.createObjectURL(stream);
			this.video_ele.get(0).autoplay = true;
			this.video_ele.get(0).play();
		}.bind(this), errBack);
	}
	else if(navigator.mozGetUserMedia) { // Firefox-prefixed
		navigator.mozGetUserMedia(this.videoObj, function(stream){
			this.video_ele.get(0).src = window.URL.createObjectURL(stream);
			this.video_ele.get(0).autoplay = true;
			this.video_ele.get(0).play();
		}.bind(this), errBack);
	}
}
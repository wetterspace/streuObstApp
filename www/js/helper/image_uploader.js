var ImageUploader = function(){
	this.image_id = null;
	this.caption = null;
};

ImageUploader.prototype.set_callback = function(callback_func){
	this.callback_func = callback_func;
};

ImageUploader.prototype.set_caption =function(caption){
	this.caption = caption;
}

ImageUploader.prototype.set_image_size = function(width,height){
	this.image_width = width;
	this.image_height = height;
}

ImageUploader.prototype.uploaded_data_and_make_callback = function(data,call){
	var key_vals = { image: data, secret_wiesen_password: IMAGE_SERVER_PASSWORD }

	var saveData = $.ajax({
	      type: 'POST',
	      url:  IMAGE_SERVER + "/save_image",
	      data: key_vals,
	      dataType: "text",
	      success: function(resultData) {
	      		//callback gets performed
	      		var image_id = JSON.parse(resultData).image_id;

	      		call(image_id);
	       }
	});
	saveData.error(function() { alert("Server nicht erreichbar"); });
}

ImageUploader.prototype.handleResizeImage=function(e){
	var reader = new FileReader();
    reader.onload = function(event){

        var img = new Image();
        img.onload = function(){

        	var natural_scale_factor = img.naturalWidth / this.image_width;
        	var scaled_height = img.naturalHeight / natural_scale_factor;

        	var canvas_creation_box = $('#canvas_creation_box');
        		canvas_creation_box.html('<canvas id="creation_canvas" width="' + this.image_width  +'" height="' + scaled_height +'"></canvas>');

        	var canvas = document.getElementById("creation_canvas");
			var ctx = canvas.getContext("2d");

			ctx.drawImage(img,0,0,img.naturalWidth,img.naturalHeight,0,0,this.image_width,scaled_height);

           	this.caption.addClass("text-warning");
           	this.caption.text("Bild wird hochgeladen. Bitte warten!")

	        this.uploaded_data_and_make_callback(canvas.toDataURL(), function(image_id){
	           	this.caption.removeClass("text-warning");
	           	this.caption.addClass("text-success");
	         	this.caption.text("Bild wurde erfolgreich hochgeladen");
	           	this.image_id = image_id;

	           	this.callback_func(image_id);

	        }.bind(this));

        }.bind(this);

        img.src = event.target.result;
    }.bind(this);

    reader.readAsDataURL(e.target.files[0]);
}

ImageUploader.prototype.handleImage = function(e){
    var reader = new FileReader();
    reader.onload = function(event){

        var img = new Image();
        img.onload = function(){

           $(img).css({'width' : '100%' , 'height' : 'auto'});
           $("#tree_image").attr('src', img.src);

           this.caption.addClass("text-warning");
           this.caption.text("Bild wird hochgeladen. Bitte warten!")

           this.uploaded_data_and_make_callback(img.src, function(image_id){
           		this.caption.removeClass("text-warning");
           		this.caption.addClass("text-success");
           		this.caption.text("Bild wurde erfolgreich hochgeladen");
           		this.image_id = image_id;
           }.bind(this));

        }.bind(this);

        img.src = event.target.result;
    }.bind(this);

    reader.readAsDataURL(e.target.files[0]);
};


ImageUploader.prototype.add_uploaded_image = function(tree_obj){
	//if no images exist yet, create empty
	if(! tree_obj[TreeAttr.images.id]){
		tree_obj[TreeAttr.images.id] = {};
	}
	//check if image was uploaded
	if(this.image_id){
		//image id is current time
		tree_obj[TreeAttr.images.id][Date.now()] = {id: this.image_id};
	}
}
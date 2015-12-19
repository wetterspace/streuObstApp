var ImageUploader = function(){
	this.image_id = null;
};


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

ImageUploader.prototype.handleImage = function(e){
    var reader = new FileReader();
    reader.onload = function(event){

        var img = new Image();
        img.onload = function(){

           $(img).css({'width' : '100%' , 'height' : 'auto'});
           $("#tree_image").attr('src', img.src);

           var caption = $('#tree_image_caption');
           caption.addClass("text-warning");
           caption.text("Bild wird hochgeladen. Bitte warten!")

           this.uploaded_data_and_make_callback(img.src, function(image_id){
           		caption.removeClass("text-warning");
           		caption.addClass("text-success");
           		caption.text("Bild wurde erfolgreich hochgeladen");
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
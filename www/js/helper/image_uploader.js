var ImageUploader = function(){
	//this.image_id = null;
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
  //  var reader = new FileReader();
  //  reader.onload = function(event){
//
  //      var img = new Image();
   //     img.onload = function(){
     
     //      $(img).css({'width' : '100%' , 'height' : 'auto'});
       //    $("#tree_image").attr('src', img.src);
  			
         //  this.let_upload_image(img.src);

    //    }.bind(this);

      //  img.src = event.target.result;
    //}.bind(this);

    //reader.readAsDataURL(e.target.files[0]);     
};

ImageUploader.prototype.let_upload_image = function(src) {
	//$.ajax({ 
	  //  url: 'https://api.imgur.com/3/image',
	    //headers: {
	 //       Authorization: "Client-ID 8458d4c0f7610df",
	   //     Accept: 'application/json'
	 //   },
	 //   type: 'POST',
	 //   data: {
	 //       image: src.split(',')[1]
	 //   },
	 //   success: function(result) {  
	 //   	this.image_url = result.data.link;
	//		this.image_id = result.data.id;
	//		this.image_deletehash = result.data.deletehash;
	//    }.bind(this)
	//});
};


ImageUploader.prototype.add_uploaded_image = function(tree_obj){
	//check if image was uploaded
	//if(this.image_id){
		//if no images exist yet, create empty
	//	if(! tree_obj[TreeAttr.images.id]){
	//		tree_obj[TreeAttr.images.id] = {};
	//	}
		
		//image id is current time
	//	tree_obj[TreeAttr.images.id][Date.now()] = {url: this.image_url, id: this.image_id, deletehash: this.image_deletehash};
	//}
}
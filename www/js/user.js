var User = function(username){
	this.username = username;
};

User.prototype.getUserDataFromServer = function(callback){
	getUser(this.username, function(snapshot) {
		var userData = snapshot.val();
		this.data = userData;
		callback(); 
	}.bind(this));
}

User.prototype.init_map = function(){
    var vectorSource = new ol.source.Vector({});
    //create polygon from Wiesen coordinates
    var polyFeature = new ol.Feature({
        geometry: new ol.geom.Polygon(
            this.data.coordinates
        )
    });
	vectorSource.addFeature( polyFeature );

    var wiesenlayer = new ol.layer.Vector({
        source: vectorSource
    });

    //make map fullsize
    var window_height = $(window).height();
    var map_offset = $('#map').offset().top;

    $('#map').height(window_height - map_offset - 10);

	this.map = new ol.Map({
        target: 'map',
        layers: [
          new ol.layer.Tile({
            source: new ol.source.OSM()
          }),
          wiesenlayer
        ]
    });

    this.map.getView().fit(polyFeature.getGeometry().getExtent(), this.map.getSize());
}

User.prototype.init_page = function() {
	$('#wiesenName').html(this.username);
	

};

function startSyncing() {
			$('#myModalUser').modal('hide');
			$('.modal-backdrop').remove();
			syncTrees();		
}

User.prototype.init = function(){
	this.init_page();
	
	
	
	if(sessionStorage.getItem('user') == 'Offline') {
	$('#buttonNewWiese').attr('disabled', 'disabled' );
	} else {
	
	$('#buttonNewWiese').click(function(){
			//registers user
			new RegisterWiese();
	});
	
	
	
	
	
	}
	

	//only show logout btn
	NavbarHelper.hide_all_btns();

	NavbarHelper.show(NavbarHelper.btn.logout);


	if(sessionStorage.getItem('user') == 'Offline') {
	
/*	getWiesenObjects.forEach(function(entry) {
    setOverview();
	}); */
	var wiesenArray = getWiesenObjects();
	
	$.each(wiesenArray, function(index, value) {
		console.log(value);
		//check if really orchard object
		if(value.coordinates != undefined) {setOverview(index, value, value.image_id);}
		
	}); 
	
	}else {
	compareStorageAndDB();
	this.getUserDataOnline();
	
	//syncing
	
	
	}
	

	//show active user btn
	NavbarHelper.make_active(NavbarHelper.btn.user);

}
User.prototype.getUserDataOnline = function() {
this.getUserDataFromServer(function(){
		
	getOrchardForUser(this.username, function(snapshot) {
		snapshot.forEach(function(childSnapshot) {
			var key = childSnapshot.key();
			var childData = childSnapshot.val();
			setOverview(key, childData, ImageHelper.get_url_for(childData.image_id));
			
		});
	}.bind(this));
		
	}.bind(this));
}

function getDataOffline() {
}

function setOverview(key, data, imgSource) {
			

			var t1 = $("#wiesen_list");
			var d = $('<a/>', {class: "list-group-item", href: "#", click: function(){
				new Wiese(key).show();
			}});
			var hw = $('<h4/>', {class: "list-group-item-heading", text: 'Wiesenname: ' + key});
			t1.append(d);
			d.append(hw);

			var himg = $('<img/>', {class: "img-responsive img-thumbnail"});
			himg.attr('src', imgSource );
			d.append(himg);
}

User.prototype.show = function() {
//TODO Ist schon in init oder?
//	$('#buttonNewWiese').click(function(){
//			//registers user
//		new Register();
//	});


	$('#HauptFenster').load('./html/user/show.html', this.init.bind(this));
};
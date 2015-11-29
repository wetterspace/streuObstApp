var User = function(username){
	this.username = username;	
};

User.prototype.getUserDataFromServer = function(callbac){
	new DB().getUserDB().child(this.username).once("value", function(snapshot){
		var userData = snapshot.val();
		this.data = userData;
		callbac();
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

User.prototype.init = function(){

	$('#buttonNewWiese').click(function(){
			//registers user
			new RegisterWiese();
		});
		$('#buttonLogout').click(function(){
			//registers user
			sessionStorage.clear();
			new Login();
		});



	this.getUserDataFromServer(function(){
		this.init_page();
		new DB().getUserDB().child(this.username).child('wiesen').once("value", function(snapshot){
		
			snapshot.forEach(function(childSnapshot) {
			var key = childSnapshot.key();
			var childData = childSnapshot.val();
			var t1 = document.getElementById("top");
			var d = document.createElement("div");
			var hw = document.createElement("h3");
			hw.innerHTML = 'Wiesenname: ' + key;	
			t1.appendChild(d);
			d.appendChild(hw);

			new DB().getWiesenDB().child(key).once("value", function(snapshotW){
				var hr = document.createElement("h3");
				hr.innerHTML = 'Berechtigung: ' + childData.rights;
				var himg = document.createElement("img");
				himg.style="width:50%; height:50%; cursor: pointer;";
				himg.onclick= function() {
					new Wiese(key).show();
				};
			himg.src=snapshotW.val().image;	
			d.appendChild(hr);
			d.appendChild(himg);
			});
    
			});
		});
	}.bind(this));
	
}



User.prototype.show = function() {
	
	$('#buttonNewWiese').click(function(){
			//registers user
			new Register();
		});


	$('#HauptFenster').load('./html/user/show.html', this.init.bind(this));
};
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
	syncObstarten(this.username);


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

		//da gehören eig die offline obstarten rein
		var obstarten = JSON.parse(localStorage.getItem("Arten"));

		if(value.coordinates != undefined) {setOverview(index, value, value.image_id, obstarten);}

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
	var obstarten = this.data.obstarten;

	getOrchardForUser(this.username, function(snapshot) {
		snapshot.forEach(function(childSnapshot) {
			var key = childSnapshot.key();
			var childData = childSnapshot.val();
			setOverview(key, childData, childData.image_id, obstarten);
		});
	}.bind(this));

	}.bind(this));
}

function getDataOffline() {
}

function setOverview(key, data, image_id, obstarten) {
			var t1 = $("#wiesen_list");
			var d = $('<a/>', {class: "list-group-item text-center", href: "#"});
			var hw = $('<h4/>', {class: "list-group-item-heading", text: 'Wiesenname: ' + key});
			t1.append(d);
			d.append(hw);

			console.log(obstarten);

			var himg = $('<img/>', {class: "img-responsive img-thumbnail",  click: function(){
				new Wiese(key, obstarten).show();
			}});
			ImageHelper.get_image_data_for(image_id, himg);
			d.append(himg);

			var btn_group = $('<div/>', {class: "btn-group btn-group-justified inline", style: "margin-top:8px"});
				btn_group.append($('<a/>', {class: "btn btn-info btn-sm", html: "<img class='user_icon_svg' src='img/icons/eintstellungen.svg'/> <br/>  Bearbeiten", click: function(){
					var wiese = new Wiese(key, obstarten);
					//only able to edit coords of wiese
					new RegisterWiese(wiese);
				}}));
				btn_group.append($('<a/>', {class: "btn btn-success btn-sm", html: "<img class='user_icon_svg' src='img/icons/Wiesenprofil.svg'/> <br/>  Öffnen", click: function(){
					new Wiese(key, obstarten).show();
				}}));
				btn_group.append($('<a/>', {class: "btn btn-warning btn-sm", 'data-toggle': "modal", 'data-target': "#deleteWieseModal", html: "<img class='user_icon_svg' src='img/icons/loeschen.svg'/> <br/> Löschen", click: function(){
					var delete_btn = $('#really_wiese_delete_btn');
						//enferne voerhergegane events sodass nicht mehree Wisen geslöscht werdeb
						delete_btn.unbind();
						delete_btn.click(function(){
							var wiese = new Wiese(key, obstarten);
								wiese.remove();
						});
				}}));

			d.append(btn_group);
}

User.prototype.show = function() {
//TODO Ist schon in init oder?
//	$('#buttonNewWiese').click(function(){
//			//registers user
//		new Register();
//	});


	$('#HauptFenster').load('./html/user/show.html', this.init.bind(this));
};
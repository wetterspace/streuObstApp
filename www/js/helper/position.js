var Position = {

	get_current_lon_lat: function(callbac){
		if(navigator.geolocation){
			navigator.geolocation.getCurrentPosition(function(position){
				var lon = position.coords.longitude;
				var lat = position.coords.latitude;

				callbac(lon, lat);
			});
		}
		else{
			alert("GPS not available");
		}
	}
}
var Weather = function(){
	this.render_box = null;
}

Weather.prototype.set_render_box = function(box){
	this.render_box = box;
}

Weather.prototype.preload_information = function(){
	var that = this;
	Position.get_current_lon_lat(function(lon, lat){ that.get_wheater_information(lon, lat) }) ;
}

Weather.prototype.get_wheater_information = function(lon, lat) {
	 $.ajax({
            url : "http://api.wunderground.com/api/a8e508abca07b115/forecast/lang:DL/geolookup/conditions/q/" + lat + "," + lon + ".json",
            dataType : "jsonp",
            success : function(data) {
                window.weather_information = {
               	    location: data['location']['city'],
                    temp:  data['current_observation']['temp_c'],
                    today:  data['current_observation']['observation_time_rfc822'],
                    img:  data['current_observation']['icon_url'],
                    desc:  data['current_observation']['weather'],
                    wind_dir:  data['current_observation']['wind_dir'],
                    wind_speed:  data['current_observation']['wind_kph'],
                    humidity:  data['current_observation']['relative_humidity'],
                    desc:  data['current_observation']['weather'],
                    feelslike:  data['current_observation']['feelslike_c'],
                    pressure:  data['current_observation']['pressure_mb'],
                    visibility:  data['current_observation']['visibility_km'],
                    uv:  data['current_observation']['UV']
                }
            }
        });
};

Weather.prototype.is_already_loaded = function(){
    return window.weather_information;
};

Weather.prototype.render = function(){
	//wenn schon geladen
	if(window.weather_information){
		var info = window.weather_information;
		this.render_box.append($('<img>',{id:'weather_img',src: info.img}));
        this.render_box.append($('<p/>', {html: "Wetter in " + info.location + " für heute, " + info.today}));
        this.render_box.append($('<p/>', {html: info.desc + ". Die Temperatur beträgt " + info.temp + "&deg;C"}));
        this.render_box.append($('<p/>', {html: "Feuchtigkeit: " + info.humidity}));
        this.render_box.append($('<p/>', {html: "Wind: " + info.wind_dir + ", " + info.wind_speed + " km/h"}));
        this.render_box.append($('<p/>', {html: "Gefühlte: " + info.feelslike + "&deg;C"}));
        this.render_box.append($('<p/>', {html: "Luftdruck: " + info.pressure + " mb"}));
        this.render_box.append($('<p/>', {html: "Sichtweite: " + info.visibility + " km"}));
        this.render_box.append($('<p/>', {html: "UV-Index: " + info.uv}));
	}
}
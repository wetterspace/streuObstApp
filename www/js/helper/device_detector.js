var DeviceDetector = {}

DeviceDetector.is_viewed_on_handy = function(){
	var container = $('#HauptFenster');
	var check = $('<p/>', {class: "visible-xs"});
		container.append(check);

	var is_visible_on_mobile = check.is(":visible");
	check.remove();

	return is_visible_on_mobile;
}
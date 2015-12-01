var PflegeFormHelper = {};


PflegeFormHelper.transform_id_to_name = function(key) {
	//id is an Date Integer

	var monthNames = [
	  "Januar", "Februar", "März",
	  "April", "Mai", "Juni", "July",
	  "August", "September", "Oktober",
	  "November", "Dezember"
	];

	var date = new Date(parseInt(key));
	var day = date.getDate();
	var monthIndex = date.getMonth();
	var year = date.getFullYear();
	
	return (day + ' ' + monthNames[monthIndex] + ' ' + year);
}
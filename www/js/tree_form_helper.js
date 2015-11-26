var TreeFormHelper = {};


TreeFormHelper.change_sorten_dropdown = function (art_key) {
	var sorten = Obst.getSorten(art_key);

	var sortenDropdwon = $("#sortName");
		//empty options before select new ones
		sortenDropdwon.find('option').remove();


	sorten.forEach(function(sorte) {
		sortenDropdwon.append($("<option />").val(sorte.Name).text(sorte.Name));
	});

}
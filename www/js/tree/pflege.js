var PflegeAttr = {

	id: {
		//gets set in PflegeForm when Is saved
		//get_pflegezustaende_to_save
		//selbe wie bei Firebase um bereits gespeicherte Pflegezustände zu finden
		id: "zustand_id",
		title: "Zustand Id"
	},

	krone_beschnitten: {
			id: "krone_beschnitten", 		
			title: "Krone Beschnitten"
	},

	hohe_der_krone: {
			id: "höhe_der_krone", 	
			title: "Höhe der Krone"
	},

	baumstamm_gereinigt: {
			id: "baumstamm_gereinigt", 		
			title: "Baumstamm gereinigt"
	},

	baumstamm_gekalket: {
			id: "baumstamm_gekalket", 
			title: "Baumstamm gekalkt"
	},

	schaedline: {
			id: "schädlinge", 
			title: "Schädlinge"
	},

	verbiss_spuren: {
			id: "verbiss_spuren",
			title: "Verbissspuren"
	}
};


var Pflege = function(){

}

Pflege.prototype.method_name = function(first_argument) {
	// body...
};
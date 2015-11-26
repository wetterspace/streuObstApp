var Obst = {

	Arten: {

	}
};


Obst.getArten = function () {
	return Object.keys(Obst.Arten);
};

Obst.getSorten = function(art){
	return Obst.Arten[art];
}




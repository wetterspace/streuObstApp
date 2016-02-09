var Obst = {

	Arten: {

	}
};


Obst.getArten = function (obstarten) {
	if(obstarten){
	   return Object.keys(obstarten);
	}else{
	   return Object.keys(Obst.Arten);
	}
};

Obst.getSorten = function(art, obstarten){
	if(obstarten){
		return obstarten[art];
	}else{
		return Obst.Arten[art];
	}
}




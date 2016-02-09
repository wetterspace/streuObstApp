var Obst = {

	Arten: {

	}
};


Obst.getArten = function (obstarten) {
	if(obstarten){
	   return Object.keys(obstarten).filter(function(elem){ return elem != "timestamp"; });
	}else{
	   return Object.keys(Obst.Arten).filter(function(elem){ return elem != "timestamp"; });
	}
};

Obst.getSorten = function(art, obstarten){
	if(obstarten){
		return obstarten[art];
	}else{
		return Obst.Arten[art];
	}
}




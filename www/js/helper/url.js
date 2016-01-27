var URL = function(sortname, problem){
	this.imgName = '';
				if(sortname == 'Apfel' || sortname == 'Birnen' || sortname == 'Kirschen' || sortname == 'Pflaumen') {
				
				if(problem == true) {
					this.imgName = sortname + "2.png";
				} else {
					this.imgName = sortname + "1.png";
				}
				}
				else {
				this.imgName = 'Baumprofil.png';
				}
};

URL.prototype.getUrl = function() {

	

	return this.imgName;
};


var URL = function(sortname){
	this.imgName = '';
				if(sortname == 'Apfel' || sortname == 'Birnen' || sortname == 'Kirschen' || sortname == 'Pflaumen') {
				this.imgName = sortname + "1.png";
				}
				else {
				this.imgName = 'Baumprofil.png';
				}
};

URL.prototype.getUrl = function() {

	

	return this.imgName;
};


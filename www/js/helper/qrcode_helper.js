QrCodeHelper = function(){
	this.image_field = null;
	this.header_field = null;
	this.print_field = null;

	this.options = {
	    // render method: 'canvas', 'image' or 'div'
	    render: 'canvas',

	    // version range somewhere in 1 .. 40
	    minVersion: 6,

	    // error correction level: 'L', 'M', 'Q' or 'H'
	    ecLevel: 'H',

	    // offset in pixel if drawn onto existing canvas
	    left: 0,
	    top: 0,

	    // size in pixel
	    size: 300,

	    // code color or image element
	    fill: '#000',

	    // background color or image element, null for transparent background
	    background: null,

	    // content
	    text: null,

	    // corner radius relative to module width: 0.0 .. 0.5
	    radius: 0.3,

	    // quiet zone in modules
	    quiet: 1,

	    // modes
	    // 0: normal
	    // 1: label strip
	    // 2: label box
	    // 3: image strip
	    // 4: image box
	    mode: 2,

	    mSize: 0.1,
	    mPosX: 0.5,
	    mPosY: 0.5,

	    label: 'SOWA',
	    fontname: 'Lato',
	    fontcolor: '#18bc9c',

	    image: null
	};
};

QrCodeHelper.prototype.set_image_field = function(image_field) {
	this.image_field  = image_field;
	return this;
};

QrCodeHelper.prototype.set_header_field = function(header_field) {
	this.header_field = header_field;
	return this;
};

QrCodeHelper.prototype.set_print_field = function(print_field) {
	this.print_field = print_field;
	return this;
};

QrCodeHelper.prototype.set_obj_and_key_for_text = function(obj, key) {
	//nur wenn baum exisitert und er auch einen key id hat wird ein qr code gezeigt
	if(obj && obj[key]){
		this.options.text = obj[key];
	}

	return this;
};

QrCodeHelper.prototype.render = function(){
	if(this.options.text){
		//wenn text existiert, zeige qr code
		this.options

		$(this.image_field).qrcode(this.options);

		$(this.print_field).append($('<a/>', {href: "#", class: "btn btn-info", text: "Drucken", click: function(){
			popup = window.open();
			popup.document.write('<img src="' + $(this.image_field).find('canvas').get(0).toDataURL() + '" />');
			popup.print();
		}.bind(this)   }));

	}else{
		//change header
		$(this.header_field).text("Speichern sie bitte erst den Baum, dann können sie den QR-Code abrufen")
		$(this.print_field).hide();
	}
};













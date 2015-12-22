function attemptSync() {
	console.log("Name: " + sessionStorage.getItem('user'));
	var connectedRef = new Firebase("https://incandescent-torch-1365.firebaseio.com/.info/connected");
	connectedRef.on("value", function(snap) {
		if (snap.val() === true) {
			console.log("connected");
			syncDB();
		} else {
			console.log("No Internet connection");
		}
	});
}

function getWiesenObjects() {
	var wiesenArray=new Object();
	for (var i = 0; i < localStorage.length; i++){
		try {
		var obj = JSON.parse(localStorage.getItem(localStorage.key(i)));
		console.log(obj);
		//make sure it's an orchard
		if(obj.coordinates) {
			var wiesenName = localStorage.key(i);
			wiesenArray[wiesenName]=obj;	
		}
		}
		catch(err) {
		}
		
				
	}

	return wiesenArray;
}

function compareStorageAndDB() {
	for (var i = 0; i < localStorage.length; i++){
		try {
		var obj = JSON.parse(localStorage.getItem(localStorage.key(i)));
		//make sure it's a tree
		if(obj.id != undefined) {
			getTree(obj, localStorage.key(i), function(obj, snapshot) {
				//treee already exists in DB
				if(snapshot.val()) {
					//If tree version in local storage has a newer timestap than the one stored in the DB
					if(obj.timestamp > snapshot.val().timestamp && obj.timestamp != snapshot.val().timestamp) {
						$('#myModalUser').modal('show');	 
					}
					//tree has been created offline and has yet to be stored in DB
				}else {
					$('#myModalUser').modal('show');
				}
			}.bind(this));		
		}
		} catch(err) {
		}
			
	}
}

function syncTrees() {
	console.log("asdasdasasddddddddddddddddddddddddddddddddddddddddddd");
	for (var i = 0; i < localStorage.length; i++){
		var obj;
		try {
		obj = JSON.parse(localStorage.getItem(localStorage.key(i)));
		} catch(err){
		}
		//make sure it's a tree
		if(obj && obj.id != undefined) {
			getTree(obj, localStorage.key(i), function(obj, snapshot) {
				//treee already exists in DB
				if(snapshot.val()) {
					//If tree version in local storage has a newer timestap than the one stored in the DB
					if(obj.timestamp > snapshot.val().timestamp && obj.timestamp != snapshot.val().timestamp) {
						//set tree to DB
						setTree(obj, function(err) {
							console.log(err + "UPDATE----------------------------------->>>>>>>>" + obj);
						}.bind(this));	 
					} 
					//tree has been created offline and has yet to be stored in DB
				}else {
					setTree(obj, function(err) {
						console.log(err + "PUSH------------------------------>>>>>>>>" + obj);
					}.bind(this));	 
				}
			}.bind(this));	
		}	
	}	
}



function syncDB() {	
	var ref = new Firebase("https://incandescent-torch-1365.firebaseio.com").child("wiesen");
	ref.on("value", function(snapshot) {
		for (var i = 0; i < localStorage.length-1; i++){
			
			var wiesenObj = JSON.parse(localStorage.getItem(localStorage.key(i)));
			var wiesenName = localStorage.key(i);
			var meadowExists = snapshot.child(wiesenName).exists();
			console.log(wiesenName + " is synced: " + meadowExists);
			
			if(meadowExists == false && wiesenName != 'firebase:previous_websocket_failure') {
				addMeadow(ref, meadowExists, wiesenName, wiesenObj);
			} else if(wiesenName == 'firebase:previous_websocket_failure') {
				localStorage.removeItem(wiesenName);
			}
			
		}
	}, function (errorObject) {
		console.log("The read failed: " + errorObject.code);
	});	
}


function addMeadow(ref, meadowExists, wiesenName, wiesenObj) {
	ref.child(wiesenName).set(wiesenObj, function(err){
		if(err){
			console.log("Error: " + err);
		}else{
			console.log("synced: " + wiesenName);
		}
	});
}





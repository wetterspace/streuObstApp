function attemptSync() {
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





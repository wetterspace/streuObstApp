

//----registerWiese.js/Offline----
function getWiesenObjects() {
	var wiesenArray=new Object();
	for (var i = 0; i < localStorage.length; i++){
		var obj;
		try {
		var obj = JSON.parse(localStorage.getItem(localStorage.key(i)));
		} catch(err) {
		}
		console.log(obj);
		//make sure it's no tree
	/*	if(obj.wiese == undefined) {
			var wiesenName = localStorage.key(i);
			wiesenArray[wiesenName]=obj;	
		}		*/
		if(obj.coordinates != undefined) {
			var wiesenName = localStorage.key(i);
			wiesenArray[wiesenName]=obj;	
		}
	}

	return wiesenArray;
}


//----registerWiese.js/Offline----
function getTreeObjects() {
	var wiesenArray=new Object();
	for (var i = 0; i < localStorage.length; i++){
		var obj = JSON.parse(localStorage.getItem(localStorage.key(i)));
		//make sure it's a(!) tree
		if(obj.wiese != undefined) {
			var wiesenName = localStorage.key(i);
			wiesenArray[wiesenName]=obj;	
		}		
	}
	return wiesenArray;
}



function getTreesForOrchardOffline(orchardName) {
	var TreeArray=new Object();
	for (var i = 0; i < localStorage.length; i++){
		try {
		var obj = JSON.parse(localStorage.getItem(localStorage.key(i)));
		console.log(obj);
		//make sure it's no tree
		if(obj.wieseName == orchardName) {
			var wiesenName = localStorage.key(i);
			TreeArray[localStorage.key(i)]=obj;	
		}		
		} catch(err) {
		}
	}
	return TreeArray;
}

//save offline when button is clicked
function makeAvailableOffline(orchardName, orchardObj) {
	console.log(orchardName + "--->" + orchardObj);
	var TreeArray=new Object();
	var data = orchardObj.trees;
	
	for (var key in data) {
		console.log(data[key]); 
		saveOffline(key, data[key]);	
	}
	orchardObj.trees = null;
	saveOffline(orchardName, orchardObj);
}


function findOrchardInLocalStorage(key) {
	var wiesenArray = getWiesenObjects();
	if (key in wiesenArray) {
		return wiesenArray[key];
	} else {
		return null;
	}
}



function makeOffline(wiesenObjekt) {
	getTreesForOrchardOffline(orchardName);
}



function saveOffline(key, wiesenObjekt) {
	localStorage.setItem(key, JSON.stringify(wiesenObjekt));
}

//-------register.js-----------
function setUserOnline(userName, UserObj, funcSetUserOnline) {
	new DB().getUserDB().child(userName).set(UserObj, function(err){
		funcSetUserOnline(err);
	});
}

//-------login.js-----------
function checkUserLoginOnline(userName, userPassword, func) {
	new DB().getUserDB().child(userName).once("value", function(snapshot){
		userValue = snapshot.val();
		func(userValue);
	});
}

//-------user.js-----------
function getOrchardForUser(username, funcGetOrchardForUser) {
	new DB().getUserDB().child(username).child('wiesen').once("value", function(snapshot){
		funcGetOrchardForUser(snapshot);
	});
}

function getUser(username, funcGetUser) {
	new DB().getUserDB().child(username).once("value", function(snapshot){
		funcGetUser(snapshot);
	});
}


//-------registerWiese.js-----------
function setOrchard(wiesenName, wiesenObj, funcSetOrchard) {
	new DB().getWiesenDB().child(wiesenName).set(wiesenObj, function(err){
		funcSetOrchard(err);
	});
}

function setOrchardForUser(wiesenName, wiesenObjRights, funcSetOrchardForUser) {
	new DB().getUserDB().child(sessionStorage.getItem('user')).child('wiesen').child(wiesenName).set(wiesenObjRights, function(err){
		funcSetOrchardForUser(err);
	});
}



//-------wiese.js-----------
function getOrchard(orchardName, funcGetOrchard) {
	new DB().getWiesenDB().child(orchardName).once("value", function(snapshot){
		funcGetOrchard(snapshot);
	});
}

//-------connect.js-----------
function getTree(obj, key, funcGetTree) {
	new DB().getWiesenDB().child(obj.wieseName).child('trees').child(key).once("value", function(snapshot){
		funcGetTree(obj, snapshot);
	});
}

function setTree(treeObj, funcSetTree) {
	new DB().getWiesenDB().child(treeObj.wieseName).child('trees').child(treeObj.id).set(treeObj, function(err){
		funcSetTree(err);
	});
}

function setNewTreeToFirebase(treeObj, funcSetTree) {
	new DB().getWiesenDB().child(treeObj.wieseName).child('trees').push(treeObj, function(err){
		funcSetTree(err);
	});
}



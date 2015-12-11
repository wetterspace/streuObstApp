

//----registerWiese.js/Offline----
function getWiesenObjects() {
	var wiesenArray=new Object();
	for (var i = 0; i < localStorage.length; i++){
		var obj = JSON.parse(localStorage.getItem(localStorage.key(i)));
		console.log(obj);
		//make sure it's no tree
		if(obj.wiese == undefined) {
		var wiesenName = localStorage.key(i);
		wiesenArray[wiesenName]=obj;	
}		
	}

return wiesenArray;
}

function getTreesForOrchardOffline(orchardName) {
	var TreeArray=new Object();
	var l = 0;
	for (var i = 0; i < localStorage.length; i++){
		var obj = JSON.parse(localStorage.getItem(localStorage.key(i)));
		console.log(obj);
		//make sure it's no tree
		if(obj.wiese == orchardName) {
		var wiesenName = localStorage.key(i);
		TreeArray[l]=obj;	
		l = l + 1;
}		
	}
	return TreeArray;
}

function findOrchardInLocalStorage(key) {
	wiesenArray = getWiesenObjects();
		if (key in wiesenArray) {
		return wiesenArray[key];
		} else {
		return null;
		}
}

function saveOffline(key, wiesenObjekt) {
console.log(wiesenObjekt);
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




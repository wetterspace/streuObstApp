var ref = new Firebase("https://incandescent-torch-1365.firebaseio.com/baum");


// Attach an asynchronous callback to read the data at our posts reference



function reload_data(snapshot){
    var baum_liste = $('#baum_liste');

        baum_liste.html('');

    snapshot.val().forEach(function(baum){

        var element = '<li class="list-group-item">' 
        element += 'Der Baum ist ein <b>' + baum.sorte; 
        element += '</b> er ist plaziert <b>' + baum.lage;
        element += '</b></li>';

        baum_liste.append(element);
    });
};


ref.on("value", function(snapshot) {    
    reload_data(snapshot);
}, function (errorObject) {
  console.log("The read failed: " + errorObject.code);
});

ref.on("child_added", function(snapshot, prevChildKey) {
    reload_data(snapshot);
});

ref.on("child_changed", function(snapshot) {
    reload_data(snapshot);
});

ref.on("child_removed", function(snapshot) {
    reload_data(snapshot);
});

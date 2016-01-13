//Check if checkboxes are checked and adjust output treeList accordingly
function goOverCheckboxes(wiese) {
	var filteredTreeList = {};
	var checkboxes = $('input[type="checkbox"]');
	for (i = 0; i < checkboxes.length; i++) {
		if (checkboxes[i].checked) {
			var treeList = jQuery.extend(true, {}, wiese.data.trees);
			if(checkboxes[i].value == "alle") {
				return treeList;
			}
			filteredTreeList = adjustTreeList(wiese.data.trees, filteredTreeList, checkboxes[i].value);
		}
	}
	console.log(filteredTreeList);
	return filteredTreeList;
}

//Puts all of the trees that meet the filter requirement in output treeList
function adjustTreeList(allTreesList, treeList, filterParameter) {
	for (var key in allTreesList) {
		var obj = allTreesList[key];
		if (obj.sortname == filterParameter) {
			treeList[key] = obj
		}
	}
	return treeList;
}

function getAllSortNames(allTreesList) {
	var sortName = new Array();
	for (var key in allTreesList) {

		var obj = allTreesList[key];
		if ($.inArray(obj.sortname, sortName) === -1) {
			sortName[sortName.length] = obj.sortname;
		}
	}
	return sortName;

}

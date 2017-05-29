
$(document).ready(function () {
	var href = window.location.href;
	var splitString = href.split("/");
	var WeedID = splitString[splitString.length -1];
	getWeedObject(WeedID);
})

function getWeedObject(WeedID) {
	$.getJSON("/getWeed/" + WeedID, function (data) {
		var WeedObject = data[0];
		$("#ID").val(WeedObject.WeedID);
		$("#WeedName").val(WeedObject.WeedName);
		$("#WeedDesc").val(WeedObject.WeedDesc);
	});
}
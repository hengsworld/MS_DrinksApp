
$(document).ready(function () {
	var href = window.location.href;
	var splitString = href.split("/");

	var PersonID = splitString[splitString.length -1];
	getPersonObject(PersonID);
})

function getPersonObject(PersonID) {
	console.log(PersonID)
	$.getJSON("/getPerson/" + PersonID, function (data) {
		var PersonObject = data[0];
		$("#CustomerID").val(PersonObject.CustomerID);
		$("#Fname").val(PersonObject.Fname);
		$("#Lname").val(PersonObject.Lname);
		$("#DOB").val(PersonObject.DOB);
	});
}
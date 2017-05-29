
$(document).ready(function () {
	var href = window.location.href;
	var splitString = href.split("/");

	var PersonID = splitString[splitString.length -1];
	getPersonObject(PersonID);
})

function getPersonObject(PersonID) {
	$.getJSON("/getPerson/" + PersonID, function (data) {
		var PersonObject = data[0];
		$("#CustomerID").val(PersonObject.PersonID);
		$("#Fname").val(PersonObject.PersonFname);
		$("#Lname").val(PersonObject.PersonLname);
		$("#DOB").val(PersonObject.PersonDOB);
	});
}
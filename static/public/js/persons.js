var showAllPersonsBtn = $('#btn-showAllPersons');
console.log(showAllPersonsBtn);
showAllPersonsBtn.click(function (event) {
  console.log("button pressed")
  getPersons();
});

function getPersons() {
  $.getJSON("/Persons/all", function (data) {
    var table = $("#resultsTable");
    var tableHead = $('#tablehead');
    document.getElementById('resultsTable').innerHTML = "";
    document.getElementById('tablehead').innerHTML = "";
    tableHead.append(
        "<th>PersonID</th><th>First Name</th>" + 
        "<th>Last Name</th><th>Date of Birth</th>" +
        "<th>Edit</th><th>Delete</th>");
    $.each(data, function (ID, PersonObject) {
      var rowData = $('<tr></tr>');
      rowData.append("<td>" + PersonObject.PersonID + "</td>");
      rowData.append("<td>" + PersonObject.PersonFname + "</td>");
      rowData.append("<td>" + PersonObject.PersonLname + "</td>");
      rowData.append("<td>" + PersonObject.PersonDOB + "</td>");
      rowData.append("<td><button type='submit' class='btn btn-info' onclick='editPerson("
          + PersonObject.PersonID + ")'>Edit</button></td>");
      rowData.append("<td><button type='submit' class='btn btn-info'onclick='deletePerson("
          + PersonObject.PersonID + ")'>Delete</button></td>");
      table.append(rowData);
    });
  });
}

function editPerson(PersonID) {
  window.location.href = "/editPerson/" + PersonID;
}

function deletePerson(PersonID) {
  console.log("Delete Person");
  window.location.href = "/deletePerson/" + PersonID;
}
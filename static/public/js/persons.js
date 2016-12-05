var showAllPersonsBtn = $('#btn-showAllPersons');
console.log(showAllPersonsBtn);
showAllPersonsBtn.click(function (event) {
  console.log("button pressed")
  getPersons();
});

function getPersons() {
  $.getJSON("/Persons/all", function (data) {
    var table = $("#resultsTable");
    $.each(data, function (ID, PersonObject) {
      var rowData = $('<tr></tr>');
      rowData.append("<td>" + PersonObject.PersonID + "<td>");
      rowData.append("<td>" + PersonObject.PersonFname + "<td>");
      rowData.append("<td>" + PersonObject.PersonLname + "<td>");
      rowData.append("<td>" + PersonObject.PersonDOB + "<td>");
      rowData.append("<button type='submit' class='btn btn-info' onclick='editPerson("
          + PersonObject.PersonID + ")'>Edit</button>");
      rowData.append("<button type='submit' class='btn btn-info'onclick='deletePerson("
          + PersonObject.PersonID + ")'>Delete</button>");
      table.append(rowData);
    });
  });
}

function editPerson(PersonID) {
  window.location.href = "/edit/" + PersonID;
}

function deletePerson(PersonID) {
  console.log("Delete Person");
  window.location.href = "/delete/" + PersonID;
}
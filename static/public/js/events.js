var showAllEventsBtn = $('#btn-showAllEvents');
console.log(showAllEventsBtn);
showAllEventsBtn.click(function (event) {
  console.log("button pressed")
  getEvents();
});

function getEvents() {
  $.getJSON("/Events/all", function (data) {
    var table = $("#resultsTable");
    var tableHead = $('#tablehead');
    document.getElementById('resultsTable').innerHTML = "";
    document.getElementById('tablehead').innerHTML = "";

    tableHead.append(
        "<th>EventID</th><th>EventTypeID</th>" + 
        "<th>Quantity</th>" + "<th>Event Time</th>" +
        "<th>FridgeID</th>" + "<th>TeamPersonID</th>");
    $.each(data, function (ID, EventObject) {
      var rowData = $('<tr></tr>');
      rowData.append("<td>" + EventObject.EventID + "</td>");
      rowData.append("<td>" + EventObject.EventTypeID + "</td>");
      rowData.append("<td>" + EventObject.Quantity + "</td>");
      rowData.append("<td>" + EventObject.EventTime + "</td>");
      rowData.append("<td>" + EventObject.FridgeID + "</td>");
      rowData.append("<td>" + EventObject.TeamPersonID + "</td>");
      table.append(rowData);
    });
  });
}

function editEvent(EventID) {
  window.location.href = "/editEvent/" + EventID;
}

function deleteEvent(EventID) {
  console.log("Delete Event");
  window.location.href = "/delete/" + EventID;
}
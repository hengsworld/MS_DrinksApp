var showAllWeedsBtn = $('#btn-showAllWeeds');
console.log(showAllWeedsBtn);
showAllWeedsBtn.click(function (event) {
  console.log("button pressed")
  getWeeds();
});

function getWeeds() {
  $.getJSON("/Weeds/all", function (data) {
    var table = $("#resultsTable");
    var tableHead = $('#tablehead');
    document.getElementById('resultsTable').innerHTML = "";
    document.getElementById('tablehead').innerHTML = "";

    tableHead.append(
        "<th>WeedID</th><th>Weed Name</th>" + 
        "<th>Weed Description</th>" +
        "<th>Edit</th><th>Delete</th>");
    $.each(data, function (ID, WeedObject) {
      var rowData = $('<tr></tr>');
      rowData.append("<td>" + WeedObject.ProductID + "</td>");
      rowData.append("<td>" + WeedObject.ProductTypeID + "</td>");
      rowData.append("<td>" + WeedObject.ProductName + "</td>");
      rowData.append("<td>" + WeedObject.ProductDesc + "</td>");
      rowData.append("<td><button type='submit' class='btn btn-info' onclick='editWeed("
          + WeedObject.WeedID + ")'>Edit</button></td>");
      rowData.append("<td><button type='submit' class='btn btn-info'onclick='deleteWeed("
          + WeedObject.WeedID + ")'>Delete</button></td>");
      table.append(rowData);
    });
  });
}

function editWeed(WeedID) {
  window.location.href = "/editWeed/" + WeedID;
}

function deleteWeed(WeedID) {
  console.log("Delete Weed");
  window.location.href = "/deleteWeed/" + WeedID;
}
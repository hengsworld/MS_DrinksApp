var showAllDrinksBtn = $('#btn-showAllDrinks');
console.log(showAllDrinksBtn);
showAllDrinksBtn.click(function (event) {
  console.log("button pressed")
  getDrinks();
});

function getDrinks() {
  $.getJSON("/Drinks/all", function (data) {
    var table = $("#resultsTable");
    var tableHead = $('#tablehead');
    document.getElementById('resultsTable').innerHTML = "";
    document.getElementById('tablehead').innerHTML = "";

    tableHead.append(
        "<th>DrinkID</th><th>Drink Name</th>" + 
        "<th>Drink Description</th>" +
        "<th>Edit</th><th>Delete</th>");
    $.each(data, function (ID, DrinkObject) {
      var rowData = $('<tr></tr>');
      rowData.append("<td>" + DrinkObject.DrinkID + "</td>");
      rowData.append("<td>" + DrinkObject.DrinkName + "</td>");
      rowData.append("<td>" + DrinkObject.DrinkDesc + "</td>");
      rowData.append("<td><button type='submit' class='btn btn-info' onclick='editDrink("
          + DrinkObject.DrinkID + ")'>Edit</button></td>");
      rowData.append("<td><button type='submit' class='btn btn-info'onclick='deleteDrink("
          + DrinkObject.DrinkID + ")'>Delete</button></td>");
      table.append(rowData);
    });
  });
}

function editDrink(DrinkID) {
  window.location.href = "/editDrink/" + DrinkID;
}

function deleteDrink(DrinkID) {
  console.log("Delete Drink");
  window.location.href = "/deleteDrink/" + DrinkID;
}
function loadDataFromTables(targetArray) { //targetArray generation
  //load data from JSON
  var divPageStats = document.getElementById("pageStats");
  divPageStats.innerHTML = "Loading data...";

  var xmlHttpR = new XMLHttpRequest();
  xmlHttpR.onreadystatechange = function() {
    if (this.readyState === 4 && this.status == 200) {
      var importJSON = JSON.parse(this.responseText);
      var food = importJSON.gl_food;
      var ifep = importJSON.gl_fepmod;
      
      for (var food_index = 0; food_index < food.length; food_index++) {
        if (food[food_index][1].length > 0) { //if food has variable ingredients cycle through all FEP mods records
          for (var j = 0; j < ifep.length; ) {
            if (ifep[j][0] == food[food_index][0]) {
              targetArray.push([ifep[j][0], ifep[j][1], ifep[j][2], food[food_index][3], food[food_index][4], false]);
              ifep.splice(j, 1); //remove found FEP mods record to exclude it from future cycles
            } else {
              j++;
            }
          }
        } else {
          targetArray.push([food[food_index][0], food[food_index][1], food[food_index][2], food[food_index][3], food[food_index][4], false]);
        }
      }
      refreshView();
    }
  }
  xmlHttpR.open("GET", "tables.json", true);
  xmlHttpR.send();
}
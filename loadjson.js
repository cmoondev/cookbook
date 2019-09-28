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
      var sats = importJSON.gl_sat;

      for (var fi = 0; fi < food.length; fi++) {
         if (food[fi][1].length > 0) { //if food has variable ingredients...
           for (var j = 0; j < ifep.length; ) { // ...then cycle through all FEP mods records

             if (ifep[j][0] == food[fi][0]) {
              targetArray.push([ ifep[j][0], ifep[j][1], ifep[j][2], sumFEP(ifep[j][2]), food[fi][4], (sumFEP(ifep[j][2]) / food[fi][4]), sats[food[fi][0]] ]);
               ifep.splice(j, 1); //remove found FEP mods record to exclude it from future cycles
             } else {
               j++;
             }
           }

         } else { // ...else just add food as one single row (Name, Ings, FEP, F, H, F/H, V)
          targetArray.push([ food[fi][0], food[fi][1], food[fi][2], sumFEP(food[fi][2]), food[fi][4], (sumFEP(food[fi][2]) / food[fi][4]), sats[food[fi][0]] ]);
        }
      }
      refreshView();
    }
  }
  var dataPath = "rawdata\/" + opts.defaultData + "\/tables.json";
  xmlHttpR.open("GET", dataPath, true);
  xmlHttpR.send();
}
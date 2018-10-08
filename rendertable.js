var displayData = [];
var PageState = {
  HideIndex: 6,
  PageNumber: 1, //starts with 1
  SearchRequest: {
    Name: "",
    Ing: "",
    FEPAtr: "",
    FEPVal: 0,
    ChanceMin: 0,
    ChanceMax: 100
  }
};
document.onLoad = main();

function eventShortName(key) {
  var result = null;
  for (var k1 in evSName) {
    if (key == k1) {
      result = evSName[key];
      break;
    }
  }
  return result;
}

function eventColor(key) {
  var result = "silver";
  for (var k1 in evColor) {
    if (key == k1) {
      result = evColor[key];
      break;
    }
  }
  return result;
}

function sumFEP(objFEP) {
  var result = 0;
  for (var k in objFEP) {
    result += objFEP[k];
  }
  return result;
}

function calcP(objFEP) {
  var maxF = PageState.SearchRequest.FEPAtr.slice(0,3);
  var maxV = 0;
  var totalV = 0;
  if (maxF == "") {  //search for max fep when attribute filter is empty
    for (var k in objFEP) {
      if (objFEP[k] > maxV) {
          maxF = k.slice(0, 3);
          maxV = objFEP[k];
      }
    }
  }

  //sum points of +1 and +2 events
  for (var k in objFEP) {
    if (k.indexOf(maxF) !== -1) {
        totalV += objFEP[k];
    }
  }
  return totalV/sumFEP(objFEP);
}

function parseFEP(objFEP) {
  var result = document.createElement("div");
  result.className = "fep-list";
  var keyArray = [];
  for (var k1 in objFEP) {
    keyArray.push(k1);
  }
  //sorting here
  for (var i = 0; i < keyArray.length - 1; i++) {
    for (var j = i + 1; j < keyArray.length; j++) {
      if (objFEP[keyArray[i]] < objFEP[keyArray[j]]) {
        var buffer = keyArray[i];
        keyArray[i] = keyArray[j];
        keyArray[j] = buffer;
      }
    }
  }
  //sorting end
  for (var i = 0; i < keyArray.length; i++) {
    var spnEn = document.createElement("span");
    spnEn.className = "fep-name";
    spnEn.innerHTML = eventShortName(keyArray[i]) + " ";

    var spnEv = document.createElement("span");
    spnEv.className = "fep-value";
    spnEv.innerHTML = formatVal(objFEP[keyArray[i]], "d2fd");

    var dvE = document.createElement("div");
    dvE.classList.add("fep-single");
    dvE.appendChild(spnEn);
    dvE.appendChild(spnEv);
    dvE.classList.add(keyArray[i]);
    result.appendChild(dvE);
  }
  return result;
}
function parseIng(arrIng) {
  var result = document.createElement("div");
  result.className = "ing-list";
  for (var k1 = 0; k1 < arrIng.length; k1++) {

    var tnIng = document.createTextNode(arrIng[k1] + (k1 < arrIng.length-1 ? ", " : ""));

    var dvI = document.createElement("div");
    dvI.title = arrIng[k1];
    dvI.classList.add(formatVal(arrIng[k1], "aztext"));
    dvI.classList.add("ing-single");
    dvI.appendChild(tnIng);
    result.appendChild(dvI);
  }
  return result;
}

function resetSorted() {
  var headers = document.getElementById("data-headers");
  var headrow = headers.getElementsByTagName("div");
  for (var i = 0; i < headrow.length; i++) {
    headrow[i].className = headrow[i].className.replace("sorttable_sorted_reverse", "").replace("sorttable_sorted", "");
  }
}

function filterData(array) {
  PageState.PageNumber = 1;

  var tmpFilterFEP  = document.getElementById("filterFEP").value;
  var tmpFilterChanceMin  = document.getElementById("filterChanceMin").value;
  var tmpFilterChanceMax  = document.getElementById("filterChanceMax").value;

  PageState.SearchRequest.Name = document.getElementById("filterFood").value;
  PageState.SearchRequest.Ing = document.getElementById("filterIng").value;

  if (!isNaN(parseFloat(tmpFilterChanceMin))) {
    PageState.SearchRequest.ChanceMin = parseFloat(tmpFilterChanceMin);
  } else {
    PageState.SearchRequest.ChanceMin = 0;
  }

  if (!isNaN(parseFloat(tmpFilterChanceMax))) {
    PageState.SearchRequest.ChanceMax = parseFloat(tmpFilterChanceMax);
  } else {
    PageState.SearchRequest.ChanceMax = 100;
  }

  var enableFEPSearch = false;
  if (tmpFilterFEP.lastIndexOf(" ") !== -1)
  {
    var tmpFilterFEPAtr = tmpFilterFEP.slice(0, tmpFilterFEP.lastIndexOf(" "));
    var tmpFilterFEPMod = parseFloat(tmpFilterFEP.slice(tmpFilterFEP.lastIndexOf(" ")));
    if (tmpFilterFEPAtr.length > 2 && !isNaN(tmpFilterFEPMod)) {
      PageState.SearchRequest.FEPAtr = trimFE(tmpFilterFEPAtr);
      PageState.SearchRequest.FEPVal = tmpFilterFEPMod;
      enableFEPSearch = true;
    }
  }

  for (var i = 0; i < array.length; i++) {
    array[i][PageState.HideIndex] = false; //unhide every row
    //filter by name
    if (PageState.SearchRequest.Name.length > 0) {
      var itemName = array[i][0];
      if (!azContains(itemName, PageState.SearchRequest.Name)) {
        array[i][PageState.HideIndex] = true;
        continue;
      }
    }

    //filter by ing
    if (PageState.SearchRequest.Ing.length > 0) {
      var itemIngArray = array[i][1];
      var noIngFound = true;
      for (var j = 0; j < itemIngArray.length; j++) {
        if (azContains(itemIngArray[j], PageState.SearchRequest.Ing)) {
          noIngFound = false;
          break;
        }
      }
      if (noIngFound){
        array[i][PageState.HideIndex] = true;
        continue;
      }
    }

    //filter by FEP
    if (enableFEPSearch) {
      var itemFEPObject = array[i][2];
      var noFEPFound = true;
      for (var j in itemFEPObject)
      {
        if (j.indexOf(PageState.SearchRequest.FEPAtr) !== -1) {
          if (PageState.SearchRequest.FEPVal <= itemFEPObject[j]) { 
            noFEPFound = false;
            break;
          }
        }
      }

      if (noFEPFound) {
        array[i][PageState.HideIndex] = true;
      }
    }

    //filter by chance
    var itemChance = calcP(array[i][2]);
    if ((PageState.SearchRequest.ChanceMin > 0) && (itemChance < PageState.SearchRequest.ChanceMin/100)
      || (PageState.SearchRequest.ChanceMax < 100) && (itemChance > PageState.SearchRequest.ChanceMax/100)) {
      array[i][PageState.HideIndex] = true;  
    }
  }
}

function trimFE(input) {
  return result = input.toLowerCase().replace(/\ /g, "").replace(/\+/g, "");
}

function resetFields() {
  var filters = document.getElementById("fields_middle").childNodes;
  for (var i = 0; i < filters.length; i++)
    if (filters[i].nodeName = "#text") filters[i].value = "";
  refreshView();
}

function renderTable(array) {
  var tbody = table.getElementsByTagName("tbody")[0];
  while (tbody.firstChild) tbody.removeChild(tbody.firstChild);
  tbody.innerHTML = "";
  var renderedRowCount = 0;
  var resultRowCount = 0;
  var skippedRowCount = 0;
  var StartRender = PageState.PageNumber - 1;

  for (var i = 0; i < array.length; i++) {
    if (array[i][PageState.HideIndex] == true) continue;
    resultRowCount++;
    if (renderedRowCount>=opts["limit"]) continue;
    if (skippedRowCount < (opts.limit*StartRender)) {
        skippedRowCount++;
        continue;
      }

    var row = document.createElement("tr");
    var cells = [];

    for (var j = 0; j <= 6; j++) {
      cells[j] = document.createElement("td");
    }
    var totalFEPs = sumFEP(array[i][2]);
    cells[0].innerHTML = array[i][0];
    cells[1].appendChild(parseIng(array[i][1]));
    cells[2].appendChild(parseFEP(array[i][2]));
    for (var j = 0; j < cells.length; j++) {
      row.appendChild(cells[j]);
    }
    cells[3].innerHTML = array[i][4] == 0 ? "???" : formatVal(totalFEPs, "d2fd");
    cells[4].innerHTML = array[i][4];
    cells[5].innerHTML = array[i][4] == 0 ? "???" : formatVal(totalFEPs / array[i][4], "d2fd");
    cells[6].innerHTML = formatVal(calcP(array[i][2]), "d2pp");

    var divHdrChance = document.getElementById("hdr-chance");
    var divHdrChanceSub = document.createElement("span");
    var eMax = PageState.SearchRequest.FEPAtr.slice(0, 3);
    divHdrChanceSub.innerHTML = "" + (eMax == "" ? "max" : eMax) + "";
    divHdrChanceSub.classList.add("sublabel");
    divHdrChance.innerHTML = "%";
    divHdrChance.appendChild(divHdrChanceSub);
    // row.id = i;
    tbody.appendChild(row);
    renderedRowCount++;
  }

  //           PAGINATION              //

  var divPageStats = document.getElementById("pageStats");
  var divPageNumbers = document.getElementById("pageNumbers");
  var pageAmount = Math.ceil(resultRowCount/opts.limit);

  if (pageAmount <= 1) {
    while (divPageStats.firstChild) divPageStats.removeChild(divPageStats.firstChild);
    divPageStats.innerHTML = (pageAmount == 1 ? "" : "Nothing found");
    while (divPageNumbers.firstChild) divPageNumbers.removeChild(divPageNumbers.firstChild);
    divPageNumbers.innerHTML = "";
    return;
  }

  divPageStats.innerHTML = renderedRowCount + " out of " + resultRowCount + " results are displayed. ";
  divPageStats.innerHTML += "Page: " + PageState.PageNumber + " of " + pageAmount;

  while (divPageNumbers.firstChild) divPageNumbers.removeChild(divPageNumbers.firstChild);
  var PageAMTLimit = 5;
  var PageAMTShowed = 0;
  var PageNumbersBL = [];
  var PageNumbersBS = [];
  var PageNumbersAS = [];
  var PageNumbersAL = [];

  var pn = Math.floor((PageState.PageNumber - PageAMTLimit) / 10 - 1) * 10;
  while (pn > 0) {
    PageNumbersBL.push(pn);
    pn -= 10;
  }
  PageNumbersBL.reverse();

  var pnCounter = 0;
  pn = PageState.PageNumber - 1;
  while ((pnCounter < PageAMTLimit) && (pn > 0)) {
    PageNumbersBS.push(pn);
    pn--;
    pnCounter++;
  }
  PageNumbersBS.reverse();

  pnCounter = 0;
  pn = PageState.PageNumber;
  while ((pnCounter < PageAMTLimit) && (pn < pageAmount)) {
    pn++;
    PageNumbersAS.push(pn);
    pnCounter++;
  }

  pn = Math.ceil((PageState.PageNumber + PageAMTLimit + 1) / 10) * 10;
  while (pn < pageAmount) {
    PageNumbersAL.push(pn);
    pn += 10;
  }

  if (PageState.PageNumber > 1 && PageState.PageNumber-PageAMTLimit > 1) {
    divPageNumbers.appendChild(paginationNewPagelink(1, "first"));
    divPageNumbers.appendChild(paginationNewSeparator());
  }

  if (PageNumbersBL.length !== 0) {
    for (var j = 0; j < PageNumbersBL.length; j++) 
      divPageNumbers.appendChild(paginationNewPagelink(PageNumbersBL[j], "bl"));
    divPageNumbers.appendChild(paginationNewSeparator());
  }
  
  for (var j = 0; j < PageNumbersBS.length; j++)
      divPageNumbers.appendChild(paginationNewPagelink(PageNumbersBS[j], "bs"));
  
    divPageNumbers.appendChild(paginationNewPagelink(PageState.PageNumber, "current"));
  
  for (var j = 0; j < PageNumbersAS.length; j++)
      divPageNumbers.appendChild(paginationNewPagelink(PageNumbersAS[j], "as"));

  if (PageNumbersAL.length !== 0) {
    divPageNumbers.appendChild(paginationNewSeparator());
    for (var j = 0; j < PageNumbersAL.length; j++)
      divPageNumbers.appendChild(paginationNewPagelink(PageNumbersAL[j], "al"));
  }
  
  if (PageNumbersAL[PageNumbersAL.length-1] != pageAmount && PageNumbersAS[PageNumbersAS.length-1] != pageAmount && PageState.PageNumber != pageAmount) {
    divPageNumbers.appendChild(paginationNewSeparator());
    divPageNumbers.appendChild(paginationNewPagelink(pageAmount, "last"));
  }
}

function paginationNewSeparator() {
  var PageSeparator = document.createElement("span");
  PageSeparator.innerHTML = "...";
  PageSeparator.classList.add("separator");
  return PageSeparator;
}

function paginationNewPagelink(pageNumber, className) {
  var PageLink = document.createElement("span");
  PageLink.innerHTML = pageNumber;
  PageLink.id = "turnpage-" + pageNumber;
  PageLink.classList.add("pagenum");
  if (className) PageLink.classList.add(className);
  PageLink.addEventListener("click", turnPage);
  return PageLink;
}

function turnPage() {
  resetSorted();
  var PageID = this.id.split("-")[1];
  PageState.PageNumber = parseInt(PageID);
  renderTable(displayData);
}

function refreshView() {
  resetSorted();
  filterData(displayData);
  renderTable(displayData);
}

function applyTheme() {
  if (opts.debug) {
    var debugStyle = document.createElement("link");
    debugStyle.rel = "stylesheet";
    debugStyle.href = "debug.css";
    document.head.appendChild(debugStyle);
  }

  if (!opts.textmode) {
    var iconStyle = document.createElement("link");
    iconStyle.rel = "stylesheet";
    iconStyle.href = "gfx/ingredient.css";
    document.head.appendChild(iconStyle);
  }

  var themeStyle = document.createElement("link");
  themeStyle.rel = "stylesheet";
  themeStyle.href = "theme_" + opts.theme + ".css";
  document.head.appendChild(themeStyle);
}

function processQuery() { //parses additional options from URL string
  var querystring = window.location.href.split("?")[1];
  if (!querystring) return;
  if (querystring.length == 0) return;

  var optionlist = {};
  var pairs = querystring.split("&");
  for (var i = 0; i < pairs.length; i++) optionlist[pairs[i].split("=")[0]] = pairs[i].split("=")[1];

  if (optionlist.debug == "true") {
    opts.debug = true;
  } else {
    opts.debug = false;
  }

  if (optionlist.textmode == "true") {
    opts.textmode = true;
  } else {
    opts.textmode = false;
  }

  if (optionlist.theme == "dark") opts.theme = "dark";   

  if (optionlist.limit) {
    var limitNum = parseInt(optionlist.limit);
    if (!isNaN(limitNum)) opts.limit = Math.max(limitNum, 30);
  } 
}

function main() {
  processQuery();
  applyTheme();
  window.addEventListener("keydown", function(event) {
    if (event)
      switch (event.keyCode) {
        case 27 : //ESC
          event.preventDefault();
          resetFields();
          break;
        case 13 : //Enter
          event.preventDefault();
          refreshView();
          break;
        default : return;
      }
    });
  document.getElementById("btnReset").addEventListener("click", resetFields);
  document.getElementById("btnSearch").addEventListener("click", refreshView);
  loadDataFromTables();
}

function loadDataFromTables() { //displayData generation
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
              displayData.push([ifep[j][0], ifep[j][1], ifep[j][2], food[food_index][3], food[food_index][4], false]);
              ifep.splice(j, 1); //remove found FEP mods record to exclude it from future cycles
            } else {
              j++;
            }
          }
        } else {
          displayData.push([food[food_index][0], food[food_index][1], food[food_index][2], food[food_index][3], food[food_index][4], false]);
        }
      }
      refreshView();
    }
  }
  xmlHttpR.open("GET", "tables.json", true);
  xmlHttpR.send();
}
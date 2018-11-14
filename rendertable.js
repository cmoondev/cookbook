var displayData = [];
var staticData = [];
var PageState = {
  HideIndex: 6,
  PageNumber: 1, //starts with 1
  Sorting: {
    "col": "food",
    "order": "A"
  },
  SearchRequest: {
    "Food" : {
      "incl" : [],
      "excl" : []
    },
    "Ingr" : {
      "incl" : [],
      "excl" : []
    },
    "Name": "",
    "Ing": "",
    "FEPAtr": "",
    "FEPVal": 0,
    "ChanceMin": 0,
    "ChanceMax": 100
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
  //JS sort function
  keyArray.sort( function(a, b) {
    return (objFEP[b] - objFEP[a])
  } );
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
  if (!arrIng) return result;
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

function prepareData(array, target) {
  PageState.PageNumber = 1;

  //filers init
  var tmpFilterFEP = document.getElementById("filterFEP").value;
  var tmpFilterChanceMin = document.getElementById("filterChanceMin").value;
  var tmpFilterChanceMax = document.getElementById("filterChanceMax").value;

  //food name filter init
  PageState.SearchRequest.Food.incl.length = 0;
  PageState.SearchRequest.Food.excl.length = 0;
  var SRAFoodName = formatVal(document.getElementById("filterFood").value, "azspaceminustext").split(" ");
  for (var i = 0; i < SRAFoodName.length; i++) {
    var sprtdFoodName = formatVal(SRAFoodName[i], "aztext");
    if (sprtdFoodName.length == 0) continue;
    if (SRAFoodName[i].indexOf("-") == 0) {
      PageState.SearchRequest.Food.excl.push(sprtdFoodName);
    } else {
      PageState.SearchRequest.Food.incl.push(sprtdFoodName);
    }
  }
  //food name filter end

  //food ingr filter init
  PageState.SearchRequest.Ingr.incl.length = 0;
  PageState.SearchRequest.Ingr.excl.length = 0;
  var SRAFoodIngr = formatVal(document.getElementById("filterIng").value, "azspaceminustext").split(" ");
  for (var i = 0; i < SRAFoodIngr.length; i++) {
    var sprtdFoodIngr = formatVal(SRAFoodIngr[i], "aztext");
    if (sprtdFoodIngr.length == 0) continue;
    if (SRAFoodIngr[i].indexOf("-") == 0) {
      PageState.SearchRequest.Ingr.excl.push(sprtdFoodIngr);
    } else {
      PageState.SearchRequest.Ingr.incl.push(sprtdFoodIngr);
    }
  }
  //food ingr filter end  


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
  } else {
    PageState.SearchRequest.FEPAtr = "";
    PageState.SearchRequest.FEPVal = 0;
  }

  var divHdrChance = document.getElementById("hdr-chance");
  var divHdrChanceSub = document.createElement("span");
  var eMax = PageState.SearchRequest.FEPAtr.slice(0, 3);
  divHdrChanceSub.innerHTML = "" + (eMax == "" ? "max" : eMax) + "";
  divHdrChanceSub.classList.add("sublabel");
  divHdrChance.innerHTML = "%";
  divHdrChance.appendChild(divHdrChanceSub);

  //data processing
  var temp = [];
  for (var i = 0; i < array.length; i++) {
    var exclude = false; //unhide every row
    
    //filter by name
    var itemName = array[i][0];
    for (var j = 0; j < PageState.SearchRequest.Food.incl.length; j++) {
      if ( !azContains(itemName, PageState.SearchRequest.Food.incl[j]) ) {
        exclude = true;
        continue;
      }
    }
    for (var j = 0; j < PageState.SearchRequest.Food.excl.length; j++) {
      if ( azContains(itemName, PageState.SearchRequest.Food.excl[j]) ) {
        exclude = true;
        continue;
      }
    }

    //filter by ing
    var itemIngArray = array[i][1];
    var ingFound = 0;
    for (var j = 0; j < PageState.SearchRequest.Ingr.incl.length; j++) {
      for (var k = 0; k < itemIngArray.length; k++) {
        if ( azContains(itemIngArray[k], PageState.SearchRequest.Ingr.incl[j]) ) {
          ingFound++;
          break;
        }
      }
    }
    if (ingFound < PageState.SearchRequest.Ingr.incl.length) { //if not every incl-ingredient found
      exclude = true;
      continue;
    }

    ingFound = 0;
    for (var j = 0; j < PageState.SearchRequest.Ingr.excl.length; j++) {
      for (var k = 0; k < itemIngArray.length; k++) {
        if ( azContains(itemIngArray[k], PageState.SearchRequest.Ingr.excl[j]) ) {
          ingFound++;
          break;
        }
      }
    }
    if (ingFound != 0) { //if any excl-ingredient found
      exclude = true;
      continue;
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
        exclude = true;
        continue;
      }
    }

    //filter by chance
    var itemChance = calcP(array[i][2]);
    if ((PageState.SearchRequest.ChanceMin > 0) && (itemChance < PageState.SearchRequest.ChanceMin/100) ||
    (PageState.SearchRequest.ChanceMax < 100) && (itemChance > PageState.SearchRequest.ChanceMax/100)) {
      exclude = true;
      continue;
    }

    if (exclude == false) {
      temp.push([ array[i][0], array[i][1], array[i][2], array[i][3], array[i][4], array[i][5], calcP(array[i][2])]);
    }
  }
  return temp;
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

function sortFloat(data, rowA, rowB, colN) {
  if (PageState.Sorting.order == "A") return ( data[rowA][colN] - data[rowB][colN] );
  return ( data[rowB][colN] - data[rowA][colN] );
}

function renderTable(array) {
  //sorting
  var sortIndexes = [];
  for (var i = 0; i < array.length; i++) {
    sortIndexes.push(i);
  }
  switch (PageState.Sorting.col) {
    case "food": 
      sortIndexes.sort( function(a, b) {
        if (array[a][0] == array[b][0]) return 0;
        if (PageState.Sorting.order == "A") {
          return (array[a][0] > array[b][0] ? 1 : -1);
        } else {
          return (array[a][0] < array[b][0] ? 1 : -1);
        }
      } );
      break;
    case "f": 
      sortIndexes.sort( function(a, b) { return sortFloat(array, a, b, 3); });
      break;
    case "h": 
      sortIndexes.sort(function(a, b) { return sortFloat(array, a, b, 4); });
      break;
    case "fh": 
      sortIndexes.sort(function(a, b) { return sortFloat(array, a, b, 5); });
      break;
    case "chance": 
      sortIndexes.sort(function(a, b) { return sortFloat(array, a, b, 6); });
      break;
    }

  //rendering
  var tbody = table.getElementsByTagName("tbody")[0];
  while (tbody.firstChild) tbody.removeChild(tbody.firstChild);
  tbody.innerHTML = "";

  var renderedRowCount = 0;
  var totalRowCount = array.length;
  var skippedRowCount = 0;
  var StartRender = PageState.PageNumber - 1;

  for (var i = 0; i < sortIndexes.length; i++) {
    var currentRow = array[sortIndexes[i]];
    if (renderedRowCount >= opts["limit"]) break;

    //skipping previous pages
    if (skippedRowCount < (opts.limit * StartRender)) {
      skippedRowCount++;
      continue;
    }

    var row = document.createElement("tr");
    var cells = [];
    for (var j = 0; j <= 6; j++) {
      cells[j] = document.createElement("td");
      row.appendChild(cells[j]);
    }
    /*Food*/ cells[0].innerHTML = currentRow[0];
    /*Ingr*/ cells[1].appendChild(parseIng(currentRow[1]));
    /*FEPs*/ cells[2].appendChild(parseFEP(currentRow[2]));
    /* F */  cells[3].innerHTML = formatVal(currentRow[3], "d2fd");
    /* H */  cells[4].innerHTML = currentRow[4];
    /*F/H*/  cells[5].innerHTML = formatVal(currentRow[5], "d2fd");
    /*FEP%*/ cells[6].innerHTML = formatVal(currentRow[6], "d2pp");
    tbody.appendChild(row);
    renderedRowCount++;
  }

  //PAGINATION
  var divPageStats = document.getElementById("pageStats");
  var divPageNumbers = document.getElementById("pageNumbers");
  var pageAmount = Math.ceil(totalRowCount/opts.limit);

  if (pageAmount <= 1) {
    while (divPageStats.firstChild) divPageStats.removeChild(divPageStats.firstChild);
    divPageStats.innerHTML = (pageAmount == 1 ? "" : "Nothing found");
    while (divPageNumbers.firstChild) divPageNumbers.removeChild(divPageNumbers.firstChild);
    divPageNumbers.innerHTML = "";
    return;
  }

  divPageStats.innerHTML = renderedRowCount + " out of " + totalRowCount + " results are displayed. ";
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
  var PageID = this.id.split("-")[1];
  PageState.PageNumber = parseInt(PageID);
  renderTable(displayData);
}

function refreshView() {
  displayData.length = 0;
  displayData = prepareData(staticData);
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

function sortTable(sender) {
  var newSorting = sender.slice(sender.lastIndexOf("-") + 1, sender.length);

  PageState.PageNumber = 1;
  if (newSorting == PageState.Sorting.col) {
    PageState.Sorting.order = switchOrder();;
  } else {
    PageState.Sorting.col = newSorting;  
    PageState.Sorting.order = defaultOrder();
  }

  renderTable(displayData);
}

function defaultOrder() {
  if (PageState.Sorting.col == "food") return "A";
  return "D";
}

function switchOrder() {
  if (PageState.Sorting.order == "D") return "A";
  return "D";
}

function addEL() {
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

  var headersEls = document.getElementsByClassName("hdr");
  for (var i = 0; i < headersEls.length; i++) {
    headersEls[i].addEventListener("click", function() {
      sortTable(this.id);
    });
  }
}

function main() {
  processQuery();
  applyTheme();
  addEL();
  loadDataFromTables(staticData);
}
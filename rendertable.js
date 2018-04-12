var displayData = [];
document.onLoad = main();


function formatVal(val, format) {
	if( !format ) return val;
	switch ( format ) {
		case "sign" : 
			return val > 0 ? "+" + val : val ;
			break;
		case "d2pr" : 
			return Math.round(val*10000)/100 + "%";
			break;
		case "d2sd" :
			return Math.round(val*100)/100;
			break;
		case "d2fd" :
			var res = Math.round(val*10)/10;
			if( res-Math.round(res) === 0) res += ".0";
			return res + " ";
			break;
		case "h2hm" :
			var hrs = (val/60 < 10 ? "0" : "") + Math.floor(val/60);
			var mns = (val%60 < 10 ? "0" : "") + Math.round(val%60);
			return hrs + ":" + mns;
			break;
		default :
			return val;
	}	
}

function eventShortName(key) {
	var result = null;
	for( var k1 in evSName ) {
		if( key == k1 ) {
			result = evSName[key];
			break;
		}
	}
	return result;
}

function eventColor(key) {
	var result = "silver";
	for( var k1 in evColor ) {
		if( key == k1 ) {
			result = evColor[key];
			break;
		}
	}
	return result;
}

function parseFEP(objFEP) {
	var result = document.createElement("div");
	result.className = "fep-list";
	for( var k1 in objFEP ) {
		var spnEn = document.createElement("span");
		spnEn.className = "fep-name";
		spnEn.innerHTML = eventShortName(k1) + " ";

		var spnEv = document.createElement("span");
		spnEv.className = "fep-value";
		spnEv.innerHTML = formatVal(objFEP[k1], "d2fd");

		var dvE = document.createElement("div");
		dvE.className = "fep-single";
		dvE.appendChild(spnEn);
		dvE.appendChild(spnEv);
		dvE.style.backgroundColor = eventColor(k1);
		result.appendChild(dvE);
	}
	return result;
}

function parseIng(arrIng) {
	var result = document.createElement("div");
	result.className = "ing-list";
	for( var k1 = 0; k1 < arrIng.length; k1++) {
		// if( arrIng[k1] == "Mix") continue;


		var spnIn = document.createElement("span");
		spnIn.className = "ing-name";
		spnIn.innerHTML = arrIng[k1];

		var dvI = document.createElement("div");
		dvI.className = "ing-single";
		dvI.appendChild(spnIn);
		result.appendChild(dvI);
		empty = false;
		if(  k1 < arrIng.length-1 ) {
			var spr = document.createTextNode(", ");
			dvI.appendChild(spr);
		}
	}
	return result;
}

function resetSorted() {
	var headers = document.getElementById('data-headers');
	var headrow = headers.getElementsByTagName("div");
	for( var i = 0; i < headrow.length; i++) {
		headrow[i].className = headrow[i].className.replace("sorttable_sorted_reverse", "").replace("sorttable_sorted", "");
	}
}

function filterData(array) {
	var filterFood	= document.getElementById("filterFood").value;
	var filterIng	= document.getElementById("filterIng").value;
	var filterFEP	= document.getElementById("filterFEP").value;

	var enableFEPSearch = false;
	if( filterFEP.lastIndexOf(" ") !== -1 )
	{
		var filterFEPAtr = filterFEP.slice(0, filterFEP.lastIndexOf(" "));
		var filterFEPMod = parseFloat(filterFEP.slice(filterFEP.lastIndexOf(" ")));
		if( filterFEPAtr.length > 2 && !isNaN(filterFEPMod) ) {
			filterFEPAtr = trimFE(filterFEPAtr);
			enableFEPSearch = true;
		}
	}

	for( var i = 0; i < array.length; i++) {
		array[i][4] = false; //unhide every single row
		
		//filter by name
		if( filterFood.length > 0 ) {
			var itemName = array[i][0];
			if( itemName.toUpperCase().indexOf(filterFood.toUpperCase()) == -1 ) {
				array[i][4] = true;
				continue;
			}
		}

		//filter by ing
		if( filterIng.length > 0 ) {
			var itemIngArray = array[i][1];
			var noIngFound = true;
			for( var j = 0; j < itemIngArray.length; j++) {
				if( itemIngArray[j].toUpperCase().indexOf(filterIng.toUpperCase()) != -1 ) {
					noIngFound = false;
					break;
				}
			}
			if( noIngFound ){
				array[i][4] = true;
				continue;
			}
		}

		//filter by FEP
		if( enableFEPSearch ) {
			var itemFEPObject = array[i][2];
			var noFEPFound = true;
			for(var j in itemFEPObject)
			{
				if( j.indexOf(filterFEPAtr) !== -1 ) {
					if( filterFEPMod <= itemFEPObject[j] ) { 
						noFEPFound = false;
						break;
					}
				}
			}

			if( noFEPFound ) {
				array[i][4] = true;
			}
		}
	}
}

function trimFE(input) {
	return result = input.toLowerCase().replace(/\ /g, "").replace(/\+/g, "");
}

function resetFields() {
	var filters = document.getElementById("filters").childNodes;
	for(var i = 0; i < filters.length; i++)
		if( filters[i].nodeName = "#text" ) filters[i].value = "";
	refreshView();
}

function renderTable(array) {
	var tbody = table.getElementsByTagName("tbody")[0];
	while (tbody.firstChild) tbody.removeChild(tbody.firstChild);
	for( var i = 0; i < array.length; i++) {
		if( array[i][array[i].length-1] == true ) continue;
		var row = document.createElement("tr");
		var cells = [];

		for( var j = 0; j <= 3; j++) {
			cells[j] = document.createElement("td");
		}

		cells[1].innerHTML = array[i][0];
		cells[2].appendChild(parseIng(array[i][1]));
		cells[3].appendChild(parseFEP(array[i][2]));
		for( var j = 0; j < cells.length; j++) {
			row.appendChild(cells[j]);
		}
		// row.addEventListener("mouseover", highlight);
		row.id = i;
		tbody.appendChild(row);
	}
}

function refreshView() {
	resetSorted();
	filterData(displayData);
	renderTable(displayData);
}

function applyTheme() {
	if( opts.debug ) {
		var debugStyle = document.createElement("link");
		debugStyle.rel = "stylesheet";
		debugStyle.href = "debug.css";
		document.head.appendChild(debugStyle);
	}

	var themeStyle = document.createElement("link");
	themeStyle.rel = "stylesheet";
	themeStyle.href = "theme_" + opts.theme + ".css";
	document.head.appendChild(themeStyle);
}

function processQuery() {
	var querystring = window.location.href.split("?")[1];
	if( !querystring ) return;
	if( querystring.length == 0 ) return;

	var optionlist = {};
	var pairs = querystring.split("&");
	for( var i = 0; i < pairs.length; i++) optionlist[pairs[i].split("=")[0]] = pairs[i].split("=")[1];

	if( optionlist.debug ) opts.debug = optionlist.debug;
	if( optionlist.theme == "dark" ) opts.theme = "dark";   
}

/*
function resizeDetailsDiv() {
	document.getElementById("lot-details").style.maxHeight = Math.max(48, window.innerHeight-660) + "px";
}
*/

function addDropdownToInput(inputField, list) {
	var currentWidth = inputField.clientWidth;
	var fieldParent = inputField.parentNode;
	
	//adding dropdown button before target input
	var divReferenceButton = document.createElement("div");
	divReferenceButton.className = "dropdownButton";
	divReferenceButton.innerHTML = "+";
	inputField.style.width = currentWidth - 20 + "px";
	inputField.style.paddingLeft = 20 + "px";
	divReferenceButton.addEventListener("click", function () {toggleList(divReferenceList, divReferenceButton);} );
	fieldParent.insertBefore(divReferenceButton, inputField);

	//adding dropdown list to target input
	var divReferenceList = document.createElement("div");
	divReferenceList.div = "listReference";
	divReferenceList.className = "dropdownList";
	divReferenceList.style.display = "none";

	var listsize = 0;
	for( var i in list ) {
		var line = document.createElement("div");
		var text = document.createTextNode(i);
		line.appendChild(text);
		line.addEventListener("click", function() {
			inputField.value = this.innerHTML + " ";
			toggleList(divReferenceList, divReferenceButton);
			inputField.focus();
		})
		divReferenceList.appendChild(line);
		listsize += 1;
	}

	divReferenceList.style.height = listsize*17 + "px";
	fieldParent.insertBefore(divReferenceList, divReferenceButton);
}

function toggleList(list, button) {
	if( list.style.display == "block" ) {
		button.innerHTML = "+";
		list.style.display = "none";
	}
	else {
		list.style.display = "block";
		button.innerHTML = "-";
	}
	return;
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
	/*
	window.addEventListener("resize", resizeDetailsDiv);
	addDropdownToInput(document.getElementById("filterGoods"), ItemReferenceList);
	resizeDetailsDiv();

	*/
	addDropdownToInput(document.getElementById("filterFEP"), evBaseName);
	loadData(dataset);
	refreshView();
}

function loadData(src) {
	displayData = src.slice(0);
	for( var i = 0; i < displayData.length; i++) {
		displayData[i][displayData[i].length] = false;
	}
}

function highlight() {
	var id = this.id;
	var x = data[id][10];
	var y = data[id][11];

	if (map	== undefined)
		var map = document.getElementById('mapSVG');

	var marker = mapSVG.getElementById('mapMarker');
	if (marker == undefined) {
		marker = document.createElementNS(ns, 'circle');
		marker.setAttribute('r', 5);
		marker.setAttribute('class', "SVGmarker");
		marker.setAttribute('id', 'mapMarker');
		map.appendChild(marker);
	}
	marker.setAttribute('cx', (x-fixx)*modx+offx);
	marker.setAttribute('cy', (y-fixy)*mody+offy);
	
	detailsToLot(id);
}

function detailsToLot(id){
	var lot = document.getElementById("lot");

	var stringProduct = data[id][1] + (data[id][3] ? " Q" + data[id][3] : "");
	var stringProductLeft = data[id][4] + " left";
	var stringPrice = data[id][6];
	if( data[id][8] && data[id][8] != "Any") stringPrice += " Q" + data[id][8];
	if( data[id][9] && data[id][9] > 1 ) stringPrice += " × " + data[id][9];
	
	var lprimg = lot.querySelector("#lot-product-image");
	while (lprimg.firstChild) lprimg.removeChild(lprimg.firstChild);
	var img = document.createElement("img");
	if ( !opts.debug ) img.src = (basicURL + data[id][0]).replace("/gems/gemstone", "/gems/any");
	img.alt = data[id][0];
	lprimg.appendChild(img);

	lot.querySelector("#lot-product").innerHTML = stringProduct;
	lot.querySelector("#lot-left").innerHTML = stringProductLeft;
	lot.querySelector("#lot-details").innerHTML = (parseDetails(data[id][2])).innerHTML;

	var lpriceimg = lot.querySelector("#lot-price-image");
	while (lpriceimg.firstChild) lpriceimg.removeChild(lpriceimg.firstChild);
	var pimg = document.createElement("img");
	if ( !opts.debug ) pimg.src = (basicURL + data[id][5]).replace("/gems/gemstone", "/gems/any");
	pimg.alt = data[id][5];
	lpriceimg.appendChild(pimg);

	lot.querySelector("#lot-price").innerHTML = stringPrice;
	lot.querySelector("#lot-pricedetails").innerHTML = data[id][7];
	lot.querySelector("#lot-timestamp").innerHTML = data[id][12];
}
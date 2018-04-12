var basicURL = "http://www.havenandhearth.com/mt/r/gfx/invobjs/";
var table = document.getElementById("data");
var opts = { theme : "light", debug : false }

var evColor = {
	str1 : "#BF9794",
	agi1 : "#9995B8",
	int1 : "#9DB7B9",
	con1 : "#C29AB4",
	prc1 : "#E4BF98",
	csm1 : "#9BEEB1",
	dex1 : "#FEFDCC",
	wil1 : "#E4F38F",
	psy1 : "#C48DFD",

	str2 : "#DF958F",
	agi2 : "#9991DC",
	int2 : "#97D6DC",
	con2 : "#E193C5",
	prc2 : "#F2C28D",
	csm2 : "#8EF7AA",
	dex2 : "#FFFEA6",
	wil2 : "#EEFF9E",
	psy2 : "#C286FE",
}

var evColorFull = {
	str1 : "#7F2F29",
	agi1 : "#322B71",
	int1 : "#3B6E73",
	con1 : "#853568",
	prc1 : "#C87F30",
	csm1 : "#36DD62",
	dex1 : "#FCFB98",
	wil1 : "#C8E61E",
	psy1 : "#891AFA",

	str2 : "#BF2A1F",
	agi2 : "#3223B8",
	int2 : "#2FADB9",
	con2 : "#C2278A",
	prc2 : "#E4841B",
	csm2 : "#1DEE54",
	dex2 : "#FEFC4D",
	wil2 : "#DCFF3C",
	psy2 : "#840DFD",
}

var evSName = {
	str1 : "str +1",
	agi1 : "agi +1",
	int1 : "int +1",
	con1 : "con +1",
	prc1 : "prc +1",
	csm1 : "csm +1",
	dex1 : "dex +1",
	wil1 : "wil +1",
	psy1 : "psy +1",

	str2 : "str +2",
	agi2 : "agi +2",
	int2 : "int +2",
	con2 : "con +2",
	prc2 : "prc +2",
	csm2 : "csm +2",
	dex2 : "dex +2",
	wil2 : "wil +2",
	psy2 : "psy +2",
}

var evBaseName = {
	"str" : "",
	"agi" : "",
	"int" : "",
	"con" : "",
	"prc" : "",
	"csm" : "",
	"dex" : "",
	"wil" : "",
	"psy" : ""
}
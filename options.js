var basicURL = "http://www.havenandhearth.com/mt/r/gfx/invobjs/";
var table = document.getElementById("data");
var opts = { theme : "light", debug : false, limit : 9001, textmode : false };

var evSName = {
	str1 : "str",
	agi1 : "agi",
	int1 : "int",
	con1 : "con",
	prc1 : "prc",
	csm1 : "csm",
	dex1 : "dex",
	wil1 : "wil",
	psy1 : "psy",

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

/*
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
*/

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
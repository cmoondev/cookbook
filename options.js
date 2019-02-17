var basicURL = "http://www.havenandhearth.com/mt/r/gfx/invobjs/";
var wikiURL = "http://ringofbrodgar.com/wiki/";
var table = document.getElementById("data");
var opts = { theme : "light", debug : false, limit : 50, textmode : false };
var strictMatch = ["beef", "asp", "bream", "horse", "goat", "mutton", "troll", "venison", "beetroot", "ant"];

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
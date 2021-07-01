function formatVal(val, format) {
    if (!format) return val;
    switch (format) {
        case "sign":
            return val > 0 ? "+" + val : val;
            break;
        case "aztext":
            return val.toLowerCase().replace(/[^a-z]/g, "");
            break;
        case "azspaceminustext":  //return lowercased string with anything beside a-z, space and minus excluded
            return val.toLowerCase().replace(/[^a-z(\-)(\ )]/g, "");
            break;
        case "d2pr": // "percents" 0.54321 > 54.32%
            return Math.round(val * 10000) / 100 + "%";
            break;
        case "d2pp": // "plain percents" 0.54321 > 54.3
            return Math.round(val * 1000) / 10;
            break;
        case "d2sd":
            return Math.round(val * 100) / 100;
            break;
        case "d2fd":
            var res = Math.round(val * 10) / 10;
            if (res - Math.round(res) === 0) res += ".0";
            return res + " ";
            break;
        case "h2hm":
            var hrs = (val / 60 < 10 ? "0" : "") + Math.floor(val / 60);
            var mns = (val % 60 < 10 ? "0" : "") + Math.round(val % 60);
            return hrs + ":" + mns;
            break;
        case "wikiurl":
            return encodeURIComponent(val.replace(/\ +/g, "_"));
            break;
        default:
            return val;
    }
}

function azContains(a, b) {
    if (arrayIncludes(strictMatch, b)) {
        return (formatVal(a, "aztext") == formatVal(b, "aztext"));
    } else {
        return formatVal(a, "aztext").indexOf(formatVal(b, "aztext")) !== -1;
    }
}

function arrayIncludes(array, item) {
    for (var i = 0; i < array.length; i++) {
        if (array[i] == item) {
            return true;
        }
    }
    return false;
}
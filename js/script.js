// http://jsonlint.com/
var jsonCharSets = {
	"charSets": [
		{
			"name": "English alphabet",
			"set": "AaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQqRrSsTtUuVvWwXxYyZz1234567890",
			"masks": [
				{
					"name": "numbers",
					"mask": "1234567890"
				},
				{
					"name": "lookalikes",
					"mask": "ijlI1rnmckOo0psuvwxz"
				},
				{
					"name": "lcase",
					"mask": "abcdefghijklmnopqrstuvwxyz"
				}
			]
		},
		{
			"name": "QWERTY left hand",
			"set": "QqWwEeRrTtAaSsDdFfGgZzXxCcVvBb12345",			
			"masks": [
				{
					"name": "numbers",
					"mask": "12345"
				},
				{
					"name": "lookalikes",
					"mask": "ijlI1rnmckOo0psuvwxz"
				},
				{
					"name": "lcase",
					"mask": "qwertasdfgzxcvb"
				}
			]			
		},
		{
			"name": "Numbers only",
			"set": "1234567890"		
		}
	]
};

window.onload = init;

function init() {
	var isk = $("#input-secret-key");
	isk.keyup(isk_KeyUp);
	var csm = $("#character-set-menu");
	csm.change(csm_Change);

	loadCharacterSets();
	csm_Change();
	generateLazypass("");
}

function csm_Change() {
	var csm = $("#character-set-menu")[0];
	var idx = csm.selectedIndex;
	filterCharacterSetOptions(idx);
}

// TODO: Enable/disable mask options
function filterCharacterSetOptions(index) {
	document.title = index;
}

function loadCharacterSets() {
	var csm = $("#character-set-menu");
	var html = "";
	var idx;
	for (idx=0; idx<jsonCharSets.charSets.length; idx+=1) {
		html += "<option>";
		html += jsonCharSets.charSets[idx].name;
		html += "</option>";
	}
	csm.html(html);
}

var timerKeyUp = 0;
function isk_KeyUp() {
	clearTimeout(timerKeyUp);
	timerKeyUp = setTimeout(checkSecretKey, 333);
}

var prevSeed = "";
function checkSecretKey() {	
	var seed = $("#input-secret-key").val();	
	if (seed !== prevSeed) {
		generateLazypass(seed);
		prevSeed = seed;	
	}
}

// TODO: Select character set
// TODO: Filter user options (lower case, numbers, look-a-likes)
function loadCharacterSet() {
	var charSet = "abcd1234"
	return charSet.toUpperCase();
}

// TODO: Preview character set if seed matches placeholder
function generateRandomSet(seed, max) {
	var randomSet = [];
	if (seed === "") {
		// Preview character set
		for (idx=0; idx<100; idx+=1) {
			randomSet[idx] = idx % max;
		}		
	}
	else {
		Math.seedrandom(seed);
		for (idx=0; idx<100; idx+=1) {
			randomSet[idx] = Math.floor(Math.random() * max);
		}		
	}
	return randomSet;
}

function generateLazypass(seed) {
	var charSet = loadCharacterSet();
	var randomSet = generateRandomSet(seed, charSet.length);

	var holder = $("#lp-holder");
	if (holder.children()) {
		holder.children().remove();
	}

	// Build lazypass table
	var html = "<table><tbody>"
	var currChar;
	var jdx;
	for (idx=0; idx<9; idx+=1) {
		html += "<tr>";
		for (jdx=0; jdx<9; jdx+=1) {
			currChar = charSet[randomSet[idx*9+jdx]];
			html += "<td>";
			html += currChar;
			html += "</td>";
		}
		html += "</tr>";
	}
	holder.html(html);
}
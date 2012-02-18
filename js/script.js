// http://jsonlint.com/
var jsonCharSets = {
	"charSets": [
		{
			"name": "English alphabet",
			"set": "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890",
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
			"set": "QWERTASDFGZXCVBqwertasdfgzxcvb12345",			
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

window.onload = initLazypass;

function initLazypass() {
	setupEventHandlers();
	loadCharacterSets();
	csm_Change();
}

// TODO: Arrow key navigation?
// TODO: Quick numbers/PIN toggle?
function setupEventHandlers() {
	var isk = $("#input-secret-key");
	isk.bind("keyup", isk_KeyUp);
	isk.bind("keypress", isk_KeyPress);
	var csm = $("#character-set-menu");
	csm.bind("change", csm_Change);
	var masks = $("#masks");
	masks.bind("change", mask_Change);
}

// Disable enter/return keypress
function isk_KeyPress(e) {
	var key;
	if (window.event) {
		key = window.event.keyCode; //IE
	}
	else {
		key = e.which; //FF
	}
	return (key != 13);
}

// Determine masks of selected character set
function csm_Change() {
	var csm = $("#character-set-menu")[0];
	var idx = csm.selectedIndex;
	filterCharacterSetOptions(idx);
	$("form").data("changed", true);
	checkSecretKey();
}

function mask_Change() {
	$("form").data("changed", true);
	checkSecretKey();
}

// TODO: Disable label too
function filterCharacterSetOptions(index) {
	var masks = $("#masks input");
	var idx;
	var inputId;
	var maskName;
	var input;

	// Enable/disable available mask options
	for (idx=0; idx<masks.length; idx+=1) {
		inputId = masks[idx].id;
		input = $("#"+inputId)[0];
		maskName = inputId.substr(5-inputId.length);
		input.disabled = !hasCharacterSetMask(index, maskName);
	}
}

function hasCharacterSetMask(index, name) {
	var currSet = jsonCharSets.charSets[index];
	var idx;
	if (currSet.masks) {
		for (idx=0; idx<currSet.masks.length; idx+=1) {
			if (currSet.masks[idx].name === name) {
				return true;
			}
		}		
	}
	return false;
}

// Add character set options to menu
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

// Determine when input "stops"
var timerKeyUp = 0;
function isk_KeyUp() {
	clearTimeout(timerKeyUp);
	timerKeyUp = setTimeout(checkSecretKey, 333);
}

// Generate lazypass if form changed
function checkSecretKey() {
	var seed = $("#input-secret-key")[0].value;
	if ($("form").data("changed")) {
		generateLazypass(seed);
	}
}

function loadCharacterSet() {
	var charSet = "";
	var csm = $("#character-set-menu")[0];
	var idx = csm.selectedIndex;
	var currSet = jsonCharSets.charSets[idx];
	charSet = currSet.set;

	// Filter set by user options
	var maskName;
	var mask;
	var jdx;
	if (currSet.masks) {
		for (jdx=0; jdx<currSet.masks.length; jdx+=1) {
			maskName = currSet.masks[jdx].name;
			mask = currSet.masks[jdx].mask;
			checkbox = $("#mask-"+maskName)[0];
			if (checkbox && !checkbox.checked) {
				charSet = filterSetByMask(charSet, mask);			
			}
		}		
	}

	if (!charSet || charSet.length < 1) {
		charSet = "X";
	}
	return charSet;
}

function filterSetByMask(charSet, mask) {
	if (!mask || mask.length < 1) {
		return charSet;
	}
	var re = new RegExp("["+mask+"]", "g");
	charSet = charSet.replace(re, "");
	return charSet;
}

function generateRandomSet(seed, max) {
	var randomSet = [];
	var isk = $("#input-secret-key");
	var placeholder = isk.attr("placeholder");
	if (!seed || seed === "" || seed === placeholder) {
		// Nonrandom to preview character set
		for (idx=0; idx<81; idx+=1) {
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

// Generate lazypass table html
function generateLazypass(seed) {
	var charSet = loadCharacterSet();
	var randomSet = generateRandomSet(seed, charSet.length);

	// Clear table
	var holder = $("#lp-holder");
	if (holder.children()) {
		holder.children().remove();
	}

	// Build lazypass table
	var html = "<table border=1><tbody>"
	var currChar;
	var jdx;

	// First row headers
	var thSet = "ABCDEFGHIJKLM12345NOPQRSTUVWXYZ67890";
	html += "<tr><th></th>";
	var m = -1;
	var n;
	for (n=0; n<9; n+=1) {
		html += "<th><table><tbody>";
		html += "<tr><th>";
		html += thSet[++m];
		html += "</th><th>";
		html += thSet[++m];
		html += "</th></tr>";
		html += "<tr><th>";
		html += thSet[m+17];
		html += "</th><th>";
		html += thSet[m+18];
		html += "</th></tr>";
		html += "</tbody></table></th>";
	}
	html += "</tr>";

	m = -1;
	for (idx=0; idx<9; idx+=1) {
		html += "<tr>";

		// First col headers
		html += "<th><table><tbody>";
		html += "<tr><th>";
		html += thSet[++m];
		html += "</th><th>";
		html += thSet[m+18];
		html += "</th></tr>";
		html += "<tr><th>";
		html += thSet[++m];
		html += "</th><th>";
		html += thSet[m+18];
		html += "</th></tr>";
		html += "</tbody></table></th>";

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
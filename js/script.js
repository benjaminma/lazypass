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

window.onload = initLazypass;

function initLazypass() {
	setupEventHandlers();
	loadCharacterSets();
	csm_Change();
	generateLazypass("");
}

// TODO: Capture return keypress
// TODO: Arrow key navigation
// TODO: Quick numbers/PIN toggle?
function setupEventHandlers() {
	var isk = $("#input-secret-key");
	isk.keyup(isk_KeyUp);
	var csm = $("#character-set-menu");
	csm.change(csm_Change);
}

// Determine masks of selected character set
function csm_Change() {
	var csm = $("#character-set-menu")[0];
	var idx = csm.selectedIndex;
	filterCharacterSetOptions(idx);
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

// Generate lazypass if new seed
var prevSeed = "";
function checkSecretKey() {
	var seed = $("#input-secret-key").val();	
	if (seed !== prevSeed) {
		generateLazypass(seed);
		prevSeed = seed;	
	}
}

function loadCharacterSet() {
	var charSet = "";
	var csm = $("#character-set-menu")[0];
	var idx = csm.selectedIndex;
	var currSet = jsonCharSets.charSets[idx];
	charSet = currSet.set;

	// Filter set by user options
	var mask;
	var jdx;
	if (currSet.masks) {
		for (jdx=0; jdx<currSet.masks.length; jdx+=1) {
			mask = currSet.masks[jdx].mask;
			charSet = filterSetByMask(charSet, mask);
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
	
	return charSet;
}

// TODO: Preview character set if seed matches placeholder
function generateRandomSet(seed, max) {
	var randomSet = [];
	if (seed === "") {
		// Nonrandom to preview character set
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

// TODO: Add table headers
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
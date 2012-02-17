window.onload = init;

function init() {
	var isk = $("#input-secret-key");
	isk.keyup(isk_KeyUp);
	generateLazypass("");
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
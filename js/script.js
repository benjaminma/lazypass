window.onload = init;

function init() {
	var isk = $("#input-secret-key");
	isk.keyup(isk_KeyUp);
}

function isk_KeyUp() {
	var seed = $("#input-secret-key").val();
	generateLazypass(seed);

	// TODO: Test for input delay/intent
}

function loadCharacterSet() {
	// TODO: Select character set
	var charSet = "abc123"
	// TODO: Filter user options (lower case, numbers, look-a-likes)

	return charSet;
}

function generateLazypass(seed) {
	var DEBUG = "";
	
	var charSet = loadCharacterSet();

	// Generate random numbers
	Math.seedrandom(seed);
	var randomSet = [];
	var idx;
	for (idx=0; idx<100; idx+=1) {
		randomSet[idx] = Math.floor(Math.random() * charSet.length);
	}

	// Test set
	for (idx=0; idx<100; idx+=1) {
		DEBUG += charSet[randomSet[idx]];
	}

	// TODO: Build lazypass table

	document.write(DEBUG);
}
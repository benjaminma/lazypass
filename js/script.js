window.onload = init;

function init() {
	var isk = $("#input-secret-key");
	isk.keyup(isk_KeyUp);
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
	var randomSet = [];
	var idx;
	if (seed === "") {
		// Preview character set
		// TODO: or if seed matches placeholder
		for (idx=0; idx<100; idx+=1) {
			randomSet[idx] = idx % charSet.length;
		}		
	}
	else {
		Math.seedrandom(seed);
		for (idx=0; idx<100; idx+=1) {
			randomSet[idx] = Math.floor(Math.random() * charSet.length);
		}		
	}

	// DEBUG: Test set
	for (idx=0; idx<100; idx+=1) {
		DEBUG += charSet[randomSet[idx]];
	}

	// TODO: Build lazypass table
	var holder = $("#lp-holder");
	holder.html(DEBUG);
}
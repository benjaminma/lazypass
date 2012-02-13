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

function generateLazypass(seed) {
	var DEBUG = "";
	
	// TODO: Select character set
	var charSet = "abc123"
	// TODO: Filter user options

	// Seed PRNG
	Math.seedrandom(seed);

	// Generate random numbers
	var randomSet = [];
	for (i=0; i<100; i+=1) {
		randomSet[i] = Math.floor(Math.random() * charSet.length);
		DEBUG += randomSet[i];
	}

	// TODO: Build lazypass table

	document.write(DEBUG);
}
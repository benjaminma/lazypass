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
	document.write("generateLazypass()");
	// TODO: Select character set
	// TODO: Filter user options
	// TODO: Seed PRNG
	// TODO: Generate random numbers
	// TODO: Build lazypass table
}
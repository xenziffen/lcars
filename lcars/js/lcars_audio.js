// Simple audio event wire-up for a futuristic compturized GUI.
// Should be called at the end of the page, when document is nearly ready.
// Authored by justin.warwick@gmail.com
// Released under MIT license; see LICENSE file.
//
// Assumes you have this at the bottom of your document:
//   <audio id="audUmmy"/><!--Just leave this here, just needed to enable automatic query canplay in the initialization code to load compatible media types -->

// audio tracs available at https://www.trekcore.com/audio/


//=\\ Standard Wire-up

var audioExtensions = {};
	audioExtensions["ogg"] = "ogg";
	audioExtensions["webm"] = "webm";
	audioExtensions["mp4"] = "aac";
var audioPath = "./audio/";
var audioType;

// determine which flavor of audio this browser can support
auDummy = document.getElementById("audUmmy").appendChild(document.createElement("audio"));
for (var key in audioExtensions) {
	if (auDummy.canPlayType("audio/"+audioExtensions[key]) != '') {
		auDummy.src = audioPath + "input_ack." + key;
		//TODO: test it further??
		console.log(auDummy.src + "   " +auDummy.src.lastIndexOf(".")); 
		audioType =  auDummy.src.slice(auDummy.src.lastIndexOf(".") + 1);
		console.log("We have a winner: " + audioType);
		break;
	}
}

const audCache = {};
// var audAck;
// var audAlert;
// var audInput;
function addSound(name, res) {
	audCache[name] = new Audio(res + '.' + audioType);
	audCache[name].controls = false;
	window.console && console.log("defining sound " + name + " [" + res + '.' + audioType + ']');
}

addSound("audAck", "audio/input_ack");
addSound("audNak", "audio/input_nak");
addSound("audAlert", "audio/output_bel");
addSound("audReady", "audio/output_soh"); // 4, 8, 9, 13, 15
addSound("audAmb", "audio/tng_bridge_1");
audCache.audAmb.loop = true;
audCache.audAmb.controls = true;

function audioAcknowledge() {
	audCache.audAck.play();
}

function audioNegativeAcknowledge() {
	audCache.audNak.play();
}

function audioAlert() {
    // window.console && console.log(audAlert.readyState)
    window.console && console.log(audCache[audAlert].readyState)
		//audAlert.load();
		audCache.audAlert.play();
    // audAlert.play();
		//TODO:bonus: have a fallback for no supported file types (or MUTE active):  floating div pops up and flashes, then disappears. der blinken lights
}

function audioReady() {
	audCache.audReady.play();
}

function audioAmbiance() {
	switch (audCache.audAmb.readyState) {
		case 3, 4:
			if (audCache.audAmb.paused)
				audCache.audAmb.play();
			else
				audCache.audAmb.pause();
			break;
		default:
	}
	// audioAmb.play();
}

var button_list = document.querySelectorAll("#container div.lcars-element.button");
for (var button of button_list) {
	console.log("Audio-enabling button " + button.id + " " + button.innerText);
	button.addEventListener("click", function(){ audioAcknowledge(); }); 
}


//All "booted" up. Many browsers won't play this next sound because the user hasn't "blessed" the action with a UI click yet.
document.addEventListener("DOMContentLoaded", function(event) { 
	console.log("Attempting to play " + audCache.audReady);
	audioReady();
});


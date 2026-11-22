let dspNode = null;
let lastBellTime = -1000;

const dspName = "bells";
const instance = new FaustWasm2ScriptProcessor(dspName);

instance.createDSP(audioContext, 1024)
    .then(node => {
        dspNode = node;
        dspNode.connect(audioContext.destination);
        console.log("Bell controls:", dspNode.getParams());
    })
    .catch(error => {
        console.error("Could not load bell:", error);
    });

function accelerationChange(accx, accy, accz) {
}

function rotationChange(rotx, roty, rotz) {
}

function mousePressed() {
    // Allows testing with a mouse on the laptop.
    playAudio();
}

function deviceMoved() {
    movetimer = millis();
    statusLabels[2].style("color", "pink");
}

function deviceTurned() {
    threshVals[1] = turnAxis;
}

function deviceShaken() {
    shaketimer = millis();
    statusLabels[0].style("color", "pink");
    playAudio();
}

function playAudio() {
    if (!dspNode || audioContext.state !== "running") {
        return;
    }

    // Avoid triggering too many overlapping strikes.
    const now = performance.now();

    if (now - lastBellTime < 350) {
        return;
    }

    lastBellTime = now;

    dspNode.setParamValue("/englishBell/gate", 1);

    setTimeout(() => {
        dspNode.setParamValue("/englishBell/gate", 0);
    }, 100);
}
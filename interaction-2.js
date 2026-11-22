let dspNode = null;

const dspName = "brass";
const instance = new FaustWasm2ScriptProcessor(dspName);

instance.createDSP(audioContext, 1024)
    .then(node => {
        dspNode = node;
        dspNode.connect(audioContext.destination);
        dspNode.setParamValue("/brass/blower/pressure", 0);
        console.log("Brass controls:", dspNode.getParams());
    })
    .catch(error => {
        console.error("Could not load brass:", error);
    });

function accelerationChange(accx, accy, accz) {
}

function rotationChange(rotx, roty, rotz) {
    if (!Number.isFinite(roty)) {
        return;
    }

    // Flat: silent. Tilt either way: increase pressure.
    // Ignore the first five degrees to reduce small jitters.
    const tilt = Math.abs(roty);
    const amount = Math.max(0, Math.min(1, (tilt - 5) / 40));

    playAudio(amount * 0.9);
}

function mousePressed() {
    // Laptop test: briefly play the instrument.
    playAudio(0.9);
    setTimeout(() => playAudio(0), 500);
}

function deviceMoved() {
    movetimer = millis();
    statusLabels[2].style("color", "pink");
}

function deviceTurned() {
    threshVals[1] = turnAxis;
}

function deviceShaken() {
    // Shaking does not trigger this interaction.
}

function playAudio(pressure) {
    if (!dspNode || audioContext.state !== "running") {
        return;
    }

    dspNode.setParamValue("/brass/blower/pressure", pressure);
}
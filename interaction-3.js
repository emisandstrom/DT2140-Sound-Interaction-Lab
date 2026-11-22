let dspNode = null;
let lastThunderTime = -2000;
let readyForMovement = true;

const dspName = "tuono";
const instance = new FaustWasm2ScriptProcessor(dspName);

instance.createDSP(audioContext, 1024)
    .then(node => {
        dspNode = node;
        dspNode.connect(audioContext.destination);
        console.log("Thunder controls:", dspNode.getParams());
    })
    .catch(error => {
        console.error("Could not load thunder:", error);
    });

function accelerationChange(accx, accy, accz) {
    if (![accx, accy, accz].every(Number.isFinite)) {
        return;
    }

    const strength = Math.sqrt(
        accx * accx + accy * accy + accz * accz
    );

    // Become ready again once movement settles.
    if (strength < 4) {
        readyForMovement = true;
    }

    // Ignore small movements.
    if (strength > 12 && readyForMovement) {
        if (playAudio()) {
            readyForMovement = false;
        }
    }
}

function rotationChange(rotx, roty, rotz) {
}

function mousePressed() {
    // Laptop test.
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
    // Detection is handled by accelerationChange.
}

function playAudio() {
    if (!dspNode || audioContext.state !== "running") {
        return false;
    }

    const now = performance.now();

    if (now - lastThunderTime < 1500) {
        return false;
    }

    lastThunderTime = now;
    dspNode.setParamValue("/thunder/rumble", 1);

    setTimeout(() => {
        dspNode.setParamValue("/thunder/rumble", 0);
    }, 100);

    return true;
}
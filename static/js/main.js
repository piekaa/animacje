import PiekoszekEngine from "./PiekoszekEngine.js";
import Square from "./primitives/Square.js";
import Files from "./files/Files.js";
import AnimationCompiler from "./compiler/AnimationCompiler.js";
import InitCompiler from "./compiler/InitCompiler.js";
import FileStorage from "./files/FileStorage.js";
import DefinitionPostCompiler from "./definitions/DefinitionPostCompiler.js";
import Hints from "./editor/Hints.js";
import Camera from "./Camera.js";
import DragAndDropImages from "./files/DragAndDropImages.js";

// let animationFiles = new Files(true, new FileStorage(), {onLoad: compileAnimation});
let animationFiles = new Files(true, new FileStorage(), {});
let definitionFiles = new Files(false, new FileStorage("definitions"), {
    onLoad: () => {
        animationFiles.start();
        Hints.start(compile)
        Hints.setDefinitions(definitionFiles.getRawData());
    }
});
definitionFiles.start(true);

let tab = "animation";

let lastProgressFrame = 0;

let playBehaviourId;

PiekoszekEngine.start();

const pivot = new Square(100, 100, 50);
pivot.visible = false;
pivot.zIndex = 10000;
pivot.setColor(0, 1, 0, 1);
PiekoszekEngine.add(pivot);

let animator;

let progress = document.getElementById("progress");

document.getElementById("compiler").onclick = compile;

function compile() {
    if (tab === "animation") {
        compileAnimation();
    }
    if (tab === "definitions") {
        compileDefinition();
    }
}

function compileAnimation() {
    InitCompiler.compile(animationFiles.getInitCode(), pivot, definitionFiles.getRawData())
        .then(variables => AnimationCompiler.compile(animationFiles.getAnimationCode(), variables))
        .then(a => {
            a.completeRemainingFrames();
            progress.min = 0;
            progress.max = a.frame - 1;
            progress.value = Math.min(lastProgressFrame, progress.max);
            animator = a;
            progress.oninput({
                target: {
                    value: Math.min(lastProgressFrame, progress.max)
                }
            });
        });
}


function compileDefinition() {
    InitCompiler.compile(definitionFiles.selectedFileCode(), pivot, definitionFiles.getRawData())
        .then(() => {
            DefinitionPostCompiler.postCompileSteps(pivot, definitionFiles);
        });
}

progress.oninput = (event) => {
    const frame = event.target.value;
    lastProgressFrame = frame;
    animator?.setValuesAtFrame(frame);
}

document.getElementById("play").onclick = () => {
    let frame = parseInt(lastProgressFrame) < parseInt(progress.max) ? lastProgressFrame : 0;
    frame = Math.max(frame, 0);
    // document.getElementById("canvas").requestFullscreen();

    pause();
    playBehaviourId = PiekoszekEngine.addBehaviour(() => {
        if (frame <= progress.max) {
            progress.value = frame;
            progress.oninput({
                target: {
                    value: frame
                }
            });
        }
        frame++;
    });
};

document.getElementById("pause").onclick = () => {
    pause();
}

function pause() {
    PiekoszekEngine.removeBehaviour(playBehaviourId);
}

document.getElementById("animationTab").onclick = (event) => {
    event.target.classList.add("selectedTab");
    document.getElementById("definitionsTab").classList.remove("selectedTab");
    definitionFiles.stop();
    animationFiles.stop();
    animationFiles = new Files(true, new FileStorage(), {onLoad: compileAnimation});
    animationFiles.start();
    tab = "animation";
    pivot.visible = false;
};

document.getElementById("definitionsTab").onclick = (event) => {
    event.target.classList.add("selectedTab");
    document.getElementById("animationTab").classList.remove("selectedTab");
    tab = "definitions";
    definitionFiles.stop();
    animationFiles.stop();
    definitionFiles = new Files(false, new FileStorage("definitions"), {onFileSelect: compileDefinition});
    definitionFiles.start();
    pivot.visible = true;
};

document.getElementById("cameraReset").onclick = () => {
    new Camera();
}

let encoder;

async function getEncoder() {
    encoder = await HME.createH264MP4Encoder();
}

getEncoder();

let renderBehaviourId;


const download = (url, filename) => {
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = filename || "download";
    anchor.click();
};


document.getElementById("render").onclick = () => {
    console.log(encoder);

    const context = document.getElementById("canvas").getContext("webgl");

    encoder.width = 1920;
    encoder.height = 1080;
    // encoder.temporalDenoise = true;
    encoder.quantizationParameter = 10;
    encoder.initialize();


    let frame = 0;

    let debugFrame = -1;

    PiekoszekEngine.flipCamera = true;

    renderBehaviourId = PiekoszekEngine.addBehaviourAfterRender(() => {

        debugFrame++;

        let pixels = new Uint8Array(encoder.width * encoder.height * 4);
        context.readPixels(0, 0, encoder.width, encoder.height, context.RGBA, context.UNSIGNED_BYTE, pixels);

        encoder.addFrameRgba(pixels);


        if (frame <= progress.max) {
            progress.value = frame;
            progress.oninput({
                target: {
                    value: frame
                }
            });
        } else {
            encoder.finalize();
            const uint8Array = encoder.FS.readFile(encoder.outputFilename);
            download(URL.createObjectURL(new Blob([uint8Array], {type: "video/mp4"})));
            encoder.delete();
            PiekoszekEngine.flipCamera = false;
            PiekoszekEngine.removeBehaviourAfterRender(renderBehaviourId);
        }

        frame++;
    });


}

DragAndDropImages.initialize();
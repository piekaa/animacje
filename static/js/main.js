import PiekoszekEngine from "./PiekoszekEngine.js";
import Square from "./primitives/Square.js";
import Files from "./files/Files.js";
import AnimationCompiler from "./compiler/AnimationCompiler.js";
import InitCompiler from "./compiler/InitCompiler.js";
import FileStorage from "./files/FileStorage.js";
import DefinitionPostCompiler from "./definitions/DefinitionPostCompiler.js";
import Hints from "./editor/Hints.js";
import Camera from "./Camera.js";

let animationFiles = new Files(true, new FileStorage(), {onLoad: compileAnimation});
let definitionFiles = new Files(false, new FileStorage("__definitions"), {
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
    definitionFiles = new Files(false, new FileStorage("__definitions"), {onFileSelect: compileDefinition});
    definitionFiles.start();
    pivot.visible = true;
};

document.getElementById("cameraReset").onclick = () => {
    new Camera();
}

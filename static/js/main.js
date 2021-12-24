import PiekoszekEngine from "./PiekoszekEngine.js";
import Square from "./primitives/Square.js";
import Files from "./files/Files.js";
import AnimationCompiler from "./compiler/AnimationCompiler.js";
import InitCompiler from "./compiler/InitCompiler.js";

Files.start();

PiekoszekEngine.start();

const pivot = new Square(100, 100, 10);
pivot.visible = false;
pivot.zIndex = 10000;
PiekoszekEngine.add(pivot);

let animator;

let progress = document.getElementById("progress");

document.getElementById("compiler").onclick = () => {

    InitCompiler.compile(Files.getInitCode(), pivot)
        .then(variables => AnimationCompiler.compile(Files.getAnimationCode(), variables))
        .then(a => {
            a.completeRemainingFrames();
            progress.min = 0;
            progress.max = a.frame - 1;
            progress.value = 0;
            animator = a;
        });
}

progress.oninput = (event) => {
    const frame = event.target.value;
    animator?.setValuesAtFrame(frame);
}

document.getElementById("play").onclick = () => {
    let frame = 0;

    // document.getElementById("canvas").requestFullscreen();

    PiekoszekEngine.addBehaviour(() => {
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
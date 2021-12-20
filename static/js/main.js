import PiekoszekEngine from "./PiekoszekEngine.js";
import Compiler from "./Compiler.js";
import Square from "./primitives/Square.js";
import ClothSimulator from "./cloth/ClothSimulator.js";

PiekoszekEngine.start();

const cs = new ClothSimulator();
cs.start();

const pivot = new Square(100, 100, 10);
pivot.visible = false;
pivot.zIndex = 10000;
PiekoszekEngine.add(pivot);

let animator;

let progress = document.getElementById("progress");

document.getElementById("compiler").onclick = () => {
    Compiler.compile(document.getElementById("code").value, pivot, [{name: "cs", value: cs}])
        .then(a => {
            a.completeRemainingFrames();
            progress.min = 0;
            progress.max = a.frame - 1;
            progress.value = 0;
            animator = a;
        })
}

progress.oninput = (event) => {
    const frame = event.target.value;
    animator?.setValuesAtFrame(frame);
}

document.getElementById("play").onclick = () => {
    let frame = 0;

    document.getElementById("canvas").requestFullscreen();

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


document.getElementById("canvas").addEventListener("mousedown", (event) => {
    document.getElementById("mouse").value = `${event.offsetX}, ${event.target.offsetHeight - event.offsetY}`;
}, false);
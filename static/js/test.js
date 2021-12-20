import PiekoszekEngine from "./PiekoszekEngine.js";
import ClothSimulator from "./cloth/ClothSimulator.js";
import Vector from "./Vector.js";


PiekoszekEngine.start();
const cs = new ClothSimulator();
setTimeout(() => {
    cs.start();
}, 1000);

let mouseDown = false;

document.getElementById("canvas")
    .addEventListener("mousedown", (event) => {
        mouseDown = true;
    }, false);

document.getElementById("canvas")
    .addEventListener("mouseup", (event) => {
        mouseDown = false;
    }, false);

document.getElementById("canvas")
    .addEventListener("mousemove", (event) => {

        if (mouseDown) {

            const x = event.offsetX;
            const y = event.target.offsetHeight - event.offsetY;

            const mouse = new Vector(x, y);

            const p = cs.closestPoint(x, y);


            p.sticks.forEach(s => {

                let v1 = Vector.FromMatrix(s.p1.position).direction(mouse).normalized();
                let v2 = Vector.FromMatrix(s.p2.position).direction(mouse).normalized();

                if (v1.dot(v2) < 0.01) {
                    s.destroy();
                }

            });


        }


    }, false);
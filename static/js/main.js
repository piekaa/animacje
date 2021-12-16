import PiekoszekEngine from "./PiekoszekEngine.js";
import Compiler from "./Compiler.js";
import Square from "./primitives/Square.js";

PiekoszekEngine.start();

const pivot = new Square(100, 100, 10);
pivot.visible = false;
pivot.zIndex = 10000;
PiekoszekEngine.add(pivot);

document.getElementById("compiler").onclick = () => {
    Compiler.compile(document.getElementById("code").value, pivot);
}
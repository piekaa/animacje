import PiekoszekEngine from "./2d.js";
import Compiler from "./Compiler.js";

PiekoszekEngine.start();

document.getElementById("compiler").onclick = () => {
    Compiler.compile(document.getElementById("code").value);
}
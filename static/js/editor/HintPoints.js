import Square from "../primitives/Square.js";
import PiekoszekEngine from "../PiekoszekEngine.js";
import DragAndDropExtension from "../extensions/DragAndDropExtension.js";
import Hints from "./Hints.js";

class HintPoints {

    p1
    p2

    data

    width = 1;

    compileFunction

    constructor(lineData, compileFunction) {
        this.compileFunction = compileFunction;
        this.data = lineData;

        const args = lineData.textSoFar.split(/[()]/)[1].split(",")
            .map(arg => arg.trim())
            .map(arg => parseFloat(arg));

        this.p1 = new Square(args[0], args[1], 30);
        this.p2 = new Square(args[2], args[3], 30);
        this.width = args[4] || 1;

        DragAndDropExtension.updateExtension(this.p1, 45, this.updateCode.bind(this));
        DragAndDropExtension.updateExtension(this.p2, 45, this.updateCode.bind(this));

        PiekoszekEngine.add(this.p1);
        PiekoszekEngine.add(this.p2);
    }

    updateCode() {
        const x1 = this.p1.position.x().toFixed(2);
        const y1 = this.p1.position.y().toFixed(2);
        const x2 = this.p2.position.x().toFixed(2);
        const y2 = this.p2.position.y().toFixed(2);

        const newTextSoFar = this.data.textSoFar.replace(/\(.*\)/,
            `(${x1}, ${y1}, ${x2}, ${y2}, ${this.width})`);

        const code = Hints.code.value;

        Hints.code.value = code.slice(0, this.data.lineStartPosition)
            + newTextSoFar + code.slice(this.data.nextLineStartPosition);
        Hints.code.dispatchEvent(new Event('input'));

        const newCarrot = this.data.globalPosition - (code.length - Hints.code.value.length);
        Hints.code.setSelectionRange(newCarrot, newCarrot);

        this.compileFunction();

        Hints.code.focus();
    }

    destroy() {
        this.p1.visible = false;
        this.p2.visible = false;
        this.p1.update = () => {
        };
        this.p2.update = () => {
        };
    }

}

export default HintPoints
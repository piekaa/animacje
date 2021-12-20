import Vector from "../Vector.js";
import Line from "../primitives/Line.js";
import PiekoszekEngine from "../PiekoszekEngine.js";
import Square from "../primitives/Square.js";

class ClothStick {

    p1
    p2
    halfLength

    line

    constructor(p1, p2) {
        this.p1 = p1;
        this.p2 = p2;

        this.halfLength = Vector.FromMatrix(p1.position).direction(Vector.FromMatrix(p2.position)).length() / 2;
    }

    drawLine() {

        if (this.line) {
            PiekoszekEngine.remove(this.line);
        }

        this.line = new Line(
            this.p1.worldPositionVector.x, this.p1.worldPositionVector.y,
            this.p2.worldPositionVector.x, this.p2.worldPositionVector.y,
            2
        );
        this.line.visible = true;

        // todo why is this needed?
        this.line.isVisible = () => {
            return true;
        }

        const s = new Square(this.p1.worldPositionVector.x, this.p1.worldPositionVector.y, 4);
        s.color = [0, 0, 1, 1];
        // PiekoszekEngine.add(s);
        PiekoszekEngine.add(this.line);
    }

}

export default ClothStick
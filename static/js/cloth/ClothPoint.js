import Square from "../primitives/Square.js";
import Vector from "../Vector.js";

class ClothPoint extends Square {

    locked
    anchoredTo
    prevPosition

    sticks = []

    constructor(x, y) {
        super(0, 0, 10);
        this.setPosition(x, y);
        this.prevPosition = this.position;

        this.color = [1, 0, 0, 1];
        this.visible = false;
        this.sticks = new Set();
    }

    isReady() {
        return true;
    }

    distance(x, y) {
        return Vector.FromMatrix(this.position)
            .direction(new Vector(x, y)).length();
    }

}

export default ClothPoint
import Square from "../primitives/Square.js";

class ClothPoint extends Square {

    locked
    anchoredTo
    prevPosition

    constructor(x, y) {
        super(0, 0, 10);
        this.setPosition(x, y);
        this.prevPosition = this.position;

        this.color = [1,0,0,1];
        this.visible = false;
    }

    isReady() {
        return true;

    }

}

export default ClothPoint
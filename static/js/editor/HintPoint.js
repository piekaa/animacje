import Square from "../primitives/Square.js";
import Camera from "../Camera.js";

class HintPoint extends Square {

    update() {
        this.setScale(1 / Camera.current.scale.sx(), 1 / Camera.current.scale.sy());
        super.update();
    }

}

export default HintPoint
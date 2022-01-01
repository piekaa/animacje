import Vector from "../Vector.js";
import Mouse from "../Mouse.js";

class DragAndDropExtension {

    static updateExtension(obj, radius, onDrop = () => {
    }) {
        const dnd = new DragAngDrop(obj, radius, onDrop);
        obj.update = dnd.update.bind(dnd);
    }

}

class DragAngDrop {

    obj
    radius

    onDrop

    dragged = false;

    constructor(obj, radius, onDrop) {
        this.obj = obj;
        this.radius = radius;
        this.onDrop = onDrop;
    }

    update() {
        if (!Mouse.leftDown) {

            if (this.dragged) {
                this.onDrop();
            }

            this.dragged = false;
            return;
        }
        //todo world position??
        if (Vector.FromMatrix(this.obj.position)
                .direction(new Vector(Mouse.wmx, Mouse.wmy))
                .length() <= this.radius
            && Mouse.leftDownThisFrame) {
            this.dragged = true;
        }

        if (this.dragged) {
            this.obj.setPosition(Mouse.wmx, Mouse.wmy);
        }
    }

}

export default DragAndDropExtension
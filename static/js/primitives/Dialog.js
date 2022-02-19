import AnimatedRenderable from "../animation/AnimatedRenderable.js";
import PiekoszekEngine from "../PiekoszekEngine.js";
import Line from "./Line.js";
import Curve from "./Curve.js";
import TextBox from "./TextBox.js";

class Dialog extends AnimatedRenderable {

    constructor(text, x, y) {
        super();

        this.setPosition(x, y);

        PiekoszekEngine.addAsChild(this, new Line(248.92, 235.22, 323.22, 290.94, 10));
        PiekoszekEngine.addAsChild(this, new Line(248.92, 235.22, 260.06, 320.67, 10));
        PiekoszekEngine.addAsChild(this, new Line(323.22, 290.94, 936.23, 290.94, 10));
        PiekoszekEngine.addAsChild(this, new Curve(936.23, 290.94, 1061.17, 308.73, 1059.11, 417.26, 10));
        PiekoszekEngine.addAsChild(this, new Line(1059.11, 417.26, 1059.11, 615.62, 10));
        PiekoszekEngine.addAsChild(this, new Curve(1059.11, 615.62, 1043.86, 677.74, 983.57, 677.74, 10));
        PiekoszekEngine.addAsChild(this, new Line(983.57, 677.74, 314.12, 677.74, 10));
        PiekoszekEngine.addAsChild(this, new Line(259.56, 319.92, 264.12, 577.74, 10));
        PiekoszekEngine.addAsChild(this, new Curve(264.12, 577.74, 259.21, 659.19, 314.12, 677.74, 10));

        this.setPivot(110.65, 110.20)


        const t = new TextBox(text, 300, 478.87, 660, 230);
        PiekoszekEngine.addAsChild(this, t);

    }

    isReady() {
        return false;
    }

    setColor(r = 1, g = 1, b = 1, a = 1) {
        super.setColor(r, g, b, a);
        this.children.forEach(c => c.setColor(r, g, b, a));
    }

}

export default Dialog
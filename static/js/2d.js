import GL from "./GL.js";
import Renderable from "./Renderable.js";

class PiekoszekEngine {

    static #rootRenderable;
    static #behaviours = [];

    static start() {
        PiekoszekEngine.#rootRenderable = new Renderable();
        PiekoszekEngine.#rootRenderable.visible = false;
        setInterval(this.#update, 30);
    }

    static add(renderable) {
        PiekoszekEngine.#rootRenderable.children.push(renderable);
        renderable.parent = PiekoszekEngine.#rootRenderable;
    }

    static addAsChild(parent, child) {
        parent.children.push(child);
        child.parent = parent;
    }

    static addBehaviour(behaviourFunction) {
        PiekoszekEngine.#behaviours.push(behaviourFunction);
    }

    static #update() {

        let queue = [];
        let renderables = [];
        queue.push(PiekoszekEngine.#rootRenderable);

        PiekoszekEngine.#behaviours.forEach(b => b());

        while (queue.length > 0) {
            let r = queue.shift();
            r.children.forEach(c => {
                c.update();
                c.updateTransformation(r.transformation, r.pivot);
            });
            renderables.push(r);
            queue.push(...r.children);
        }
        renderables.sort((a, b) => a.zIndex - b.zIndex);

        GL.clearToColor();
        renderables.forEach(r => r.render());


    }
}

export default PiekoszekEngine
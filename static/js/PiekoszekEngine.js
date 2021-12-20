import GL from "./GL.js";
import Renderable from "./Renderable.js";

class PiekoszekEngine {

    static FPS = 30;

    static #rootRenderable;

    //todo think of way to remove behaviours
    static #behaviours = [];
    static #behavioursAfterTransformation = [];

    static #renderablesToRemove = []
    ''

    static #protectedRenderables = [];

    static root() {
        return this.#rootRenderable;
    }

    static removeAll() {
        PiekoszekEngine.#createRootRenderable();
        this.#protectedRenderables.forEach(r => {
            PiekoszekEngine.add(r);
        })
    }

    static start() {
        PiekoszekEngine.#createRootRenderable();
        // setInterval(this.#update, 33);
        setInterval(this.#update, 41);
        // setInterval(this.#update, 233);
        // setInterval(this.#update, 5033);

    }

    static #createRootRenderable() {
        PiekoszekEngine.#rootRenderable = new Renderable();
        PiekoszekEngine.#rootRenderable.visible = true;
        PiekoszekEngine.#rootRenderable.isReady = () => {
            return false;
        }
    }

    static add(renderable, isPotected = false) {
        PiekoszekEngine.#rootRenderable.children.push(renderable);
        renderable.parent = PiekoszekEngine.#rootRenderable;

        if (isPotected) {
            PiekoszekEngine.#protectedRenderables.push(renderable);
        }

    }

    static addAsChild(parent, child) {
        parent.children.push(child);
        child.parent = parent;
    }

    static remove(renderable) {
        renderable.visible = false;
        PiekoszekEngine.#renderablesToRemove.push(renderable);
    }

    //todo remove behaviour
    static addBehaviour(behaviourFunction) {
        PiekoszekEngine.#behaviours.push(behaviourFunction);
    }

    //todo remove behaviour
    static addBehaviourAfterTransformation(behaviourFunction) {
        PiekoszekEngine.#behavioursAfterTransformation.push(behaviourFunction);
    }

    static #update() {
        let queue = [];
        let renderables = [];


        PiekoszekEngine.#behaviours.forEach(b => b());

        queue.push(PiekoszekEngine.#rootRenderable);


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

        PiekoszekEngine.#behavioursAfterTransformation.forEach(b => b());


        GL.clearToColor();


        renderables.forEach(r => r.render());

        PiekoszekEngine.#renderablesToRemove.forEach(toRemove => {
            toRemove.parent.children = toRemove.parent.children.filter(r => r.getId() !== toRemove.getId());
        });
        PiekoszekEngine.#renderablesToRemove = [];
    }
}

export default PiekoszekEngine
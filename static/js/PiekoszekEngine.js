import GL from "./GL.js";
import Renderable from "./Renderable.js";
import Camera from "./Camera.js";
import Matrix2D from "./Matrix.js";

class PiekoszekEngine {

    static FPS = 30;

    static #rootRenderable;

    //todo think of way to remove behaviours
    static #behaviours = [];
    static #behavioursAfterTransformation = [];

    static #renderablesToRemove = []

    static #protectedRenderables = [];

    static camera;

    static canvas;

    static root() {
        return this.#rootRenderable;
    }

    static removeAll() {
        PiekoszekEngine.#createRootRenderableAndCamera();
        this.#protectedRenderables.forEach(r => {
            PiekoszekEngine.add(r);
        })
    }

    static start() {
        PiekoszekEngine.#createRootRenderableAndCamera();
        PiekoszekEngine.canvas = document.getElementById("canvas");
        PiekoszekEngine.#setupMouse();
        setInterval(this.#update, 1000 / PiekoszekEngine.FPS);
    }

    static #setupMouse() {
        PiekoszekEngine.canvas.addEventListener("mousedown", (event) => {
            const mx = event.offsetX;
            const my = event.target.offsetHeight - event.offsetY

            const wmx = (-PiekoszekEngine.camera.worldPositionVector.x + mx) / PiekoszekEngine.camera.scale.sx();
            const wmy = (-PiekoszekEngine.camera.worldPositionVector.y + my) / PiekoszekEngine.camera.scale.sy();

            const mouseElement = document.getElementById("mouse");
            mouseElement.value = `${wmx}, ${wmy}`;
            mouseElement.select();
            mouseElement.setSelectionRange(0, 20);
            navigator.clipboard.writeText(mouseElement.value);

        }, false);
    }

    static #createRootRenderableAndCamera() {
        PiekoszekEngine.#rootRenderable = new Renderable();
        PiekoszekEngine.#rootRenderable.visible = true;
        PiekoszekEngine.#rootRenderable.isReady = () => {
            return false;
        }
        PiekoszekEngine.camera = new Camera();
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

        const rect = PiekoszekEngine.canvas.getBoundingClientRect();
        const screen = Matrix2D.Scale(2 / rect.width, 2 / rect.height).multiply(Matrix2D.Translation(-rect.width / 2, -rect.height / 2));
        const view = screen.multiply(PiekoszekEngine.camera.matrix(rect));
        renderables.forEach(r => r.render(view.float32array()));

        PiekoszekEngine.#renderablesToRemove.forEach(toRemove => {
            toRemove.parent.children = toRemove.parent.children.filter(r => r.getId() !== toRemove.getId());
        });
        PiekoszekEngine.#renderablesToRemove = [];
    }
}

export default PiekoszekEngine
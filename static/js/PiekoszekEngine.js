import GL from "./GL.js";
import Renderable from "./Renderable.js";
import Camera from "./Camera.js";
import Matrix2D from "./Matrix.js";
import Mouse from "./Mouse.js";

class PiekoszekEngine {

    static FPS = 30;
    static width = 1920;
    static height = 1080;

    static rootRenderable;

    //todo think of way to remove behaviours
    static behaviours = [];
    static behavioursAfterTransformation = [];
    static behavioursAfterRender = [];


    static renderablesToRemove = []

    static protectedRenderables = [];

    static canvas;

    static flipCamera = false;

    static root() {
        return this.rootRenderable;
    }

    static removeAll() {
        PiekoszekEngine.#createRootRenderableAndCamera();
        this.protectedRenderables.forEach(r => {
            PiekoszekEngine.add(r);
        })
    }

    static start() {
        PiekoszekEngine.#createRootRenderableAndCamera();
        PiekoszekEngine.canvas = document.getElementById("canvas");
        this.canvas.width = PiekoszekEngine.width;
        this.canvas.height = PiekoszekEngine.height;
        Mouse.setup(PiekoszekEngine.width);
        setInterval(PiekoszekEngine.#update, 1000 / PiekoszekEngine.FPS);
    }

    static #createRootRenderableAndCamera() {
        PiekoszekEngine.rootRenderable = new Renderable();
        PiekoszekEngine.rootRenderable.visible = true;
        PiekoszekEngine.rootRenderable.isReady = () => {
            return false;
        }
        if (!Camera.current) {
            new Camera();
        }
    }

    static add(renderable, isPotected = false) {
        PiekoszekEngine.rootRenderable.children.push(renderable);
        renderable.parent = PiekoszekEngine.rootRenderable;

        if (isPotected) {
            PiekoszekEngine.protectedRenderables.push(renderable);
        }

    }

    static addAsChild(parent, child) {
        parent.children.push(child);
        child.parent = parent;
    }

    static remove(renderable) {
        renderable.visible = false;
        renderable.update = () => {
        };
        PiekoszekEngine.renderablesToRemove.push(renderable);
    }

    static addBehaviour(behaviourFunction) {
        return PiekoszekEngine.behaviours.push(behaviourFunction) - 1;
    }

    static addBehaviourAfterTransformation(behaviourFunction) {
        return PiekoszekEngine.behavioursAfterTransformation.push(behaviourFunction) - 1;
    }

    static addBehaviourAfterRender(behaviourFunction) {
        return PiekoszekEngine.behavioursAfterRender.push(behaviourFunction) - 1;
    }

    static removeBehaviour(id) {
        PiekoszekEngine.behaviours[id] = undefined;
    }

    static removeBehaviourAfterTransformation(id) {
        PiekoszekEngine.behavioursAfterTransformation[id] = undefined;
    }

    static removeBehaviourAfterRender(id) {
        PiekoszekEngine.behavioursAfterRender[id] = undefined;
    }

    static #update() {
        let queue = [];
        let renderables = [];


        PiekoszekEngine.behaviours.forEach(b => b?.());

        queue.push(PiekoszekEngine.rootRenderable);


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

        PiekoszekEngine.behavioursAfterTransformation.forEach(b => b?.());

        GL.clearToColor();

        const rect = {
            width: PiekoszekEngine.width,
            height: PiekoszekEngine.height
        }

        if (PiekoszekEngine.flipCamera) {
            Camera.current.setScale(Camera.current.scale.sx(), -Camera.current.scale.sy());
        }

        const screen = Matrix2D.Scale(2 / rect.width, 2 / rect.height).multiply(Matrix2D.Translation(-rect.width / 2, -rect.height / 2));
        const view = screen.multiply(Camera.current.matrix(rect));
        renderables.forEach(r => r.render(view.float32array()));

        PiekoszekEngine.behavioursAfterRender.forEach(b => b?.());

        PiekoszekEngine.renderablesToRemove.forEach(toRemove => {
            toRemove.parent.children = toRemove.parent.children.filter(r => r.getId() !== toRemove.getId());
        });
        PiekoszekEngine.renderablesToRemove = [];
    }
}

export default PiekoszekEngine
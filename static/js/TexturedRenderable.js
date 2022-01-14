import Renderable from "./Renderable.js";
import GL from "./GL.js";

class TexturedRenderable extends Renderable {

    //todo make use
    static textures = [];

    texture;

    constructor(imagePath, fragmentShaderPath = "/js/shader/fragment.shader", vertexShaderPath = "/js/shader/vertex.shader") {
        super(fragmentShaderPath, vertexShaderPath);
        this.visible = false;
        if (imagePath) {
            this.loadImage(imagePath);
        }
        this.useTexcoord = true;
    }

    loadImage(path, onload) {

        let img = new Image();
        img.onload = () => {

            const pos_and_tex = [
                0, 0, 0, 1,
                0, img.height, 0, 0,
                img.width, 0, 1, 1,
                img.width, img.height, 1, 0,
            ]

            this.vertexData = GL.createVertexData(pos_and_tex);

            this.setPivot(img.width / 2, img.height / 2);

            TexturedRenderable.textures[path] = GL.createTextureForImage(img);
            this.texture = TexturedRenderable.textures[path];
            onload(img);
            this.visible = true;
        }
        img.src = path;
        return img;

    }

    isReady() {
        return this.texture;
    }

    getTexture() {
        return this.texture;
    }

}

export default TexturedRenderable
import Renderable from "./Renderable.js";
import Texture from "./Texture.js";
import GL from "./GL.js";

class TexturedRenderable extends Renderable {

    static textures = [];

    texture;

    constructor(imagePath, fragmentShaderPath = "/js/shader/fragment.shader", vertexShaderPath = "/js/shader/vertex.shader") {
        super(fragmentShaderPath, vertexShaderPath);
        if (imagePath) {
            this.loadImage(imagePath);
        }
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

            TexturedRenderable.textures[path] = Texture.createTextureForImage(img, TexturedRenderable.gl);
            this.texture = TexturedRenderable.textures[path];
            onload(img);
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
import Renderable from "../Renderable.js";
import Matrix2D from "../Matrix.js";

class AnimatedRenderable extends Renderable {

    valuesAtFrame = []

    currentFrame = 0
    framePosition;
    frameRotation;
    frameScale;
    frameVisible;

    setInitialValues(frames) {

        const initial = {
            position: this.position,
            rotation: this.rotation,
            scale: this.scale,
            visible: this.visible,
        };

        this.framePosition = this.position;
        this.frameRotation = this.rotation;
        this.frameScale = this.scale;
        this.frameVisible = this.visible;

        for (let i = 0; i <= frames; i++) {
            this.valuesAtFrame[i] = initial;
        }
        this.currentFrame = frames;
    }

    setFramePosition(x, y) {
        this.framePosition = Matrix2D.Translation(x, y);
    }

    setFrameRotation(deg) {
        this.frameRotation = Matrix2D.RotationDeg(deg);
    }

    setFrameScale(sx, sy) {
        this.frameScale = Matrix2D.Scale(sx, sy);
    }

    setFrameVisible(visible) {
        this.frameVisible = visible;
    }

    updateFrame() {
        const frame = this.currentFrame++;

        if (frame === 0) {
            return
        }

        this.framePosition ||= this.valuesAtFrame[frame - 1].position;
        this.frameRotation ||= this.valuesAtFrame[frame - 1].rotation;
        this.frameScale ||= this.valuesAtFrame[frame - 1].scale;
        this.frameVisible ||= this.valuesAtFrame[frame - 1].visible;

        this.valuesAtFrame[frame] = {
            position: this.framePosition,
            rotation: this.frameRotation,
            scale: this.frameScale,
            visible: this.frameVisible
        };
    }

    setValuesAtFrame(frame) {
        this.position = this.valuesAtFrame[frame].position;
        this.rotation = this.valuesAtFrame[frame].rotation;
        this.scale = this.valuesAtFrame[frame].scale;
        this.visible = this.valuesAtFrame[frame].visible;
    }

    getValuesAtFrame(frame) {
        return this.valuesAtFrame[frame];
    }

}

export default AnimatedRenderable
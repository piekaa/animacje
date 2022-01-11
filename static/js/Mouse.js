import Matrix2D from "./Matrix.js";
import Camera from "./Camera.js";

class Mouse {

    static rightDown = false;
    static leftDownThisFrame = false;
    static leftDown = false;

    static startLMX;
    static startLMY;

    static wmx;
    static wmy;


    static startCameraPos;
    static camera;

    static setup(width) {

        const canvas = document.getElementById("canvas");
        const canvasScale = width / canvas.getBoundingClientRect().width

        canvas.addEventListener("wheel", event => {
            event.preventDefault();
            let zoom = event.deltaY > 0 ? 0.99 : 1.01;
            zoom = Math.pow(zoom, Math.abs(event.deltaY));
            const cameraScaleMatrix = Camera.current.scale.multiply(Matrix2D.Scale(zoom, zoom));
            Camera.current.setScale(cameraScaleMatrix.sx(), cameraScaleMatrix.sy(), true);
        });

        canvas.addEventListener("mousedown", (event) => {
            const mx = event.offsetX * canvasScale;
            const my = (event.target.clientHeight - parseFloat(getComputedStyle(event.target).paddingBottom) - event.offsetY) * canvasScale;

            const wmx = (((-Camera.current.worldPositionVector.x + mx) / (Camera.current.scale.sx()) / canvasScale) * (canvasScale)).toFixed(2);
            const wmy = (((-Camera.current.worldPositionVector.y + my) / (Camera.current.scale.sy()) / canvasScale) * (canvasScale)).toFixed(2);

            Mouse.wmx = parseFloat(wmx);
            Mouse.wmy = parseFloat(wmy);

            if (event.button === 0) {
                const mouseElement = document.getElementById("mouse");
                mouseElement.value = `${wmx}, ${wmy}`;
                mouseElement.select();
                mouseElement.setSelectionRange(0, 20);
                navigator.clipboard.writeText(mouseElement.value);


                Mouse.leftDown = true;
                Mouse.leftDownThisFrame = true;
                Mouse.startRMX = mx;
                Mouse.startRMY = my;
                Mouse.startCameraPos = Camera.current.position;
            }

            if (event.button === 2) {
                Mouse.rightDown = true;
                Mouse.startRMX = mx;
                Mouse.startRMY = my;
                Mouse.startCameraPos = Camera.current.position;
            }

        }, false);

        window.addEventListener("mouseup", (event) => {
            if (event.button === 2) {
                Mouse.rightDown = false;
            }
            if (event.button === 0) {
                Mouse.leftDown = false;
            }
            this.leftDownThisFrame = false;
        }, false);

        canvas.addEventListener("mousemove", (event) => {
            const mx = event.offsetX * canvasScale;
            const my = (event.target.clientHeight - parseFloat(getComputedStyle(event.target).paddingBottom) - event.offsetY) * canvasScale;

            const wmx = (((-Camera.current.worldPositionVector.x + mx) / (Camera.current.scale.sx()) / canvasScale) * (canvasScale)).toFixed(2);
            const wmy = (((-Camera.current.worldPositionVector.y + my) / (Camera.current.scale.sy()) / canvasScale) * (canvasScale)).toFixed(2);

            Mouse.wmx = parseFloat(wmx);
            Mouse.wmy = parseFloat(wmy);

            Mouse.leftDownThisFrame = false;

            const cameraPositionMatrix = Mouse.startCameraPos.multiply(Matrix2D.Translation((Mouse.startRMX - mx) * (1 / Camera.current.scale.sx()), (Mouse.startRMY - my) * (1 / Camera.current.scale.sy())));

            if (this.rightDown) {
                Camera.current.setPosition(cameraPositionMatrix.x(), cameraPositionMatrix.y(), true);
            }

        }, false);
    }
}

export default Mouse
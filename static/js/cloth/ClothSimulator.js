import ClothPoint from "./ClothPoint.js";
import ClothStick from "./ClothStick.js";
import PiekoszekEngine from "../PiekoszekEngine.js";
import Matrix2D from "../Matrix.js";
import Vector from "../Vector.js";

class ClothSimulator {

    points = []
    sticks = []

    constructor() {

        // const width = 30;
        // const height = 8;
        //
        // const space = 30;
        //
        // const y = 750;
        // const x = 400;


        const width = 8;
        const height = 15;

        const space = 20;

        const y = 700;
        const x = 400;

        for (let i = 0; i < height; i++) {
            for (let j = 0; j < width; j++) {
                this.points[i * width + j] = new ClothPoint(x + j * space, y - i * space)
            }
        }

        for (let i = 0; i < height; i++) {
            for (let j = 0; j < width; j++) {
                if (this.points[i * width + j + 1] && j < width - 1) {
                    this.sticks.push(new ClothStick(this.points[i * width + j], this.points[i * width + j + 1]));

                }
                if (this.points[(i + 1) * width + j]) {
                    this.sticks.push(new ClothStick(this.points[i * width + j], this.points[(i + 1) * width + j]));
                }
            }
        }

        this.points[0].locked = true;
        this.points[2].locked = true;
        this.points[4].locked = true;
        this.points[6].locked = true;
        this.points[width - 1].locked = true;

        this.points.forEach(p => {
            PiekoszekEngine.add(p, true);
        })

    }

    start() {
        PiekoszekEngine.addBehaviour(this.update.bind(this));
    }

    update() {

        this.points.forEach(p => {
            if (!p.locked) {
                const prevPosition = p.position;

                let newX = p.position.x();
                newX += p.position.x() - p.prevPosition.x();

                let newY = p.position.y();
                newY += p.position.y() - p.prevPosition.y();
                newY -= 1; // gravity

                p.position = Matrix2D.Translation(newX, newY);
                p.prevPosition = prevPosition;
            }

            if (p.anchoredTo) {
                p.position = p.anchoredTo.position.copy();
            }
        });

        for (let i = 0; i < 2; i++) {
            this.sticks.forEach(s => {

                if( s.destroyed) {
                    return;
                }

                const p1PositionVector = Vector.FromMatrix(s.p1.position);
                const p2PositionVector = Vector.FromMatrix(s.p2.position);


                const sCenter = p1PositionVector.mid(p2PositionVector);
                const sDirection = p1PositionVector.direction(p2PositionVector).normalized();

                if (!s.p1.locked && !s.p1.anchoredTo) {
                    const newPos = sCenter.subtract(sDirection.multiply(s.halfLength));
                    s.p1.setPosition(newPos.x, newPos.y)
                }

                if (!s.p2.locked && !s.p2.anchoredTo) {
                    const newPos = sCenter.add(sDirection.multiply(s.halfLength));
                    s.p2.setPosition(newPos.x, newPos.y)
                }
            });
        }

        this.sticks.forEach(s => s.drawLine());
    }

    anchor(pointIndex, anchorTarget) {
        this.points[pointIndex].anchoredTo = anchorTarget;
    }

    lock(pointIndex) {
        const p = this.points[pointIndex];
        p.anchoredTo = undefined;
        p.locked = true;
    }

    closestPoint(x, y) {
        let point;
        let length = 12193913;

        this.points.forEach(p => {
            const distance = p.distance(x, y);
            if (distance < length) {
                point = p;
                length = distance
            }
        });

        return point;
    }

}

export default ClothSimulator
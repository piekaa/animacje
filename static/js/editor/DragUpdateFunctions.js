import Regexps from "./Regexps.js";

class DragUpdateFunctions {

    static pointsAndWidth(textSoFar, points, width) {
        let coordinates = "(";
        points.forEach(p => {
            coordinates += `${p.position.x()}, ${p.position.y()}, `;
        });
        return textSoFar.replace(/\(.*\)/,
            `${coordinates}${width})`);
    }

    static pointAndCustomArgs(textSoFar, points) {
        let coordinates = `${points[0].position.x()}, ${points[0].position.y()}`;
        return textSoFar.replace(Regexps.point, coordinates);
    }

    static pointAndTime(textSoFar, points) {
        let point = `${points[0].position.x()}, ${points[0].position.y()}`;
        return textSoFar.replace(Regexps.point, point);
    }

    static textAndPoint(textSoFar, points) {
        let coordinates = `${points[0].position.x()}, ${points[0].position.y()}`;
        return textSoFar.replace(Regexps.varAndPoint,
            (match, text) => {
                return `(${text}, ${coordinates}`;
            });
    }

    static textAndPointWidthHeight(textSoFar, points) {
        let coordinates = `${points[0].position.x()}, ${points[0].position.y()}`;
        return textSoFar.replace(Regexps.point, coordinates);
    }

}

export default DragUpdateFunctions
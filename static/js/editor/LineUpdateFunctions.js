class LineUpdateFunctions {

    static pointsAndWidth(textSoFar, points, width) {
        let coordinates = "(";
        points.forEach(p => {
            coordinates += `${p.position.x()}, ${p.position.y()}, `;
        });
        return textSoFar.replace(/\(.*\)/,
            `${coordinates}${width})`);
    }

    static point(textSoFar, points) {
        let coordinates = `(${points[0].position.x()}, ${points[0].position.y()})`;
        return textSoFar.replace(/\(.*\)/, coordinates);
    }

}

export default LineUpdateFunctions
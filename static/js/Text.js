import Letter from "./Letter.js";

class Text {

    letters = [];

    rotation = 0;

    constructor(text) {

        for (let i = 0; i < text.length; i++) {
            this.letters.push(new Letter(text[i]));
        }

    }

    render() {
        for (let i = 0; i < this.letters.length; i++) {
            const l = this.letters[i];

            l.setPosition(100 + 70 * i, 300);
            l.setScale(0.4 - 0.06 * i, 0.4 - 0.06 * i);

            l.setRotation(this.rotation+=0.4);

            l.updateTransformation();
            l.render()
        }

    }


}

export default Text

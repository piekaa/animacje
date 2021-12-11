import Letter from "./Letter.js";

class Text {

    letters = [];

    rotation = 0;

    constructor(text) {

        for (let i = 0; i < text.length; i++) {
            this.letters.push(new Letter(text[i]));
        }

    }

    update() {
        let offset = 0;
        let scale = 0.3;
        for (let i = 0; i < this.letters.length; i++) {
            const l = this.letters[i];
            offset += l.width/2;
            l.setPosition(100 + offset * scale, 300);
            offset += l.width/2;
            l.setScale(scale, scale);
            l.setRotation(this.rotation+=0.4);
            l.render()
        }

    }


}

export default Text

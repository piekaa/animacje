import AnimatedRenderable from "../animation/AnimatedRenderable.js";
import Letter from "../Letter.js";
import PiekoszekEngine from "../PiekoszekEngine.js";
import Utils from "../utils/Utils.js";

class TextBox extends AnimatedRenderable {

    allLetters = []

    constructor(x, y, text, maxWidth, maxHeight) {
        super();

        let words = []

        let xx = x;
        let yy = y;

        let startX = 0;

        let fullWidth = 0;
        let longestWord = 0;
        let currentWord = 0;

        let letters = [];

        let spaceWidth = 0;

        let letterHeight = 0;

        for (let i = 0; i < text.length; i++) {
            this.allLetters.push(new Letter(text[i]));
        }

        Utils.after(() => {
            return this.allLetters.filter(l => !l.loaded).length === 0;
        }).then(() => {
            for (let i = 0; i < text.length; i++) {
                const l = this.allLetters[i];
                letterHeight = l.height;
                PiekoszekEngine.addAsChild(this, l);
                letters.push(l);
                fullWidth += l.width;
                if (l.getChar() === ' ') {
                    spaceWidth = l.width;
                    if (currentWord > longestWord) {
                        longestWord = currentWord;
                    }
                    words.push({
                        width: currentWord,
                        letters: letters
                    });
                    letters = [];
                    currentWord = 0;
                } else {
                    currentWord += l.width;
                }
            }

            if (currentWord > longestWord) {
                longestWord = currentWord;
            }
            words.push({
                width: currentWord,
                letters: letters
            });

            let scale = 1;
            if (maxWidth) {
                scale = maxWidth / longestWord;
            } else {
                maxWidth = 100000;
            }

            if (letterHeight * scale > maxHeight) {
                scale = maxHeight / letterHeight;
            }

            let lineHeight = 1.2;

            x = 0;
            y = 0;

            if (maxHeight === undefined) {
                words.forEach(w => {
                    if (x + w.width * scale > maxWidth) {
                        x = startX;
                        y -= (letterHeight * lineHeight) * scale;
                    }
                    this.addWord(w.letters, scale, x, y);
                    x += (w.width + spaceWidth) * scale;

                });
            } else {
                do {
                    x = 0;
                    y = 0;
                    words.forEach(w => {
                        if (x + w.width * scale > maxWidth) {
                            x = startX;
                            y -= (letterHeight * lineHeight) * scale;
                        }
                        this.addWord(w.letters, scale, x, y);
                        x += (w.width + spaceWidth) * scale;

                    });
                    scale *= 0.9;
                } while (-y + letterHeight * scale > maxHeight)
            }


            this.setPosition(xx, yy - y / 2);

            if (y === 0) {

                let w = 0;
                words.forEach(word => w += word.width + spaceWidth);
                w -= spaceWidth;
                w *= scale;

                this.setPosition(xx + (maxWidth / 2 - w / 2), yy - y / 2);
            }
        });
    }

    addWord(letters, scale, sx, sy) {
        let x = 0;
        letters.forEach(l => {
            x += l.width / 2 * scale;
            l.setScale(scale, scale);
            l.setPosition(sx + x, sy)
            x += l.width / 2 * scale;
        });
    }

    isReady() {
        return false;
    }

}

export default TextBox
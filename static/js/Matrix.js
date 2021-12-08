class Matrix2D {

    #v

    constructor(values) {
      if(values.length !== 9 && values.length !== 3) {
          throw new Error("Wrong matrix size: " + values.length);
      }
      this.#v = values;
    }

    static Translation(x, y) {
        return new Matrix2D([
            1, 0, x,
            0, 1, y,
            0, 0, 1
        ]);
    }

    static Rotation(radian) {
        return new Matrix2D([
            Math.cos(radian), -Math.sin(radian), 0,
            Math.sin(radian), Math.cos(radian), 0,
            0, 0, 1
        ]);
    }

    static RotationDeg(degree) {
        return this.Rotation(degree * 0.0174532925);
    }

    static Scale(x, y) {
        return new Matrix2D([
            x, 0, 0,
            0, y, 0,
            0, 0, 1
        ]);
    }

    static Identity() {
        return new Matrix2D([
            1, 0, 0,
            0, 1, 0,
            0, 0, 1
        ]);
    }

    // static Point(x, y) {
    //     return new Matrix2D([x,y,1]);
    // }

    float32array() {
        return new Float32Array(this.#v);
    }

    multiply(m) {
        const v = this;
        if(m.size() === 9) {
            return new Matrix2D([
                this.#mulRowColumn(v, m, 0, 0), this.#mulRowColumn(v, m, 0, 1), this.#mulRowColumn(v, m, 0, 2),
                this.#mulRowColumn(v, m, 1, 0), this.#mulRowColumn(v, m, 1, 1), this.#mulRowColumn(v, m, 1, 2),
                this.#mulRowColumn(v, m, 2, 0), this.#mulRowColumn(v, m, 2, 1), this.#mulRowColumn(v, m, 2, 2)
            ])
        }

        if(m.length === 3) {
            return new Matrix2D([
                v[0] * m[0] + v[1] * m[1] + v[2] * m[2],
                v[3] * m[0] + v[4] * m[1] + v[5] * m[2],
                v[6] * m[0] + v[7] * m[1] + v[8] * m[2]
            ])
        }

        throw new Error("Wrong matrix size: " + m.size());
    }

    size() {
        return this.#v.length;
    }
    
    x() {
        return this.#v[2];
    }
    
    y() {
        return this.#v[5];
    }

    #mulRowColumn(m1, m2, row, column) {

        m1 = m1.#v;
        m2  = m2.#v;

        return m1[this.#rp(row, 0)] * m2[this.#cp(column, 0)] +
         m1[this.#rp(row, 1)] * m2[this.#cp(column, 1)] +
         m1[this.#rp(row, 2)] * m2[this.#cp(column, 2)];
    }


    //row position
    #rp(row, position) {
        return row * 3 + position;
    }

    //column position
    #cp(column, position) {
        return position * 3 + column;
    }

    display() {
        const v = this.#v;
        if(this.#v.length === 3) {
            console.log(`${v[0]}\n${v[1]}\n${v[2]}`)
        }
        if(this.#v.length === 9) {
            console.log(`${v[0]} ${v[1]} ${v[2]}\n${v[3]} ${v[4]} ${v[5]}\n${v[6]} ${v[7]} ${v[8]}\n`)
        }
    }

}

export default Matrix2D
import PiekoszekEngine from "./2d.js";
import Letter from "./Letter.js";

PiekoszekEngine.start();

let p = new Letter("P");

let i = new Letter("i");
let e = new Letter("e");
let k = new Letter("k");


let o = new Letter("o");
let s = new Letter("s");
let z = new Letter("z");
let e2 = new Letter("e");
let k2 = new Letter("k");



p.setPosition(400, 330);
p.setScale(0.3,0.3);


i.setPosition(300, 0);
e.setPosition(-300, 0);
k.setPosition(0, 500);
k.setScale(0.5,0.5);

o.setPosition(150, 0);
o.setPosition(250, 0);
s.setPosition(450, 0);
z.setPosition(650, 0);
e2.setPosition(900, 0);
k2.setPosition(1100, 0);

PiekoszekEngine.add(p);

PiekoszekEngine.addAsChild(p, i);
PiekoszekEngine.addAsChild(p, e);
PiekoszekEngine.addAsChild(p, k);


PiekoszekEngine.addAsChild(k, o);
PiekoszekEngine.addAsChild(k, s);
PiekoszekEngine.addAsChild(k, z);
PiekoszekEngine.addAsChild(k, e2);
PiekoszekEngine.addAsChild(k, k2);


let rotation = 0;
PiekoszekEngine.addBehaviour( () =>{
    rotation+=1.3;
    p.setRotation(rotation);
    i.setRotation(-rotation);
    e.setRotation(rotation*2);
    k.setRotation(rotation*3);
    z.setRotation(-rotation*4)
});
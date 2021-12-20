import PiekoszekEngine from "./PiekoszekEngine.js";
import ClothSimulator from "./cloth/ClothSimulator.js";


PiekoszekEngine.start();

setTimeout( () => {
    const cs = new ClothSimulator();
    cs.start();
}, 1000);


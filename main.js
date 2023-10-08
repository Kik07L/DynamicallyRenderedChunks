import Monde from "./Monde/Monde.js";
import Millis from "./Millis.js"

export function lerp(start, end, amt) {
    return (1 - amt) * start + amt * end
}

var params = {
    fullscreen: true
}

console.log("START");

var mousePos = {
    x: 0,
    y: 0
}

class A {
    constructor(x) {
        this.x = x
    }
}

/*
let a1 = new A(1)
let a2 = new A(2)
let a3 = new A(3)
let a4 = new A(4)

let coucou = [a1, a2, a3, a4]


console.log(coucou)

for (let i in coucou) {
    if (a2 == coucou[i]) {
        coucou.splice(i, 1)
    }
}
console.log(coucou)
*/

window.addEventListener("mousemove", (e) => {
    mousePos.x = e.clientX;
    mousePos.y = e.clientY;
})

window.addEventListener('keydown', function (event) {
    mondeActif.Input(event.key, true)
});

window.addEventListener('keyup', function (event) {
    mondeActif.Input(event.key, false)
});

var elem = document.body;
var two = new Two(params).appendTo(elem);

export var mondeActif = new Monde(two, 50, 50, 40, 6);

var mouseCircle = two.makeCircle(50, 50, 10)
mouseCircle.fill = "black"

two.bind('update', update);
two.play();


function update(frameCount) {
    Millis.Update();

    mouseCircle.position.set(mousePos.x, mousePos.y)

    mondeActif.Update()
    mondeActif.Render(two)
}
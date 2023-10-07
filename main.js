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

export var mondeActif = new Monde(two, 50, 50, 30, 6);

var coucou = two.makeCircle(50, 50, 10)
coucou.fill = "black"

two.bind('update', update);
two.play();


function update(frameCount) {
    Millis.Update();

    coucou.position.set(mousePos.x, mousePos.y)

    mondeActif.Update()
    mondeActif.Render(two)
}
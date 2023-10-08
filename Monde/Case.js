import { perlin } from "../Libraries/Perlin.js"
import { lerp } from "../main.js"

export default class Case {
    constructor(monde, two, displayGroup, pos = { x: 0, y: 0 }) {
        this.monde = monde;
        this.two = two
        this.display = null
        this.displayGroup = displayGroup
        this.pos = pos
    }

    Update() {
    }

    Render(x, y) {
        if (this.display == null) this.CreateDisplay();
        this.display.position.set(x + this.monde.tailleCase / 2, y + this.monde.tailleCase / 2)
    }

    CreateDisplay() {
        this.display = this.two.makeRectangle(0, 0, this.monde.tailleCase, this.monde.tailleCase)

        let green = (perlin.get(this.pos.x / 20, this.pos.y / 20) + 1) * 127.5
        let red = 0
        let blue = 100 - green
        blue = lerp(blue, (perlin.get(this.pos.x / 10, this.pos.y / 10) + 1) * 127.5, 0.5)

        this.display.fill = "rgb(" + red + ", " + green + ", " + blue + ")"
        this.displayGroup.add(this.display)
    }
}
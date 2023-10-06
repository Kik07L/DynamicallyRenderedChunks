import Millis from "../Millis.js"

export default class Entity {
    constructor(two, displayGroup, monde, posx, posy) {
        this.pos = {
            x: posx,
            y: posy
        }

        this.displayGroup = displayGroup

        this.monde = monde

        this.display = two.makeRectangle(0, 0, monde.tailleCase - 10, monde.tailleCase - 10)
        this.display.fill = "blue"

        this.displayGroup = displayGroup
        this.displayGroup.add(this.display)

        this.deplCooldown = 100
        this.deplTimer = 0
    }

    Update() {

    }

    Render() {
        this.display.position.set(
            this.pos.x * this.monde.tailleCase + this.monde.tailleCase / 2,
            this.pos.y * this.monde.tailleCase + this.monde.tailleCase / 2
        )
    }

    Deplacement(x = 0, y = 0) {
        this.pos.x += x;
        this.pos.y += y
    }

    UnloadDisplay() {
        this.displayGroup.remove(this.display)
    }

    LoadDisplay() {
        this.displayGroup.add(this.display)
    }
}
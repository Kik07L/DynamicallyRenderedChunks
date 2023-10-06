export default class Case {
    constructor(monde, two, displayGroup) {
        this.monde = monde;
        this.two = two
        this.display = null
        this.CreateDisplay()

        this.displayGroup = displayGroup
        this.displayGroup.add(this.display)
    }

    Update() {
    }

    Render(x, y) {
        this.display.position.set(x + this.monde.tailleCase / 2, y + this.monde.tailleCase / 2)
    }

    CreateDisplay() {
        this.display = this.two.makeRectangle(0, 0, this.monde.tailleCase, this.monde.tailleCase)
        this.display.fill = "green"
    }
}
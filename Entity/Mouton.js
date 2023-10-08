import Entity from "./Entity.js"
import displayData from "./Displays/Mouton.json" assert { type: "json" }

export default class Mouton extends Entity {
    constructor(two, displayGroup, monde, posx, posy) {
        super(two, displayGroup, monde, posx, posy)
        this.setDisplay(displayData)

    }


}
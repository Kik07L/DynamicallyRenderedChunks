import Entity from "../Entity.js"
import displayData from "../Displays/Block.json" assert { type: "json" }

export default class Block extends Entity{
    constructor(two, displayGroup, monde, posx, posy) {
        super(two, displayGroup, monde, posx, posy)

        this.setDisplay(displayData)
    }

    Render() {
        super.Render()
        console.log("sheeeesh")
    }
}
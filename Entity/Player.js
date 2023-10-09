import Millis from "../Millis.js"
import Entity from "./Entity.js"
import { lerp } from "../main.js"

export default class Player extends Entity {

    constructor(two, displayGroup, monde, posx, posy) {
        super(two, displayGroup, monde, posx, posy)

        this.renderDistance = 1
        this.display.fill = "red"

        this.inputToDir = {
            'z': 'up',
            'q': 'left',
            's': 'down',
            'd': 'right',
        }

        this.dirToDepl = {
            'up': { x: 0, y: -1, state: false },
            'down': { x: 0, y: 1, state: false },
            'left': { x: -1, y: 0, state: false },
            'right': { x: 1, y: 0, state: false }
        }

        this.UpdatePosChunk()

    }

    Update() {
        Object.keys(this.dirToDepl).forEach(key => {
            const value = this.dirToDepl[key]
            if (value.state) {
                if (this.IsDeplCooldownFinished()) {
                    this.Deplacement(value.x, value.y)
                }
            }
        })
    }

    Render() {
        this.display.position.set(
            lerp(this.display.position.x, this.pos.x * this.monde.tailleCase + this.monde.tailleCase / 2, 0.3),
            lerp(this.display.position.y, this.pos.y * this.monde.tailleCase + this.monde.tailleCase / 2, 0.3),
        )
    }



    Input(key, state) {
        if (key in this.inputToDir)
            this.dirToDepl[this.inputToDir[key]].state = state;
    }

    Deplacement(x = 0, y = 0) {
        if (super.Deplacement(x, y)) {
            const tempPosChunk = { ...this.posChunk }
            this.UpdatePosChunk()

            //  Update la distance de rendu que si on a changé de chunk 
            //  et si la camera n'est pas statique
            if (!this.monde.staticCamera) {
                if (tempPosChunk.x != this.posChunk.x || tempPosChunk.y != this.posChunk.y) {
                    this.monde.UpdateRenderDistance(this.posChunk, { x: this.posChunk.x - tempPosChunk.x, y: this.posChunk.y - tempPosChunk.y })
                }
            }
            return true
        }
        return false
    }


}
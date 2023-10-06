import Millis from "../Millis.js"
import Entity from "./Entity.js"

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

        this.posChunk = { x: undefined, y: undefined }
        this.UpdatePosChunk()

    }

    Update() {
        Object.keys(this.dirToDepl).forEach(key => {
            const value = this.dirToDepl[key]
            if (value.state) {
                if (Millis.millis() == this.deplTimer || Millis.millis() - this.deplTimer > this.deplCooldown) {
                    this.deplTimer = Millis.millis()
                    this.Deplacement(value.x, value.y)
                }
            }
        })
    }


    Input(key, state) {
        if (key in this.inputToDir)
            this.dirToDepl[this.inputToDir[key]].state = state;
    }

    Deplacement(x = 0, y = 0) {
        super.Deplacement(x, y)
        const temp = { ...this.posChunk }
        this.UpdatePosChunk()

        if (temp.x != this.posChunk.x || temp.y != this.posChunk.y) {
            //console.log("changement de chunk :", this.posChunk)
            this.monde.UpdateRenderDistance(this.posChunk, { x: this.posChunk.x - temp.x, y: this.posChunk.y - temp.y })
        }
    }

    UpdatePosChunk() {
        this.posChunk = {
            x: Math.floor(this.pos.x / this.monde.tailleChunks),
            y: Math.floor(this.pos.y / this.monde.tailleChunks)
        }
    }
}
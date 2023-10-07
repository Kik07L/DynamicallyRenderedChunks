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

        this.deplCooldown = 50
        this.deplTimer = 0

        this.posChunk = { x: undefined, y: undefined }
        this.UpdatePosChunk()
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


        for (let xChunk = -1; xChunk < 2; xChunk++) {
            for (let yChunk = -1; yChunk < 2; yChunk++) {
                let xCheck = xChunk + this.posChunk.x
                let yCheck = yChunk + this.posChunk.y

                //if (!this.isLoaded(xCheck, yCheck, x, y)) return false
                
                if (this.isCollision(xCheck, yCheck, x, y)) return false
            }
        }

        this.pos.x += x;
        this.pos.y += y;
        return true

    }

    isCollision(xCheck, yCheck, xDir, yDir) {
        if (xCheck >= 0 && xCheck < this.monde.allChunks.length && yCheck >= 0 && yCheck < this.monde.allChunks[0].length) {
            let chunk = this.monde.allChunks[xCheck][yCheck]
            for (let j in chunk.entities) {
                let ent = chunk.entities[j]
                if (ent.pos.x == this.pos.x + xDir && ent.pos.y == this.pos.y + yDir)
                    return true

            }
        }
        return false
    }

    isLoaded(xCheck, yCheck, xDir, yDir) {
        if (!this.willIChangeChunk(xDir, yDir)) {
            if (xCheck >= 0 && xCheck < this.monde.allChunks.length && yCheck >= 0 && yCheck < this.monde.allChunks[0].length) {
                let chunk = this.monde.allChunks[xCheck][yCheck]
                return chunk.loaded
            }
        } else {
            let posChunk2 = {
                x: Math.floor((this.pos.x + xDir) / this.monde.tailleChunks),
                y: Math.floor((this.pos.y + yDir) / this.monde.tailleChunks)
            }

            xCheck = posChunk2.x;
            yCheck = posChunk2.y;

            console.log(posChunk2)

            if (xCheck >= 0 && xCheck < this.monde.allChunks.length && yCheck >= 0 && yCheck < this.monde.allChunks[0].length) {
                let chunk = this.monde.allChunks[xCheck][yCheck]

                return chunk.loaded
            }
        }
        return false
    }

    willIChangeChunk(xDir, yDir) {
        let posChunk = {
            x: Math.floor(this.pos.x / this.monde.tailleChunks),
            y: Math.floor(this.pos.y / this.monde.tailleChunks)
        }

        let posChunk2 = {
            x: Math.floor((this.pos.x + xDir) / this.monde.tailleChunks),
            y: Math.floor((this.pos.y + yDir) / this.monde.tailleChunks)
        }

        if (posChunk.x != posChunk2.x || posChunk.y != posChunk2.y) {
            return true
        }
        return false
    }

    UpdatePosChunk() {
        this.posChunk = {
            x: Math.floor(this.pos.x / this.monde.tailleChunks),
            y: Math.floor(this.pos.y / this.monde.tailleChunks)
        }
    }

    UnloadDisplay() {
        this.displayGroup.remove(this.display)
    }

    LoadDisplay() {
        this.displayGroup.add(this.display)
    }
}
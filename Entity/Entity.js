import Millis from "../Millis.js"

export default class Entity {
    constructor(two, displayGroup, monde, posx, posy) {
        this.pos = {
            x: posx,
            y: posy
        }

        this.displayGroup = displayGroup

        this.monde = monde

        this.display = two.makeRectangle(0, 0, monde.tailleCase, monde.tailleCase)
        this.loadDisplayData()

        this.displayGroup = displayGroup
        this.displayGroup.add(this.display)

        this.deplCooldown = 100
        this.deplTimer = 0

        this.posChunk = { x: undefined, y: undefined }
        this.UpdatePosChunk()
    }

    async loadDisplayData() {
        try {
            const response = await fetch("public/Displays/Entity.json");
            if (!response.ok) {
                throw new Error("Erreur lors du chargement du fichier JSON");
            }
            const displayData = await response.json();
            this.setDisplay(displayData);
        } catch (error) {
        }
    }

    Update() {
        if (this.IsDeplCooldownFinished()) {
            //console.log(this.pos, "Update")
            //this.Deplacement(1, 0)
        }
    }

    Render() {
        this.display.position.set(
            this.pos.x * this.monde.tailleCase + this.monde.tailleCase / 2,
            this.pos.y * this.monde.tailleCase + this.monde.tailleCase / 2
        )
    }

    setDisplay(jsonFile) {
        this.display.fill = jsonFile.fill
        this.display.stroke = jsonFile.stroke
        this.display.width = this.display.width * jsonFile.width
        this.display.height = this.display.height * jsonFile.height
    }

    IsDeplCooldownFinished() {
        if (Millis.millis() == this.deplTimer || Millis.millis() - this.deplTimer > this.deplCooldown) {
            this.deplTimer = Millis.millis()
            return true
        }
        return false
    }

    Deplacement(x = 0, y = 0) {


        if (!this.isLoaded(this.posChunk.x, this.posChunk.y, x, y)) return false

        for (let xChunk = -1; xChunk < 2; xChunk++) {
            for (let yChunk = -1; yChunk < 2; yChunk++) {
                let xCheck = xChunk + this.posChunk.x
                let yCheck = yChunk + this.posChunk.y

                if (this.isCollision(xCheck, yCheck, x, y)) return false
            }
        }

        const ancienPosChunk = this.GetPosChunk()

        this.pos.x += x;
        this.pos.y += y;

        const nouveauPosChunk = this.GetPosChunk()

        if (ancienPosChunk.x != nouveauPosChunk.x || ancienPosChunk.y != nouveauPosChunk.y) {
            let ancienChunk = this.monde.allChunks[ancienPosChunk.x][ancienPosChunk.y]
            let nouveauChunk = this.monde.allChunks[nouveauPosChunk.x][nouveauPosChunk.y]
            for (let i in ancienChunk.entities) {
                if (ancienChunk.entities[i] == this) {
                    ancienChunk.entities.splice(i, 1)
                    //console.log(this, [ancienChunk.x, ancienChunk.y] ,[nouveauChunk.x, nouveauChunk.y] )
                    break
                }
            }
            nouveauChunk.entities.push(this)
        }

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
        this.posChunk = this.GetPosChunk()
    }

    GetPosChunk() {
        return {
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

    SetPos(x, y) {
        this.pos.x = x;
        this.pos.y = y;
        this.UpdatePosChunk()
    }
}
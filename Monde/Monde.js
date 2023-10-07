import Case from "./Case.js";
import Entity from "../Entity/Entity.js";
import Player from "../Entity/Player.js";
import Chunk from "./Chunk.js";
import { Timer } from "../Millis.js"

export default class Monde {
    constructor(two, taillex, tailley, tailleCase, tailleChunks) {
        let tx = taillex, ty = tailley
        taillex = Math.floor(taillex / tailleChunks) * tailleChunks
        tailley = Math.floor(tailley / tailleChunks) * tailleChunks
        console.log("refactored :", tx + "/" + ty, "in", taillex + "/" + tailley + " (multiple de this.tailleChunks)")

        this.staticCamera = false;

        this.taillex = taillex;
        this.tailley = tailley;
        this.tailleCase = tailleCase;
        this.tailleChunks = tailleChunks
        this.renderedChunks = []

        this.displayGroup = two.makeGroup()
        this.alwaysOnTopGroup = two.makeGroup()

        this.allEntities = []
        this.allCases = [] //[][]
        this.casesDisplays = []


        this.pileChunkRender = [];

        let timer = new Timer()
        let allTimer = new Timer()
        timer.Pin()
        allTimer.Pin()

        this.entityTypes = {
            "Player": Player
        }

        //INIT ALL CHUNKS
        this.allChunks = []
        for (let x = 0; x < taillex / tailleChunks; x++) {
            let col = []
            for (let y = 0; y < tailley / tailleChunks; y++) {
                col.push(new Chunk(this, this.displayGroup, x, y, tailleChunks))
            }
            this.allChunks.push(col)
        }

        console.log("Init chunks : "+timer.PinString())

        //INIT ALL CASES
        let nombreCases = taillex * tailley
        for (let x = 0; x < taillex; x++) {
            let temp = []
            console.log(Math.round((x * tailley / nombreCases) * 100) + "%")
            for (let y = 0; y < tailley; y++) {
                let caseIci = new Case(this, two, this.displayGroup)
                temp.push(caseIci)
                this.casesDisplays.push(caseIci.display)

                let chunkPos = {
                    x: Math.floor(x / this.tailleChunks),
                    y: Math.floor(y / this.tailleChunks)
                }

                //Mise dans le chunk correspondant
                this.allChunks
                [chunkPos.x][chunkPos.y].AddCase(caseIci, x, y)
            }
            this.allCases.push(temp)
        }
        console.log("Cases générées !! "+timer.PinString())


        //INIT TEST ENTITY
        for (let i = 0; i < 10; i++) {
            this.allEntities.push(new Entity(two, this.alwaysOnTopGroup, this,
                Math.round(Math.random() * (taillex - 1)),
                Math.round(Math.random() * (tailley - 1)),
            ))
        }
        console.log("Test entities créées !! "+timer.PinString())


        //INIT PLAYER
        this.player = new this.entityTypes["Player"](two, this.alwaysOnTopGroup, this, 5, 5)

        this.SetupAllChunks();
        console.log("Chunks setup !! "+timer.PinString())

        //DEBUG
        this.renderChunks = true
        if (this.renderChunks) {
            for (let x = 0; x < taillex / tailleChunks; x++) {
                for (let y = 0; y < tailley / tailleChunks; y++) {
                    let rect = two.makeRectangle(x * tailleCase * tailleChunks + tailleCase * tailleChunks / 2, y * tailleCase * tailleChunks + tailleCase * tailleChunks / 2,
                        tailleCase * tailleChunks, tailleCase * tailleChunks)
                    rect.fill = "transparent"
                    rect.stroke = "red"
                    this.alwaysOnTopGroup.add(rect)
                }
            }
        }

        for (let x = 0; x < taillex / tailleChunks; x++) {
            for (let y = 0; y < tailley / tailleChunks; y++) {
                this.allChunks[x][y].Render()
            }
        }
        console.log("Chunks prérender !! "+timer.PinString())


        //UNLOAD ALL CHUNKS
        for (let x = 0; x < taillex / tailleChunks; x++) {
            for (let y = 0; y < tailley / tailleChunks; y++) {
                this.allChunks[x][y].UnloadDisplays()
            }
        }
        console.log("Chunks unload !! "+timer.PinString())


        this.UpdateRenderDistance(this.player.posChunk, { x: 0, y: 0 })

        console.log(this.allChunks)
        allTimer.Pin("ALL TIME")
        console.log("FIN CONSTRUCTEUR MONDE")
    }

    Update() {
        this.player.Update()
        this.LoadUnloadChunks()

    }

    Render() {
        this.allEntities.forEach(entity => {
            entity.Update()
            entity.Render()
        });

        this.player.Render();

        if (!this.staticCamera) {
            this.displayGroup.position.set(
                -this.player.display.position.x + window.innerWidth / 2,
                -this.player.display.position.y + window.innerHeight / 2
            )

            this.alwaysOnTopGroup.position.set(
                -this.player.display.position.x + window.innerWidth / 2,
                -this.player.display.position.y + window.innerHeight / 2
            )
        }
    }

    Input(key, state) {
        this.player.Input(key, state)
        if (key == "c" && state == true) {
            this.staticCamera = !this.staticCamera
        }
    }

    SetupAllChunks() {
        this.allEntities.forEach(entity => {
            let pos = {
                x: Math.floor(entity.pos.x / this.tailleChunks),
                y: Math.floor(entity.pos.y / this.tailleChunks)
            }

            this.allChunks[pos.x][pos.y].entities.push(entity)
        });

    }

    LoadUnloadChunks() {

        if (this.pileChunkRender.length > 0) {
            //console.log(this.pileChunkRender)

            let chunk = this.pileChunkRender[0]

            if (chunk.load) {
                chunk.chunk.LoadDisplays()
                this.renderedChunks.push(chunk.chunk)
            }
            else {
                chunk.chunk.UnloadDisplays()
                this.renderedChunks.splice(chunk.chunk, 1)
            }

            this.pileChunkRender.splice(0, 1)
        }
    }

    UpdateRenderDistance(posChunk, direction) {

        let tempUnload = this.ToUnloadChunks(posChunk, direction)
        for (let i in tempUnload) {
            this.pileChunkRender.push(tempUnload[i])
        }

        let tempLoad = this.ToLoadChunks(posChunk)
        for (let i in tempLoad) {
            this.pileChunkRender.push(tempLoad[i])
        }

    }

    ToLoadChunks(posChunk) {

        let chunks = []
        for (let x = - this.player.renderDistance; x <= this.player.renderDistance; x++) {
            for (let y = - this.player.renderDistance; y <= this.player.renderDistance; y++) {

                const xP = x + posChunk.x, yP = y + posChunk.y
                if (xP >= 0 && yP >= 0 && xP < this.allChunks.length && yP < this.allChunks[0].length) {
                    let chunk = this.allChunks[xP][yP]
                    if (!chunk.loaded) {
                        chunks.push({ chunk: chunk, load: true })
                    }
                }
            }
        }

        return chunks
        //{chunk:chunk, load:bool}
    }

    ToUnloadChunks(posChunk, direction) {

        let chunks = []

        if (direction.x != 0) {
            let posX = posChunk.x - (this.player.renderDistance * direction.x) - direction.x
            for (let y = -this.player.renderDistance + posChunk.y; y <= this.player.renderDistance + posChunk.y; y++) {
                if (posX >= 0 && y >= 0 && posX < this.allChunks.length && y < this.allChunks[0].length) {

                    let chunk = this.allChunks[posX][y]
                    chunks.push({ chunk: chunk, load: false })
                }
            }
        }

        if (direction.y != 0) {
            let posY = posChunk.y - (this.player.renderDistance * direction.y) - direction.y
            for (let x = -this.player.renderDistance + posChunk.x; x <= this.player.renderDistance + posChunk.x; x++) {
                if (posY >= 0 && x >= 0 && posY < this.allChunks.length && x < this.allChunks[0].length) {

                    let chunk = this.allChunks[x][posY]
                    chunks.push({ chunk: chunk, load: false })
                }
            }
        }

        return chunks
        //{chunk:chunk, load:bool}
    }
}
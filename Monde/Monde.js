
import Entity from "../Entity/Entity.js";
import Mouton from "../Entity/Mouton.js";
import Player from "../Entity/Player.js";

import Case from "./Case.js";
import Chunk from "./Chunk.js";

import { Timer } from "../Millis.js"

export default class Monde {
    constructor(two, taillex, tailley, tailleCase, tailleChunks) {
        let tx = taillex, ty = tailley
        taillex = Math.floor(taillex / tailleChunks) * tailleChunks
        tailley = Math.floor(tailley / tailleChunks) * tailleChunks
        console.log("refactored :", tx + "/" + ty, "in", taillex + "/" + tailley + " (multiple de this.tailleChunks)")

        this.staticCamera = false;
        this.staticCameraPosChunk = { x: 0, y: 0 }
        this.staticCameraPos = { x: 0, y: 0 }

        this.renderingSpeed = 2

        this.taillex = taillex;
        this.tailley = tailley;
        this.tailleCase = tailleCase;
        this.tailleChunks = tailleChunks

        this.displayGroup = two.makeGroup()
        this.alwaysOnTopGroup = two.makeGroup()

        this.allEntities = []
        this.allCases = [] //[][]


        this.pileChunkRender = [];

        let timer = new Timer()
        let allTimer = new Timer()
        timer.Pin()
        allTimer.Pin()

        this.entityTypes = {
            "Player": Player,
            "Mouton": Mouton
        }

        //INIT ALL CHUNKS OPTI
        this.allChunks = []
        for (let x = 0; x < taillex / tailleChunks; x++) {
            let col = []
            for (let y = 0; y < tailley / tailleChunks; y++) {
                col.push(new Chunk(this, this.displayGroup, x, y, tailleChunks))
            }
            this.allChunks.push(col)
        }

        console.log("Init chunks : " + timer.PinString())

        //INIT ALL CASES
        let nombreCases = taillex * tailley
        for (let x = 0; x < taillex; x++) {
            let temp = []
            console.log(Math.round((x * tailley / nombreCases) * 100) + "%")
            for (let y = 0; y < tailley; y++) {
                let caseIci = new Case(this, two, this.displayGroup, { x: x, y: y })
                temp.push(caseIci)

                let chunkPos = {
                    x: Math.floor(x / this.tailleChunks),
                    y: Math.floor(y / this.tailleChunks)
                }

                //Mise dans le chunk correspondant
                this.allChunks[chunkPos.x][chunkPos.y].AddCase(caseIci, x, y)
            }
            this.allCases.push(temp)
        }
        console.log("Cases générées !! " + timer.PinString())


        //INIT TEST ENTITY
        for (let i = 0; i < 100; i++) {
            this.allEntities.push(new this.entityTypes["Mouton"](two, this.alwaysOnTopGroup, this,
                Math.round(Math.random() * (taillex - 1)),
                Math.round(Math.random() * (tailley - 1)),
            ))
        }
        console.log("Test entities créées !! " + timer.PinString())


        //INIT PLAYER
        this.player = new this.entityTypes["Player"](two, this.alwaysOnTopGroup, this, 5, 5)

        this.SetupEntitiesInChunks();
        console.log("Chunks entities setup !! " + timer.PinString())

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

        /*
        for (let x = 0; x < taillex / tailleChunks; x++) {
            for (let y = 0; y < tailley / tailleChunks; y++) {
                this.allChunks[x][y].Render()
            }
        }
        console.log("Chunks prérender !! " + timer.PinString())
        */

        //UNLOAD ALL CHUNKS
        for (let x = 0; x < taillex / tailleChunks; x++) {
            for (let y = 0; y < tailley / tailleChunks; y++) {
                this.allChunks[x][y].UnloadDisplays()
            }
        }
        console.log("Chunks unload !! " + timer.PinString())


        this.UpdateRenderDistance(this.player.posChunk, { x: 0, y: 0 })

        //console.log(this.allChunks)
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
            if (!this.staticCamera) {
                this.staticCamera = true
                this.staticCameraPosChunk = { ...this.player.posChunk }
                this.staticCameraPos = { ...this.player.pos }
            } else {
                this.staticCamera = false
                let depl = {
                    x: this.player.posChunk.x - this.staticCameraPosChunk.x,
                    y: this.player.posChunk.y - this.staticCameraPosChunk.y
                }

                if (depl.x > 1 || depl.x < -1 || depl.y > 1 || depl.y < -1) {
                    this.player.setPos(this.staticCameraPos.x, this.staticCameraPos.y)
                } else {
                    this.UpdateRenderDistance(this.player.posChunk, depl)
                }
            }
        }
    }

    SetupEntitiesInChunks() {
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
            //let timer = new Timer()

            for (let i = 0; i < this.renderingSpeed; i++) {

                if (this.pileChunkRender.length > 0) {
                    //console.log(this.pileChunkRender)

                    let chunk = this.pileChunkRender[0]

                    if (chunk.load) {
                        chunk.chunk.LoadDisplays()
                        chunk.chunk.Render()
                    }
                    else {
                        chunk.chunk.UnloadDisplays()
                    }

                    this.pileChunkRender.splice(0, 1)
                }
            }
            //timer.Pin()
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
        let nbDirs = 0

        if (direction.x != 0) {
            nbDirs++

            //La colonne qui à renderdistance du joueur dans la direction opposée
            let posX = posChunk.x - (this.player.renderDistance * direction.x) - direction.x

            for (let y = -this.player.renderDistance + posChunk.y; y <= this.player.renderDistance + posChunk.y; y++) {
                if (posX >= 0 && y >= 0 && posX < this.allChunks.length && y < this.allChunks[0].length) {

                    let chunk = this.allChunks[posX][y]
                    chunks.push({ chunk: chunk, load: false })
                }
            }
        }

        if (direction.y != 0) {
            nbDirs++

            //La ligne qui à renderdistance du joueur dans la direction opposée
            let posY = posChunk.y - (this.player.renderDistance * direction.y) - direction.y
            for (let x = -this.player.renderDistance + posChunk.x; x <= this.player.renderDistance + posChunk.x; x++) {
                if (posY >= 0 && x >= 0 && posY < this.allChunks.length && x < this.allChunks[0].length) {

                    let chunk = this.allChunks[x][posY]
                    chunks.push({ chunk: chunk, load: false })
                }
            }
        }

        //On a un coin qui doit être déchargé
        if (nbDirs == 2) {
            let posX = posChunk.x - (this.player.renderDistance * direction.x) - direction.x
            let posY = posChunk.y - (this.player.renderDistance * direction.y) - direction.y

            let chunk = this.allChunks[posX][posY]
            chunks.push({ chunk: chunk, load: false })
        }

        return chunks
        //{chunk:chunk, load:bool}
    }
}
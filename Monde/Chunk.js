export default class Chunk {
    constructor(monde, displayGroup, x, y, taille = 16, cases = 0, entities = 0) {
        this.x = x
        this.y = y
        this.taille = taille
        this.monde = monde
        this.displayGroup = displayGroup
        this.loaded = false

        if (cases == 0) {
            this.cases = []
            for (let x = 0; x < taille; x++) {
                let temp = []
                for (let y = 0; y < taille; y++) {
                    temp.push([])
                }

                this.cases.push(temp)
            }
        } else this.cases = cases

        if (entities == 0)
            this.entities = []
        else this.entities = entities
    }

    Render() {
        for (let x = 0; x < this.taille; x++) {
            for (let y = 0; y < this.taille; y++) {
                this.cases[x][y].Render(
                    (x + this.x * this.taille) * this.monde.tailleCase,
                    (y + this.y * this.taille) * this.monde.tailleCase,
                );
            }
        }
    }

    UnloadDisplays() {
        this.loaded = false

        for (let x = 0; x < this.taille; x++) {
            for (let y = 0; y < this.taille; y++) {
                this.displayGroup.remove(this.cases[x][y].display)
            }
        }
        
        for (let i in this.entities) {
            this.entities[i].UnloadDisplay()
        }
    }

    LoadDisplays() {
        this.loaded = true

        for (let x = 0; x < this.taille; x++) {
            for (let y = 0; y < this.taille; y++) {
                this.displayGroup.add(this.cases[x][y].display)
            }
        }

        for (let i in this.entities) {
            this.entities[i].LoadDisplay()
        }
    }
    AddCase(cas, x, y) {
        this.cases
        [x - this.x * this.taille]
        [y - this.y * this.taille] = cas
    }

}
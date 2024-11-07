import Entity from "../Entity.js"

export default class Block extends Entity{
    constructor(two, displayGroup, monde, posx, posy) {
        super(two, displayGroup, monde, posx, posy)
        this.loadDisplayData()

    }
    
    async loadDisplayData() {
        try {
            const response = await fetch("public/Displays/Block.json");
            if (!response.ok) {
                throw new Error("Erreur lors du chargement du fichier JSON");
            }
            const displayData = await response.json();
            this.setDisplay(displayData);
        } catch (error) {
        }
    }

    Render() {
        super.Render()
        console.log("sheeeesh")
    }
}
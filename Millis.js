export default class Millis {
    static millisCount = 0
    static perSec = 0

    static Update() {
        this.millisCount++
        
    }

    static millis() {
        return this.millisCount * 10
    }
}
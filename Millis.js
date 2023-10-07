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

export class Timer {

    constructor() {
        this.timer = performance.now()
    }

    Pin(str = "TIMER") {
        console.log(str+" : " + (performance.now() - this.timer))
        this.timer = performance.now()
    }

    PinString(str = "TIMER") {
        let ret = str+" : " + (performance.now() - this.timer)
        this.timer = performance.now()

        return ret
    }
}
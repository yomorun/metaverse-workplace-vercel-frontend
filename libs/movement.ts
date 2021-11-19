// Distance per movement (in px)
const SPEED = 10

// Coordinate system: position & direction of movement
export class Vector {
    public x: number
    public y: number

    constructor(x: number, y: number) {
        this.x = x
        this.y = y
    }

    // Calculation of move position = CurrentPosition.add(Move_Direction_Vector)
    add(vec: Vector) {
        this.x += vec.x * SPEED
        this.y += vec.y * SPEED
        return this
    }

    equal(vec: Vector) {
        return this.x === vec.x && this.y === vec.y
    }

    toString() {
        // return `[${this.x} , ${this.y}] ${(new Date).valueOf()}`;
        return `[${this.x} , ${this.y}]`
    }
}

// Vector of four moving directions
const dirLeft = new Vector(-1, 0)
const dirRight = new Vector(1, 0)
const dirUp = new Vector(0, -1)
const dirDown = new Vector(0, 1)

// Transform W, A, S, D into vectors of moving directions
export const move = (e: { code: string }) => {
    let dir
    switch (e.code) {
        case 'KeyW':
            dir = dirUp
            break
        case 'KeyS':
            dir = dirDown
            break
        case 'KeyA':
            dir = dirLeft
            break
        case 'KeyD':
            dir = dirRight
            break
        default:
            dir = new Vector(0, 0)
    }
    
    return dir
}

// Only accepts events from the W, A, S and D buttons
export const keyPressWASD = (e: { code: string }) => {
    switch (e.code) {
        case 'KeyW':
        case 'KeyS':
        case 'KeyA':
        case 'KeyD':
            return true
        default:
            return false
    }
}

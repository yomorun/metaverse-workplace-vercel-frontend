// Distance per movement (in px)
const SPEED = 10

// Coordinate system: position & direction of movement
export class Vector {
    constructor(x, y) {
        this.x = x
        this.y = y
    }

    // Calculation of move position = CurrentPosition.add(Move_Direction_Vector)
    add(vec) {
        this.x += vec.x * SPEED
        this.y += vec.y * SPEED
        return this
    }

    equal(vec) {
        return this.x === vec.x && this.y === vec.y;
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
export const move = (e) => {
    var dir
    switch (e.keyCode) {
        case 119:
            dir = dirUp
            break
        case 115:
            dir = dirDown
            break
        case 97:
            dir = dirLeft
            break
        case 100:
            dir = dirRight
    }
    return Object.assign(e, { dir })
}

// Compute position changed on every movement
export const stepMove = (currentPosition, direction) => {
    return currentPosition.add(direction)
}

import { Vector, move } from '../libs/movement'

test('Vector (50, 50) + direction (-1, 0) -> (40, 50)', () => {
    const p = new Vector(50, 50)
    const dir = new Vector(-1, 0)

    p.add(dir)

    expect(p).toEqual({ x: 40, y: 50 })
})

describe('Check move()', () => {
    it('Move to the left', () => {
        expect(move({ code: 'ArrowLeft' })).toEqual(new Vector(-1, 0))
    })
    
    it('Move to the up', () => {
        expect(move({ code: 'ArrowUp' })).toEqual(new Vector(0, -1))
    })
    
    it('Move to the right', () => {
        expect(move({ code: 'ArrowRight' })).toEqual(new Vector(1, 0))
    })
    
    it('Move to the down', () => {
        expect(move({ code: 'ArrowDown' })).toEqual(new Vector(0, 1))
    })
})

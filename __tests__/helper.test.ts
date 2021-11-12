import { calcDistance, checkCircularCollision, getSceneScale } from '../libs/helper'

test('The distance between the point (0,0) and the point (0,5) is equal to 5', () => {
    expect(calcDistance(0, 0, 0, 5)).toBe(5)
})

describe('Check for circular collisions', () => {
    it('(x1=0, y1=0, r1=5) and (x2=0, y2=5, r1=10) have collided', () => {
        expect(checkCircularCollision(0, 0, 5, 0, 5, 10)).toBe(true)
    })

    it('(x1=0, y1=0, r1=5) and (x2=20, y2=20, r1=10) will not collide', () => {
        expect(checkCircularCollision(0, 0, 5, 20, 20, 10)).toBe(false)
    })
})

describe('Get scene scale', () => {
    global.innerWidth = 1920
    global.innerHeight = 1200

    it('The value of getSceneScale(1920, 1200) is equal to 0.95', () => {
        expect(getSceneScale(1920, 1200).value).toBe(0.95)
    })

    it('The value of getSceneScale(1900, 1000) is equal to 1', () => {
        expect(getSceneScale(1900, 1000).value).toBe(1)
    })
})

import { selector } from 'recoil'
import { mateMapState } from './atom'

export const onlineCountState = selector({
    key: 'onlineCountState',
    get: ({ get }) => {
        const mateMap = get(mateMapState)
        return mateMap.size + 1
    },
})

export const matesState = selector({
    key: 'matesState',
    get: ({ get }) => {
        const mateMap = get(mateMapState)
        const mates = []
        for (const m of mateMap.values()) {
            mates.push(m)
        }
        return mates
    },
})

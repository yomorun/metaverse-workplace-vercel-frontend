import React from 'react'

import Mate from './mate'

import { useRecoilValue } from 'recoil'
import { matesState } from '../../store/selector'

import type { Socket } from 'socket.io-client'

const Mates = ({ socket }: { socket: Socket }) => {
    const mates = useRecoilValue(matesState)

    return (
        <>
            {mates.map(m => (
                <Mate
                    key={m.name}
                    name={m.name}
                    country={m.country}
                    avatar={m.avatar}
                    initPos={m.pos}
                    socket={socket}
                />
            ))}
        </>
    )
}
export default Mates

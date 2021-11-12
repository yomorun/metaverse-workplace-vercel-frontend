import { useEffect, useState } from 'react'

import { useSetRecoilState } from 'recoil'
import { mateMapState, onlineState } from '../../store/atom'

import { Vector } from '../../libs/movement'
import { Logger } from '../../libs/helper'

import io from 'socket.io-client'
import type { Socket } from 'socket.io-client'
import type { User, Position } from '../../types'

type Props = {
    me: User
    position: Position
    room: string
}

export default function useSocket({ me, position, room }: Props) {
    const [socket, setSocket] = useState<Socket | null>(null)
    const setMateMapState = useSetRecoilState(mateMapState)
    const setOnlineState = useSetRecoilState(onlineState)

    useEffect(() => {
        if (!me.name) {
            return
        }
        
        const log = new Logger('Scene', 'color: green; background: yellow')

        // init socket.io client
        const socket: Socket = io(process.env.NEXT_PUBLIC_WEBSOCKET_URL, {
            transports: ['websocket'],
            reconnection: true,
            reconnectionDelayMax: 10000,
            reconnectionAttempts: 50,
            autoConnect: false,
        })

        // `online` event will be occured when user is connected to websocket
        socket.on('online', mate => {
            log.log('[online]', mate.name)
            if (mate.name === me.name) {
                log.log('[online] is Me, ignore', me.name)
                return
            }

            setMateMapState(old => {
                if (old.has(mate.name)) {
                    return old
                }

                mate.pos = new Vector(position.x, position.y)
                const mateMap = new Map(old)
                mateMap.set(mate.name, mate)
                return mateMap
            })
        })

        // `offline` event will be occured when other users leave
        socket.on('offline', mate => {
            log.log('[offline]', mate.name)
            setMateMapState(old => {
                const mateMap = new Map(old)
                mateMap.delete(mate.name)
                return mateMap
            })
        })

        socket.on('sync', state => {
            log.log('[sync]', state, ', Me:', me.name)
            if (state.name === me.name) {
                log.log('[sync] is Me, ignore', me.name)
                return
            }

            setMateMapState(old => {
                if (old.has(state.name)) {
                    return old
                }

                const mateMap = new Map(old)
                mateMap.set(state.name, state)
                return mateMap
            })
        })

        // broadcast to others I am online when WebSocket connected
        socket.on('connect', () => {
            // log.log('WS CONNECTED', socket.id, socket.connected)
            socket.emit('online', { room, name: me.name, avatar: me.image })
            setOnlineState(true)
        })

        socket.on('disconnect', () => {
            setOnlineState(false)
        })

        socket.on('connect_error', error => {
            console.error('WS CONNECT_ERROR', error)
            setOnlineState(false)
        })

        setSocket(socket)

        return () => {
            setMateMapState(new Map())
            socket.disconnect('bye')
        }
    }, [me])

    return socket
}

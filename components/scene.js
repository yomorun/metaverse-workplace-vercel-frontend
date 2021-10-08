import { useCallback, useEffect, useState } from 'react'
import Router from 'next/router'
import io from 'socket.io-client'
import Sidebar from './sidebar'
import { Vector } from '../libs/movement'
import { Logger, isMobile } from '../libs/lib'
import Me from './me'
import Mate from './mate'
import Distance from './distance'
import EnterArea from './enterarea'

export default function Scene({ floor, boundary, initialPosition = { x: 30, y: 60 }, showEnterArea = false }) {
    const [ws, setWS] = useState(null)
    const [onlineState, setOnlineState] = useState(false)
    const [me, setMe] = useState(null)
    const [mates, setMates] = useState([])
    const [ismobile, setIsMobile] = useState(false)

    useEffect(() => {
        setIsMobile(isMobile())

        const accessToken = localStorage.getItem(process.env.NEXT_PUBLIC_ACCESSTOKENKEY)
        if (!accessToken) {
            Router.push('/login')
            return
        }

        const me = JSON.parse(localStorage.getItem(process.env.NEXT_PUBLIC_USERKEY))
        setMe(me)
    }, [])

    useEffect(() => {
        if (me) {
            const log = new Logger('Scene', 'color: green; background: yellow')

            // init socket.io client
            const ws = io(process.env.NEXT_PUBLIC_WEBSOCKET_URL, {
                transports: ['websocket'],
                reconnection: true,
                reconnectionDelayMax: 10000,
                reconnectionAttempts: 50,
                autoConnect: false
            })

            // `online` event will be occured when user is connected to websocket
            ws.on('online', mate => {
                log.log('[online]', mate.name)
                if (mate.name === me.login) {
                    log.log('[online] is Me, ignore', me.login)
                    return
                }
                mate.key = mate.name
                mate.pos = new Vector(initialPosition.x, initialPosition.y)
                setMates(arr => [...arr, mate])
            })

            // `offline` event will be occured when other users leave
            ws.on('offline', mate => {
                log.log('[offline]', mate.name)
                setMates(arr => arr.filter(p => p.name !== mate.name))
            })

            ws.on('ask', p => {
                log.log('[ask]', p)
            })

            ws.on('movement', mv => {
                log.log('[movement]', mv)
            })

            ws.on('sync', state => {
                log.log('[sync]', state, ', Me:', me.login)
                if (state.name === me.login) {
                    log.log('[sync] is Me, ignore', me.login)
                    return
                }

                setMates(arr => {
                    let shouldAdd = arr.every(p => {
                        if (p.name === state.name) {
                            return false
                        }
                        return true
                    })
                    if (shouldAdd) {
                        log.log('[sync] add', state)
                        state.key = state.name
                        return [...arr, state]
                    }
                    return arr
                })
            })

            // broadcast to others I am online when WebSocket connected
            ws.on('connect', () => {
                log.log('WS CONNECTED', ws.id, ws.connected)

                ws.emit('online', {
                    name: me.login,
                    avatar: me.avatar,
                    room: floor
                })

                setOnlineState(true)
            })

            ws.on('disconnect', (reason) => {
                console.error('WS DISCONNECT', reason)
                setOnlineState(false)
            })

            ws.on('connect_error', (error) => {
                console.error('WS CONNECT_ERROR', error)
                setOnlineState(false)
            })

            setWS(ws)

            return () => {
                ws.disconnect('bye')
            }
        }
    }, [me])

    const rtcJoinedCallback = useCallback(rtcClient => {
        const setTrack = (id, mediaType, trackObject) => {
            setMates(arr => {
                for (let i = 0, len = arr.length; i < len; i++) {
                    if (arr[i].name === id) {
                        arr[i][`${mediaType}Track`] = trackObject
                        break
                    }
                }
                return [...arr]
            })
        }

        rtcClient.on('user-published', (remoteUser, mediaType) => {
            rtcClient.subscribe(remoteUser, mediaType).then(track => {
                setTrack(remoteUser.uid, mediaType, track)
            })
        })

        rtcClient.on('user-unpublished', (remoteUser, mediaType) => {
            setTrack(remoteUser.uid, mediaType, null)
        })
    }, [])

    if (!me || !ws) {
        return null
    }

    return (
        <>
            <Sidebar onlineState={onlineState} count={mates.length + 1} />
            {showEnterArea && !ismobile && <EnterArea sock={ws} elementIdPrefix='stream-player-' hostId={me.login} />}
            <div className='fixed w-screen h-screen sm:overflow-y-auto sm:grid sm:grid-cols-3 sm:gap-2'>
                <Me
                    name={me.login}
                    avatar={me.avatar}
                    initPos={initialPosition}
                    sock={ws}
                    rtcJoinedCallback={rtcJoinedCallback}
                    floor={floor}
                    boundary={boundary}
                />
                {mates.map(m => (
                    <Mate
                        key={m.name}
                        name={m.name}
                        avatar={m.avatar}
                        initPos={m.pos}
                        sock={ws}
                        videoTrack={m.videoTrack}
                        audioTrack={m.audioTrack}
                        hostId={me.login}
                        boundary={boundary}
                    />
                ))}
            </div>
            {!ismobile && <Distance
                elementIdPrefix='stream-player-'
                meId={me.login}
                matesIdList={mates.map(item => item.name)}
                sock={ws}
            />}
        </>
    )
}

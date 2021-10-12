import { useCallback, useEffect, useState } from 'react'
import Router from 'next/router'
import cn from 'classnames'
import io from 'socket.io-client'

import Sidebar from './sidebar'
import Me from './me'
import Mate from './mate'
import Distance from './distance'
import AnchorArea from './anchor-area'

import { Vector } from '../libs/movement'
import { Logger, checkMobileDevice } from '../libs/lib'

const Scene = ({
    floor, backgroundImage, anchorAreaList,
    playerInitialPosition = { x: 30, y: 60 },
    showDistanceChange = false, showWall = false
}) => {
    const [ws, setWS] = useState(null)
    const [onlineState, setOnlineState] = useState(false)
    const [me, setMe] = useState(null)
    const [mates, setMates] = useState([])
    const [isMobile, setIsMobile] = useState(false)

    useEffect(() => {
        setIsMobile(checkMobileDevice())

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
                mate.pos = new Vector(playerInitialPosition.x, playerInitialPosition.y)
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

            // ws.on('movement', mv => {
            //     log.log('[movement]', mv)
            // })

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

    const playerDiameter = me.role === 'broadcast' ? 128 : 64

    return (
        <>
            <Sidebar onlineState={onlineState} count={mates.length + 1} />
            <div
                className={
                    cn('relative w-1600px h-800px overflow-hidden sm:w-full sm:h-full sm:border-0', {
                        'wall': showWall,
                        // 'transform scale-125': !isMobile,
                    })
                }
            >
                <img className='absolute top-0 left-0 w-full h-full sm:hidden' src={backgroundImage} />
                {!isMobile && anchorAreaList &&
                    <AnchorArea
                        sock={ws}
                        hostPlayerId={me.login}
                        hostPlayerBoxId='host-player-box'
                        anchorAreaList={anchorAreaList}
                    />
                }
                <div className='relative w-full h-full sm:fixed sm:overflow-y-auto sm:grid sm:grid-cols-3 sm:gap-2'>
                    <Me
                        role={me.role}
                        name={me.login}
                        avatar={me.avatar}
                        initPos={playerInitialPosition}
                        sock={ws}
                        rtcJoinedCallback={rtcJoinedCallback}
                        floor={floor}
                        boundary={{
                            top: 0,
                            left: 0,
                            bottom: 800 - playerDiameter,
                            right: 1600 - playerDiameter
                        }}
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
                            hostPlayerId={me.login}
                        />
                    ))}
                </div>
            </div>
            {!isMobile && showDistanceChange &&
                <Distance
                    elementIdPrefix='stream-player-'
                    hostPlayerId={me.login}
                    matesIdList={mates.map(item => item.name)}
                    sock={ws}
                />
            }
        </>
    )
}

export default Scene

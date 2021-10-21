import dynamic from 'next/dynamic'
import { useCallback, useEffect, useState, useContext } from 'react'
import { Context } from '../context'
import Router from 'next/router'
import io from 'socket.io-client'
import cn from 'classnames'

import Me from './me'
import Mate from './mate'
import Sidebar from './sidebar'

import { Vector } from '../libs/movement'
import { Logger, checkMobileDevice, getScale, isDuringDate } from '../libs/lib'

const CheckArea = dynamic(() => import('./check-area'))
const Drawer = dynamic(() => import('./drawer'))
const Floors = dynamic(() => import('./floors'))
const Guide = dynamic(() => import('./guide'))

const Scene = ({
    className, floor, backgroundImage, checkAreaList,
    playerInitialPosition = { x: 60, y: 60 }, width = 1800, height = 900,
    boundary = { top: 0, left: 0, bottom: 1000, right: 1600 }
}) => {
    const [ws, setWS] = useState(null)
    const [onlineState, setOnlineState] = useState(false)
    const [me, setMe] = useState(null)
    const [mates, setMates] = useState([])
    const [isMobile, setIsMobile] = useState(false)
    const [scale, setScale] = useState(null)
    const { state: { drawer }, dispatch } = useContext(Context)

    useEffect(() => {
        setIsMobile(checkMobileDevice())
        setScale(getScale(width, height))

        const accessToken = localStorage.getItem(process.env.NEXT_PUBLIC_ACCESSTOKENKEY)
        if (!accessToken) {
            localStorage.setItem(process.env.NEXT_PUBLIC_FLOOR, floor)
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
                // log.log('WS CONNECTED', ws.id, ws.connected)

                ws.emit('online', {
                    name: me.login,
                    avatar: me.avatar,
                    room: floor
                })

                setOnlineState(true)
            })

            ws.on('disconnect', (reason) => {
                // console.log('WS DISCONNECT', reason)
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

    const closeDrawer = useCallback(() => {
        dispatch({
            type: 'CLOSE_DRAWER'
        })
    }, [])

    if (!scale || !me || !ws) {
        return null
    }

    return (
        <>
            <Sidebar onlineState={onlineState} count={mates.length + 1} isMobile={isMobile} />
            <div
                className={
                    cn(`relative ${className} sm:w-full sm:min-w-full sm:h-full sm:overflow-y-scroll`, {
                        [`${scale.className}`]: scale.value !== 1 && !isMobile
                    })
                }
            >
                {!isMobile && <img className='absolute top-0 left-0 w-full h-full' src={backgroundImage} />}
                <div className='relative w-full h-full sm:h-auto sm:pb-10 sm-grid '>
                    <Me
                        role={me.role}
                        name={me.login}
                        avatar={me.avatar}
                        initPos={playerInitialPosition}
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
                            hostPlayerId={me.login}
                        />
                    ))}
                </div>
                {!isMobile && checkAreaList &&
                    <CheckArea
                        sock={ws}
                        hostPlayerId={me.login}
                        hostPlayerBoxId='host-player-box'
                        checkAreaList={checkAreaList}
                        scale={scale.value}
                    />
                }
                {!isMobile && <Guide />}
            </div>
            {!isMobile &&
                <Drawer
                    isOpen={drawer.isOpen}
                    onClose={closeDrawer}
                >
                    {
                        drawer.iframeSrc
                            ? (
                                <iframe
                                    title=''
                                    width='100%'
                                    height='100%'
                                    src={drawer.iframeSrc}
                                />
                            ) : (
                                <div className='w-full h-full bg-black flex flex-col justify-center items-center px-2 overflow-y-auto'>
                                    {
                                        drawer.imgList.map(item => (
                                            isDuringDate(item.startAt, item.endAt) ? <img className='w-full mt-2' key={item.id} src={item.src} /> : null
                                        ))
                                    }
                                </div>
                            )
                    }
                </Drawer>
            }
            {!isMobile && <Floors currentPath={floor} />}
        </>
    )
}

export default Scene

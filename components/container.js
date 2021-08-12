import React, { useCallback, useEffect, useState } from 'react'
import Router from 'next/router'
import io from 'socket.io-client'
import Sidebar from '../components/sidebar'
import { Vector } from '../libs/movement'
import { Logger } from '../libs/lib'
import Me from './me'
import Mate from './mate'
import Distance from './distance'

// init socket.io client
const ws = io(process.env.NEXT_PUBLIC_WEBSOCKET_URL, {
    reconnectionDelayMax: 10000,
    transports: ['websocket'],
    reconnection: true,
    autoConnect: false
})

const log = new Logger('Container', 'color: green; background: yellow')

export default function Container() {
    const [logged, setLogged] = useState(false)
    const [onlineState, setOnlineState] = useState(false)
    const [me, setMe] = useState(null)
    const [mates, setMates] = useState([])
    const [calcDistanceCount, setCalcDistanceCount] = useState(0)

    useEffect(() => {
        const accessToken = localStorage.getItem(process.env.NEXT_PUBLIC_ACCESSTOKENKEY)
        if (!accessToken) {
            Router.push('/login')
            return
        }
        setLogged(true)
    }, [])

    useEffect(() => {
        if (logged) {
            const u = localStorage.getItem(process.env.NEXT_PUBLIC_USERKEY)
            const me = JSON.parse(u)
            setMe(me)
            log.log('me: ', me)

            // `online` event will be occured when user is connected to websocket
            ws.on('online', mate => {
                if (mate.name === me.login) {
                    log.log('[online] is Me, ignore', me.login)
                    return
                }
                mate.key = mate.name
                mate.pos = new Vector(15, 15)
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
                setCalcDistanceCount(pre => pre + 1)
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
                ws.emit('online', { name: me.login, avatar: me.avatar })
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

            return () => {
                ws.disconnect('bye')
            }
        }
    }, [logged])

    const rtcJoinedCallback = useCallback(rtcClient => {
        rtcClient.on('user-published', (remoteUser, mediaType) => {
            if (mediaType === 'video') {
                rtcClient.subscribe(remoteUser, mediaType).then(track => {
                    setMates(arr => {
                        for (let i = 0; i < arr.length; i++) {
                            if (arr[i].name === remoteUser.uid) {
                                arr[i].track = track
                            }
                        }
                        return [...arr]
                    })
                })
            }

            if (mediaType === 'audio') {
                rtcClient.subscribe(remoteUser, mediaType).then(track => {
                    track.play()
                })
            }
        })

        rtcClient.on('user-unpublished', (remoteUser, mediaType) => {
            if (mediaType === 'video') {
                setMates(arr => {
                    for (let i = 0; i < arr.length; i++) {
                        if (arr[i].name === remoteUser.uid) {
                            arr[i].track = null
                        }
                    }
                    return [...arr]
                })
            }
        })
    }, [])

    if (!me) {
        return null
    }

    return (
        <>
            <Sidebar onlineState={onlineState} count={mates.length + 1} />
            {mates.map(m => (
                <Mate
                    key={m.name}
                    name={m.name}
                    avatar={m.avatar}
                    initPos={m.pos}
                    sock={ws}
                    track={m.track}
                />
            ))}
            <Me
                name={me.login}
                avatar={me.avatar}
                initPos={{ x: 30, y: 30 }}
                sock={ws}
                rtcJoinedCallback={rtcJoinedCallback}
            />
            <Distance
                calcDistanceCount={calcDistanceCount}
                elementIdPrefix='stream-player-'
                meId={me.login}
                matesIdList={mates.map(item => item.name)}
            />
        </>
    )
}

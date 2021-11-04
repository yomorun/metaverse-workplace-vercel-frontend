import { useEffect, useRef, memo } from 'react'
import { fromEvent } from 'rxjs'
import { map, filter, scan, auditTime } from 'rxjs/operators'

import { useSetRecoilState } from 'recoil'
import { mePositionState } from '../../store/atom'

import Webcam from '../rtc/webcam'

import { Vector, move } from '../../libs/movement'
import { Logger, checkMobileDevice } from '../../libs/helper'
import { playerDiameter } from '../../libs/constant'

import type { Socket } from 'socket.io-client'
import type { Boundary, Position } from '../../types'

// Only accepts events from the W, A, S and D buttons
const keyPressWASD = (e: { keyCode: number }) => {
    switch (e.keyCode) {
        case 119:
        case 115:
        case 97:
        case 100:
            return true
        default:
            return false
    }
}

// Stop player from stepping out of borders
const boundaryProcess = (p: { currPos: Vector; dir: Vector }, boundary: Boundary) => {
    const { currPos } = p
    let collided = false

    if (currPos.x < boundary.left) {
        currPos.x = boundary.left
        collided = true
    }

    if (currPos.x > boundary.right - playerDiameter) {
        currPos.x = boundary.right - playerDiameter
        collided = true
    }

    if (currPos.y < boundary.top) {
        currPos.y = boundary.top
        collided = true
    }

    if (currPos.y > boundary.bottom - playerDiameter) {
        currPos.y = boundary.bottom - playerDiameter
        collided = true
    }

    return {
        collided,
        ...p,
    }
}

type Props = {
    name: string
    avatar: string
    initPos: Position
    socket: Socket
    channel: string
    boundary: Boundary
}

const Me = ({ name, avatar, initPos, socket, channel, boundary }: Props) => {
    const refContainer = useRef<HTMLDivElement>(null)

    const setMePositionState = useSetRecoilState(mePositionState)

    useEffect(() => {
        const log = new Logger('Me', 'color: white; background: green')

        // default position
        const POS = new Vector(initPos.x || 0, initPos.y || 0)

        // Redraw UI
        const renderPosition = (p: Position) => {
            if (refContainer.current) {
                refContainer.current.setAttribute(
                    'style',
                    `transform: translate3d(${p.x}px, ${p.y}px, 0);`
                )
            }
        }

        const isMobile = checkMobileDevice()

        if (!isMobile) {
            // initial position
            renderPosition(POS)
        }

        // Answer server query, when other mates go online, server will ask others' states,
        // this is the response
        socket.on('ask', () => {
            log.log('[ask], response as', name, 'avatar:', avatar)
            socket.emit('sync', { name: name, pos: POS, avatar: avatar })
        })

        // TODO：Broadcast movement event streams to others in this game room
        const broadcastEvent = (evt: any) => {
            socket.emit('movement', { dir: evt })
        }

        // keyboard `keypress` event, we use keyboard to control moving actions
        const evtKeyPress = fromEvent(document, 'keypress').pipe(
            auditTime(16),
            map((e: any) => {
                return { evt: 'move', keyCode: e.keyCode }
            })
        )

        // ignore keys other than W/A/S/D
        const keyPress$ = evtKeyPress.pipe(filter(keyPressWASD))

        // stream of direction changing, this will turns w/a/s/d keypress event into direction vector changing streams
        const direction$ = keyPress$.pipe(
            map(move),
            map(p => p.dir)
        )

        const scanFn = (p: any, _dir: any) => {
            const { currPos = POS } = p
            return {
                currPos: currPos.add(_dir),
                dir: _dir,
            }
        }

        // every direction changing event will cause position movement
        direction$
            .pipe(
                scan(scanFn, POS),
                map(p => boundaryProcess(p, boundary))
            )
            .subscribe(({ currPos, dir, collided }) => {
                renderPosition(currPos)

                setMePositionState({
                    x: currPos.x,
                    y: currPos.y,
                })

                if (!collided) {
                    // emit to others over websocket
                    broadcastEvent(dir)
                }
            })

        // connect to socket.io server
        socket.connect()

        // Add movement transition, it looks smoother
        setTimeout(() => {
            if (refContainer.current) {
                refContainer.current.classList.add('movement-transition')
            }
        }, 1000)

        return () => {
            log.log('[Unmount] event')
        }
    }, [])

    return (
        <div className='absolute max-h-40 sm:relative sm-grid-card' ref={refContainer}>
            <Webcam cover={avatar} name={name} channel={channel} />
            <div className='absolute top-32 left-1/2 transform -translate-x-1/2 text-base text-white font-bold whitespace-nowrap sm:top-28'>
                {name}
            </div>
        </div>
    )
}

export default memo(Me, () => true)

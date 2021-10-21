import { useEffect, useRef, memo } from 'react'
import { fromEvent } from 'rxjs'
import { map, filter, scan, auditTime } from 'rxjs/operators'
import cn from 'classnames'

import Webcam from './webcam'

import { Vector, move } from '../libs/movement'
import { Logger, checkMobileDevice } from '../libs/lib'

// Only accepts events from the W, A, S and D buttons
const keyPressWASD = (e) => {
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
const boundaryProcess = (p, boundary, playerDiameter, role) => {
    const { currPos, dir } = p
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

    if (boundary.lectern && role !== 'broadcast') {
        const lecternCollided = currPos.x > boundary.lectern.left - playerDiameter && currPos.y < boundary.lectern.bottom
        if (lecternCollided) {
            if (dir.x === 1) {
                currPos.x = boundary.lectern.left - playerDiameter
                collided = true
            } else if (dir.y === -1) {
                currPos.y = boundary.lectern.bottom
                collided = true
            }
        }
    }

    return {
        collided,
        ...p
    }
}

const Me = ({
    name, avatar, role, initPos, sock, rtcJoinedCallback, floor,
    boundary = { top: 0, bottom: 1000, left: 0, right: 1200 },
}) => {
    const refContainer = useRef(null)

    useEffect(() => {
        const log = new Logger('Me', 'color: white; background: green')

        // default position
        const POS = new Vector(initPos.x || 0, initPos.y || 0)

        const playerDiameter = role === 'broadcast' ? 128 : 64

        // Redraw UI
        const renderPosition = (p) => {
            if (refContainer.current) {
                refContainer.current.style = `transform: translate3d(${p.x}px, ${p.y}px, 0);`
            }
        }

        const isMobile = checkMobileDevice()

        if (!isMobile) {
            // initial position
            renderPosition(POS)
        }

        // Answer server query, when other mates go online, server will ask others' states,
        // this is the response
        sock.on('ask', () => {
            log.log('[ask], response as', name, 'avatar:', avatar)
            sock.emit('sync', { name: name, pos: POS, avatar: avatar })
        })

        // TODO：Broadcast movement event streams to others in this game room
        const broadcastEvent = (evt) => {
            sock.emit('movement', { dir: evt })
        }

        // keyboard `keypress` event, we use keyboard to control moving actions
        const evtKeyPress = fromEvent(document, 'keypress').pipe(
            auditTime(16),
            map((e) => {
                return { evt: 'move', keyCode: e.keyCode }
            })
        )

        // ignore keys other than W/A/S/D
        const keyPress$ = evtKeyPress.pipe(filter(keyPressWASD))

        // stream of direction changing, this will turns w/a/s/d keypress event into direction vector changing streams
        const direction$ = keyPress$.pipe(
            map(move),
            map((p) => p.dir)
        )

        // every direction changing event will cause position movement
        direction$
            .pipe(
                scan(({ currPos = POS }, _dir) => ({ currPos: currPos.add(_dir), dir: _dir }), POS),
                map(p => boundaryProcess(p, boundary, playerDiameter, role))
            )
            .subscribe(({ currPos, dir, collided }) => {

                renderPosition(currPos)

                if (!collided) {
                    // emit to others over websocket
                    broadcastEvent(dir)
                }
            })

        // connect to socket.io server
        sock.connect()

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
        <div className='z-10 absolute max-h-40 sm:relative sm-grid-card' id='host-player-box' ref={refContainer}>
            <Webcam cover={avatar} name={name} rtcJoinedCallback={rtcJoinedCallback} channel={floor} role={role} />
            <div
                className={
                    cn('absolute left-1/2 transform -translate-x-1/2 text-sm text-white font-bold whitespace-nowrap', {
                        'top-32 sm:top-28': role === 'broadcast',
                        'top-16 sm:top-28': role !== 'broadcast'
                    })
                }
            >
                {name}
            </div>
        </div>
    )
}

export default memo(Me, () => true)

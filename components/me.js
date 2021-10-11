import { useEffect, useRef, memo } from 'react'
import { fromEvent } from 'rxjs'
import { map, filter, scan, auditTime } from 'rxjs/operators'

import { Vector, move } from '../libs/movement'
import { Logger, isMobile } from '../libs/lib'

import Webcam from './webcam'

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
const boundaryProcess = (p, boundary) => {
    const { currPos } = p
    let isBoundary = false

    if (currPos.x < boundary.left) {
        currPos.x = boundary.left
        isBoundary = true
    }

    if (currPos.x > boundary.right) {
        currPos.x = boundary.right
        isBoundary = true
    }

    if (currPos.y < boundary.top) {
        currPos.y = boundary.top
        isBoundary = true
    }

    if (currPos.y > boundary.bottom) {
        currPos.y = boundary.bottom
        isBoundary = true
    }

    return {
        isBoundary,
        ...p
    }
}

function Me({ name, avatar, initPos, sock, rtcJoinedCallback, floor, boundary = { top: 0, bottom: 2000, left: 0, right: 2000 } }) {
    const refContainer = useRef(null)

    useEffect(() => {
        const log = new Logger('Me', 'color: white; background: green')

        const _isMobile = isMobile()

        // default position
        const POS = new Vector(initPos.x || 0, initPos.y || 0)

        if (_isMobile) {
            POS.x = 0
            POS.y = boundary.top + 60
        }

        // Redraw UI
        const renderPosition = (p) => {
            if (refContainer.current) {
                refContainer.current.style = `transform: translate3d(${p.x}px, ${p.y}px, 0);`
            }
        }

        // initial position
        renderPosition(POS)

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
                map(p => boundaryProcess(p, boundary))
            )
            .subscribe(({ currPos, dir, isBoundary }) => {

                renderPosition(currPos)

                if (!isBoundary) {
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
        <div className='absolute sm:relative max-h-40' id='host-player-box' ref={refContainer}>
            <Webcam cover={avatar} name={name} rtcJoinedCallback={rtcJoinedCallback} channel={floor} />
            <div className='mt-2 text-base text-center text-white font-bold'>{name}</div>
        </div>
    )
}

export default memo(Me, () => true)

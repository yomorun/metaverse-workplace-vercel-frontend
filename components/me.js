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
    let isBorder = false

    if (currPos.x < boundary.left) {
        currPos.x = boundary.left
        isBorder = true
    }

    if (currPos.x > boundary.right) {
        currPos.x = boundary.right
        isBorder = true
    }

    if (currPos.y < boundary.top) {
        currPos.y = boundary.top
        isBorder = true
    }

    if (currPos.y > boundary.bottom) {
        currPos.y = boundary.bottom
        isBorder = true
    }

    return {
        isBorder,
        ...p
    }
}

const Me = ({
    name, avatar, initPos, sock, rtcJoinedCallback, floor,
    boundary = { top: 0, bottom: 1000, left: 0, right: 1200 },
    loginType = 'visitor'
}) => {
    const refContainer = useRef(null)

    useEffect(() => {
        const log = new Logger('Me', 'color: white; background: green')

        const _isMobile = isMobile()

        // default position
        const POS = new Vector(initPos.x || 0, initPos.y || 0)

        if (_isMobile) {
            POS.x = 0
            POS.y = 60
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
            .subscribe(({ currPos, dir, isBorder }) => {

                renderPosition(currPos)

                if (!isBorder) {
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

    if (loginType === 'host') {
        return (
            <div className='absolute sm:relative max-h-40' id='host-player-box' ref={refContainer}>
                <Webcam cover={avatar} name={name} rtcJoinedCallback={rtcJoinedCallback} channel={floor} />
                <div className='absolute top-36 sm:top-32 left-1/2 transform -translate-x-1/2 text-sm text-white font-bold whitespace-nowrap'>{name}</div>
            </div>
        )
    } else if (loginType === 'visitor') {
        return (
            <div className='absolute sm:relative max-h-40' id='host-player-box' ref={refContainer}>
                <div className='relative mx-auto w-16 h-16 sm:w-28 sm:h-28 rounded-full overflow-hidden shadow-lg bg-white'>
                    <img className='w-full h-full' src={avatar} alt='avatar' />
                </div>
                <div className='absolute top-20 sm:top-32 left-1/2 transform -translate-x-1/2 text-sm text-white font-bold whitespace-nowrap'>{name}</div>
            </div>
        )
    } else {
        return null
    }
}

export default memo(Me, () => true)

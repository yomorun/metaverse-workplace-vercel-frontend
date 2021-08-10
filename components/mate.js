import { useEffect, useState } from 'react'
import { Observable } from 'rxjs'
import { scan } from 'rxjs/operators'

import { Vector, move } from '../libs/movement'
import { Logger } from '../libs/lib'

export default function Mate({ name, avatar, initPos, sock, track }) {
    // position of the avatar
    const [left, setLeft] = useState(0)
    const [top, setTop] = useState(0)

    const log = new Logger(`Mate:${name}`, 'color: white; background: orange')

    useEffect(() => {
        // default position
        const POS = new Vector(initPos.x || 0, initPos.y || 0)

        // Redraw UI
        const renderPosition = (p) => {
            setLeft(p.x)
            setTop(p.y)
        }

        // initial position
        renderPosition(POS)

        const direction$ = new Observable(obs => {
            sock.on('movement', mv => {
                if (mv.name != name) {
                    return
                }
                obs.next(mv.dir)
            })
        })

        // every direction changing event will cause position movement
        direction$.pipe(scan((currPos, dir) => currPos.add(dir), POS)).subscribe(renderPosition)

        return () => {
            log.log('unload')
        }
    }, [])

    useEffect(() => {
        if (track) {
            track.play(`stream-player-${name}`)
        }
    }, [track])

    return (
        <div
            className='absolute'
            style={{
                transform: `translate3d(${left}px, ${top}px, 0)`
            }}
        >
            <div className='w-32 h-32 rounded-full overflow-hidden transform translate-0 shadow-lg'>
                <div id={`stream-player-${name}`} className='w-full h-full'>
                    {!track && <img className='w-full h-full' src={avatar} />}
                </div>
            </div>
            <div className='mt-2 text-base text-center text-white font-bold'>{name}</div>
        </div>
    )
}
